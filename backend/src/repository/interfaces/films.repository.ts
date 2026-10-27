import { FilmDto } from '../../films/dto/films.dto';
import { OrderDto } from '../../order/dto/order.dto';

export interface FilmsRepository {
  findAllFilms(): Promise<any[]>;
  findFilmById(id: string): Promise<FilmDto | null>;
  createOrder(dto: OrderDto, ticketsData: any[]): Promise<any[]>;
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
