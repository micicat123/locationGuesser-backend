import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class User extends CustomBaseEntity {
  @Column({ unique: true, nullable: false })
  @Index()
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({nullable: false})
  firstName: string;

  @Column({nullable: false})
  lastName: string;

  @Column()
  picture: string;

  @Column()
  resetToken: string;
}
