import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderDto, TicketDto } from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/interfaces/films.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async create(dto: OrderDto) {
    const ticketsData: TicketDto[] = [];

    for (const ticket of dto.tickets) {
      const film = await this.repo.findFilmById(ticket.film);
      if (!film) {
        throw new NotFoundException(`Film ${ticket.film} not found`);
      }

      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(`Session ${ticket.session} not found`);
      }

      ticketsData.push(ticket);
    }

    const created = await this.repo.createOrder(dto, ticketsData);

    return { total: created.length, items: created };
  }
}
