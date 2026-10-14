import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RepositoryService } from '../repository/repository.service';
import { OrderDto, OrderItemDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly repo: RepositoryService) {}

  async create(
    dto: OrderDto,
  ): Promise<{ total: number; items: OrderItemDto[] }> {
    const created: OrderItemDto[] = [];

    for (const ticket of dto.tickets) {
      const film = await this.repo.findFilmById(ticket.film);
      if (!film) {
        throw new NotFoundException(`Film ${ticket.film} not found`);
      }

      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(`Session ${ticket.session} not found`);
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      await this.repo.addTakenSeats(ticket.film, ticket.session, seatKey);
      created.push({ ...ticket, id: randomUUID() });
    }

    return { total: created.length, items: created };
  }
}
