import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne
} from 'typeorm'
import { Equipment } from './equipment'
import { Unit } from './unit'

export enum Types {
  Borrow = 0,
  Dismiss,
  Ownership
}

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('timestamptz')
  date: Date

  @Column('uuid')
  userId: string

  @Column({
    type: 'enum',
    enum: Types
  })
  type: Types

  @Column({
    nullable: true
  })
  description?: string

  @Column()
  inChargeName: string

  @Column()
  inChargeRole: string

  @Column()
  chiefName: string

  @Column()
  chiefRole: string

  @Column({
    type: 'jsonb',
    nullable: true
  })
  equipmentSnapshots?: any

  @ManyToMany(() => Equipment, {
    cascade: true
  })
  @JoinTable()
  equipments: Equipment[]

  @ManyToOne(() => Unit, (unit) => unit.destinations)
  destination?: Unit
}
