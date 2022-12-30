import {
    PrimaryColumn,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    ManyToOne
  } from 'typeorm'
import { Movement } from './movement'
  
  @Entity()
  export class Dismiss {
    @PrimaryColumn('uuid')
    id: string
  
    @Column()
    description?: string
  
    @OneToOne(() => Movement)
    @JoinColumn({ name: 'id'})
    movement: Movement
  }
