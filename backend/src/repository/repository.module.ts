import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppRepository } from './repository.service';
import { FILMS_REPOSITORY } from './interfaces/films.repository';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { Order } from './entities/order.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule, Order])],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: AppRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
