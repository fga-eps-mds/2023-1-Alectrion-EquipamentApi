/* eslint-disable no-use-before-define */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Equipment } from './equipment'

@Entity()
export class EquipmentBrand {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'name',
    type: 'varchar'
  })
  name: string

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Equipment, (equipment) => equipment.brand)
  equipment?: Equipment[]
}
