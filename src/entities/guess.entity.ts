import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Location } from './location.entity';

@Entity()
export class Guess extends CustomBaseEntity {
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
