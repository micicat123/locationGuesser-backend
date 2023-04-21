import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Location extends CustomBaseEntity {
  @Column({ nullable: false })
  @Index()
  picture: string;

  @Column({ type: 'decimal', nullable: false})
  latitude: number;

  @Column({ type: 'decimal', nullable: false})
  longitude: number;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User;

}
