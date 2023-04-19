import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';
import { Location } from './location.entity';

@Entity()
export class Log extends CustomBaseEntity {
  @Column({ nullable: false })
  action: string;

  @Column({ nullable: false })
  component: string;

  @Column({ nullable: false })
  newValue: string;

  @Column({ nullable: false })
  URL: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
