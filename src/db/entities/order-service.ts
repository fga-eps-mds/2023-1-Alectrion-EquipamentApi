/* eslint-disable no-use-before-define */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Equipment } from './equipment'
import { History } from './history'
import { Status } from '../../domain/entities/serviceOrderEnum/status'

@Entity()
export class OrderService {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    name: 'date',
    type: 'date'
  })
  date: Date

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true
  })
  description?: string

  @Column({
    type: 'uuid',
    name: 'author_id'
  })
  authorId: string

  @Column({
    type: 'varchar',
    name: 'author_functional_number'
  })
  authorFunctionalNumber: string

  @Column({
    type: 'varchar',
    name: 'receiver_name'
  })
  receiverName: string

  @Column({
    type: 'varchar',
    name: 'receiver_functional_number'
  })
  receiverFunctionalNumber: string

  @Column({
    name: 'receiver_date',
    type: 'date'
  })
  receiverDate: Date

  @Column({
    type: 'varchar',
    name: 'sender'
  })
  senderName?: string

  @Column({
    type: 'jsonb',
    name: 'equipment_snapshot'
  })
  equipmentSnapshot: any

  @Column({
    type: 'varchar',
    name: 'sender_functional_number'
  })
  senderFunctionalNumber: string

  @Column({
    type: 'varchar',
    name: 'sender_phone'
  })
  senderPhone?: string

  @Column({
    type: 'enum',
    enum: Status
  })
  status: Status

  @Column({
    type: 'varchar',
    array: true,
    name: 'technicians'
  })
  technicians: string[]

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Equipment, (equipment) => equipment.orderServices)
  equipment: Equipment

  @ManyToOne(() => History, (history) => history.orderServices)
  history: History
}
