import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'float' })
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column()
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, {})
  schedule: Schedule[];
}
