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
  export class Ownership {
    @PrimaryColumn('uuid')
    id: string
  
    @OneToOne(() => Movement)
    @JoinColumn({ name: 'id'})
    movement: Movement

    @ManyToOne(() => Unit, (unit) => unit.ownershipSources)
    source: Unit

    @ManyToOne(() => Unit, (unit) => unit.ownershipDestinations)
    destination: Unit
  }
