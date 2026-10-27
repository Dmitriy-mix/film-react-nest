import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'timestamp with time zone' })
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'int' })
  price: number;

  @Column('text', { array: true, default: [] })
  taken: string[];

  @OneToMany(() => Order, (order) => order.session)
  orders: Order[];

  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
