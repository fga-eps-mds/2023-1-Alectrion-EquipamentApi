import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Equipment } from './equipment'
import { OrderService } from './order-service'
import { Borrow } from './borrow'
import { Ownership } from './ownership'

@Entity()
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  localization: string

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => OrderService, (orderService) => orderService.destination)
  orderServices?: OrderService[]

  @OneToMany(() => Equipment, (equipment) => equipment.unit)
  equipments?: Equipment[]

  @OneToMany(() => Borrow, (borrow) => borrow.destination)
  borrows: Borrow[]

  @OneToMany(() => Ownership, (ownership) => ownership.source)
  ownershipSources: Ownership[]

  @OneToMany(() => Ownership, (ownership) => ownership.destination)
  ownershipDestinations: Ownership[]
}
