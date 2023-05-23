import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Guess } from './guess.entity';

@Entity()
export class Location extends CustomBaseEntity {
  @Column({ nullable: false })
  @Index()
  picture: string;

  @Column({ type: 'decimal', nullable: false })
  latitude: number;

  @Column({ type: 'decimal', nullable: false })
  longitude: number;

  @Column({ nullable: false })
  address: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => Guess,
    guess => guess.location,
  )
  guesses: Guess[];
}
