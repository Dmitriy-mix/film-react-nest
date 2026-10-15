import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { FilmDto } from '../films/dto/films.dto';

@Injectable()
export class RepositoryService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAllFilms(): Promise<Film[]> {
    return this.filmModel.find().lean().exec();
  }

  async findFilmById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).lean().exec();
    if (!film) {
      return null;
    }
    return plainToInstance(FilmDto, film);
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': seatKey } },
      )
      .exec();
  }
}
