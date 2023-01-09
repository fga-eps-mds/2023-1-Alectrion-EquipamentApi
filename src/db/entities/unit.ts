import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Equipment } from './equipment'
import { Movement } from './movement'
import { OrderService } from './order-service'

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

  @OneToMany(() => Movement, (borrow) => borrow.destination)
  borrows?: Movement[]

  @OneToMany(() => Movement, (ownership) => ownership.source)
  ownershipSources?: Movement[]

  @OneToMany(() => Movement, (ownership) => ownership.destination)
  ownershipDestinations?: Movement[]
}
