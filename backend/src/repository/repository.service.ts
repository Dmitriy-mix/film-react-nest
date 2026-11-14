import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from './interfaces/films.repository';
import { OrderDto, TicketDto } from '../order/dto/order.dto';
import { FilmDto } from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

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

    return film ? plainToInstance(FilmDto, film) : null;
  }

  async createOrder(dto: OrderDto, ticketsData: TicketDto[]): Promise<any[]> {
    return this.dataSource.transaction(async (manager) => {
      const items: Array<TicketDto & { id: string }> = [];

      for (const ticket of ticketsData) {
        const session = await manager.findOne(Schedule, {
          where: { id: ticket.session },
          lock: { mode: 'pessimistic_write' },
        });

        if (!session) {
          throw new NotFoundException('Сеанс не найден');
        }

        const seatKey = `${ticket.row}:${ticket.seat}`;

        if (session.taken.includes(seatKey)) {
          throw new BadRequestException('Место уже занято');
        }

        session.taken.push(seatKey);
        await manager.save(Schedule, session);

        items.push({ ...ticket, id: randomUUID() });
      }

      return items;
    });
  }
}