import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private format(level: string, message: any, ...optionalParams: any[]): string {
    const parts: string[] = [];
    parts.push(`level=${String(level)}`);
    parts.push(`message=${String(message)}`);
    if (optionalParams.length > 0) {
      parts.push(`params=${JSON.stringify(optionalParams)}`);
    }
    return parts.join('\t') + '\n';
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.format('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.format('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.format('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.format('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.format('verbose', message, ...optionalParams));
  }
}