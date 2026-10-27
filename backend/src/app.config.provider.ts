import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

const config: AppConfig = {
  database: {
    driver: process.env.DATABASE_DRIVER ?? 'mongodb',
    url: process.env.DATABASE_URL ?? 'mongodb://127.0.0.1:27017/practicum',
  },
};

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: config,
};
