import {
    PrimaryColumn,
    Column,
    Entity,
    ManyToMany,
    JoinTable
  } from 'typeorm'
import { Equipment } from './equipment'
  
  @Entity()
  export class Movement {
    @PrimaryColumn('uuid')
    id: string
  
    @Column('timestamptz')
    date: Date

    @Column('uuid')
    userId: string

    @ManyToMany(() => Equipment)
    @JoinTable()
    equipments: Equipment[]
  }
  