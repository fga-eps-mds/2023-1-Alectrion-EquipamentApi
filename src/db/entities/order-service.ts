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
import { Status } from '../../domain/entities/serviceOrderEnum/status'

@Entity()
export class OrderService {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    name: 'author_id'
  })
  authorId: string

  @Column({
    type: 'varchar',
    name: 'sei_process'
  })
  seiProcess: string

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true
  })
  description: string

  @Column({
    type: 'varchar',
    name: 'sender_name'
  })
  senderName: string

  @Column({
    type: 'varchar',
    name: 'sender_document'
  })
  senderDocument: string

  @Column({
    type: 'varchar',
    name: 'sender_phone'
  })
  senderPhone: string

  @Column({
    type: 'varchar',
    name: 'technician_id'
  })
  technicianId: string

  @Column({
    type: 'varchar',
    name: 'technician_name'
  })
  technicianName: string

  @Column({
    type: 'varchar',
    name: 'withdrawal_name'
  })
  withdrawalName: string

  @Column({
    type: 'varchar',
    name: 'withdrawal_document'
  })
  withdrawalDocument: string

  @Column({
    name: 'finish_date',
    type: 'timestamptz'
  })
  finishDate: Date

  @Column({
    type: 'enum',
    enum: Status
  })
  status: Status

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Equipment, (equipment) => equipment.orderServices)
  equipment: Equipment
}
