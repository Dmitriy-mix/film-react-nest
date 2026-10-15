import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @IsOptional()
  @IsString()
  day?: string;

  @IsString()
  daytime: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class OrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderItemDto extends TicketDto {
  @IsString()
  id: string;
}
