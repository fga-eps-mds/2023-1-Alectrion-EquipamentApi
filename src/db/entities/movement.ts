import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToMany,
    JoinTable
  } from 'typeorm'
import { Equipment } from './equipment'

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
    type: "enum",
    enum: Types
  })
  type: Types

  @ManyToMany(() => Equipment, {
    cascade: true
  })
  @JoinTable()
  equipments: Equipment[]
}
  