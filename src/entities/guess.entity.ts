import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class Guess extends CustomBaseEntity{
  @Column({ nullable: false })
  @Index()
  errorDistance: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Location)
  @JoinColumn({name: 'location_id'})
  location: Location
}
