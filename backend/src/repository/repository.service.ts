import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { FilmsRepository } from './interfaces/films.repository';
import { OrderDto } from '../order/dto/order.dto';
import { FilmDto } from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private filmRepo: Repository<Film>,
    private dataSource: DataSource,
  ) {}

  async findAllFilms(): Promise<Film[]> {
    return this.filmRepo.find({ relations: ['schedule'] });
  }

  async findFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });

    if (!film) {
      return null;
    }

    const filmDto = plainToInstance(FilmDto, film);

    if (filmDto.schedule && film.schedule) {
      for (const sessionDto of filmDto.schedule) {
        try {
          const orders = await this.dataSource.getRepository(Order).find({
            where: { session: { id: sessionDto.id } },
          });

          sessionDto.taken = orders.map(
            (order) => `${order.row}:${order.seat}`,
          );
        } catch (error) {
          sessionDto.taken = [];
        }
      }
    }

    return filmDto;
  }

  async createOrder(dto: OrderDto, ticketsData: any[]): Promise<any[]> {
    return await this.dataSource.transaction(async (manager) => {
      const createdOrders = [];

      for (const ticket of ticketsData) {
        const isTaken = await manager.findOne(Order, {
          where: {
            session: { id: ticket.session },
            row: ticket.row,
            seat: ticket.seat,
          },
        });

        if (isTaken) {
          throw new BadRequestException(
            `Seat ${ticket.row}:${ticket.seat} is already taken`,
          );
        }

        const newOrder = manager.create(Order, {
          email: dto.email,
          phone: dto.phone,
          row: ticket.row,
          seat: ticket.seat,
          price: ticket.price,
          session: { id: ticket.session },
        });

        await manager.save(newOrder);
        createdOrders.push({ ...ticket, id: newOrder.id });
      }

      return createdOrders;
    });
  }
}
