import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { ConfigService } from '@nestjs/config';

export function createLogger(configService: ConfigService): LoggerService {
  const type = configService.get<string>('LOGGER_TYPE', 'dev');

  switch (type) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    default:
      return new DevLogger();
  }
}
