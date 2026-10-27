import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from './repository/repository.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Schedule } from './repository/entities/schedule.entity';
import { Film } from './repository/entities/film.entity';
import { Order } from './repository/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('DATABASE_DRIVER', 'postgres');

        if (driver !== 'postgres') {
          console.warn(
            `Внимание: Неподдерживаемый DATABASE_DRIVER "${driver}". Используется postgres по умолчанию.`,
          );
        }

        return {
          type: 'postgres',
          host: config.get<string>('DATABASE_HOST', 'localhost'),
          port: config.get<number>('DATABASE_PORT', 5432),
          username: config.get<string>('DATABASE_USERNAME', 'postgres'),
          password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
          database: config.get<string>('DATABASE_NAME', 'films'),
          entities: [Film, Schedule, Order],
          synchronize: true,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    RepositoryModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
})
export class AppModule {}
