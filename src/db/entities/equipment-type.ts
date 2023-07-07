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
export class EquipmentType {
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

  @OneToMany(() => Equipment, (equipment) => equipment.type)
  equipment?: Equipment[]
}
