import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/interfaces/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly repo: FilmsRepository,
  ) {}

  async getAll() {
    const films = await this.repo.findAllFilms();
    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule,
    }));
    return { total: items.length, items };
  }

  async getSchedule(id: string) {
    const film = await this.repo.findFilmById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    const schedule = film.schedule ?? [];
    return { total: schedule.length, items: schedule };
  }
}
