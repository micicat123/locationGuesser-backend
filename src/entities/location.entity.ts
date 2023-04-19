import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class Location extends CustomBaseEntity {
  @Column({ nullable: false })
  @Index()
  picture: string;

  @Column({ type: 'decimal', nullable: false})
  latitude: number;

  @Column({ type: 'decimal', nullable: false})
  longitude: number;

  @Column()
  address: string;
}
