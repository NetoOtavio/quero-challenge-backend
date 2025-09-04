// src/offers/entities/offer.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseName: string;

  @Column('float')
  rating: number;

  @Column('decimal', { precision: 10, scale: 2 })
  fullPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  offeredPrice: number;

  @Column()
  kind: string;

  @Column()
  level: string;

  @Column()
  iesLogo: string;

  @Column()
  iesName: string;
}
