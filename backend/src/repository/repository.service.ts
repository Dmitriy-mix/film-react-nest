import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';
import { plainToInstance } from 'class-transformer';
import { FilmDto } from '../films/dto/films.dto';

@Injectable()
export class RepositoryService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAllFilms(): Promise<FilmDocument[]> {
    return this.filmModel.find().lean().exec() as unknown as FilmDocument[];
  }

  async findFilmById(id: string): Promise<FilmDto> {
    const film = await this.filmModel.findOne({ id }).lean().exec();
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
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
