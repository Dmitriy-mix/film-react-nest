import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RepositoryService } from './repository.service';
import { Film, FilmSchema } from '../films/schemas/film.schema';
import { configProvider } from '../app.config.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [RepositoryService, configProvider],
  exports: [RepositoryService],
})
export class RepositoryModule {}
