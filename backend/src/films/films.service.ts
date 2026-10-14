import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class FilmsService {
  constructor(private readonly repo: RepositoryService) {}

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
    }));
    return { total: items.length, items };
  }

  async getSchedule(id: string) {
    const film = await this.repo.findFilmById(id);
    const schedule = film.schedule ?? [];
    return { total: schedule.length, items: schedule };
  }
}
