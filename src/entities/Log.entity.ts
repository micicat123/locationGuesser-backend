import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Log extends CustomBaseEntity {
  @Column({ nullable: false })
  action: string;

  @Column({ nullable: true })
  component: string;

  @Column({ nullable: true })
  newValue: string;

  @Column({ nullable: false })
  URL: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
