import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryModule } from './repository/repository.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = new URL(
          config.get<string>('DATABASE_URL') ||
            'postgres://localhost:5432/films',
        );
        return {
          type: 'postgres',
          host: dbUrl.hostname,
          port: parseInt(dbUrl.port || '5432'),
          database: dbUrl.pathname.slice(1),
          username: config.get<string>('DATABASE_USERNAME') || 'postgres',
          password: config.get<string>('DATABASE_PASSWORD') || 'postgres',
          autoLoadEntities: true,
          synchronize: true
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
