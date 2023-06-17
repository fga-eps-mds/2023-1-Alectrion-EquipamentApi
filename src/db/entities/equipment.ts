/* eslint-disable no-use-before-define */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm'
import { ScreenType } from '../../domain/entities/equipamentEnum/screenType'
import { Status } from '../../domain/entities/equipamentEnum/status'
import { Estado } from '../../domain/entities/equipamentEnum/estado'
import { StorageType } from '../../domain/entities/equipamentEnum/storageType'
import { Type } from '../../domain/entities/equipamentEnum/type'
import { EquipmentAcquisition } from './equipment-acquisition'
import { EquipmentBrand } from './equipment-brand'
import { OrderService } from './order-service'
import { Unit } from './unit'

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    name: 'tipping_number',
    type: 'varchar',
    unique: true
  })
  tippingNumber: string

  @Column({
    name: 'serial_number',
    type: 'varchar'
  })
  serialNumber: string

  @Column({
    type: 'enum',
    enum: Type
  })
  type: Type

  @Column({
    type: 'enum',
    enum: Status
  })
  situacao: Status

  @Column({
    type: 'enum',
    enum: Estado
  })
  estado: Estado

  @Column({
    type: 'varchar'
  })
  model: string

  @Column({
    type: 'varchar'
  })
  description?: string

  @Column({
    name: 'acquisition_date',
    type: 'date'
  })
  acquisitionDate: Date

  @Column({
    type: 'varchar',
    name: 'screen_size',
    nullable: true
  })
  screenSize?: string

  @Column({
    type: 'varchar',
    nullable: true
  })
  power?: string

  @Column({
    type: 'enum',
    enum: ScreenType,
    name: 'screen_type',
    nullable: true
  })
  screenType?: ScreenType

  @Column({
    type: 'varchar',
    nullable: true
  })
  processor?: string

  @Column({
    type: 'enum',
    enum: StorageType,
    name: 'storage_type',
    nullable: true
  })
  storageType?: StorageType

  @Column({
    name: 'storage_amount',
    type: 'varchar',
    nullable: true
  })
  storageAmount?: string

  @Column({
    name: 'ram_size',
    type: 'varchar',
    nullable: true
  })
  ram_size?: string

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'timestamptz' })
  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => OrderService, (orderService) => orderService.equipment)
  orderServices?: OrderService[]

  @ManyToOne(() => EquipmentBrand, (equipmentBrand) => equipmentBrand.equipment)
  @JoinTable()
  brand?: EquipmentBrand

  @ManyToOne(
    () => EquipmentAcquisition,
    (equipmentAcquisition) => equipmentAcquisition.equipment
  )
  acquisition?: EquipmentAcquisition

  @ManyToOne(() => Unit, (unit) => unit.equipments)
  @JoinTable()
  unit?: Unit
}
