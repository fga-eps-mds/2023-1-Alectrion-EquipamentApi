import {
    PrimaryColumn,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    ManyToOne
  } from 'typeorm'
import { Movement } from './movement'
import { Unit } from './unit'
  
  @Entity()
  export class Borrow {
    @PrimaryColumn('uuid')
    id: string
  
    @Column()
    description: string
  
    @OneToOne(() => Movement)
    @JoinColumn({ name: 'id'})
    movement: Movement

    @ManyToOne(() => Unit, (unit) => unit.borrows)
    destination: Unit
  }
