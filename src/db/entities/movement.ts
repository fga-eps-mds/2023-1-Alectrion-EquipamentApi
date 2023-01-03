import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToMany,
    JoinTable
  } from 'typeorm'
import { Equipment } from './equipment'
  
  @Entity()
  export class Movement {
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @Column('timestamptz')
    date: Date

    @Column('uuid')
    userId: string

    @ManyToMany(() => Equipment, {
      cascade: true
    })
    @JoinTable()
    equipments: Equipment[]
  }
  