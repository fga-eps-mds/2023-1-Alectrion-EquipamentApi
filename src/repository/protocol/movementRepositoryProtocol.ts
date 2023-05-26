import { Movement } from '../../domain/entities/movement'
import { Status as EquipmentStatus } from '../../domain/entities/equipamentEnum/status'
import { Unit } from '../../domain/entities/unit'

export type Query = {
  id?: string
  destination?: string
  userId?: string
  inChargeName?: string
  equipmentId?: string
  type?: number
  lowerDate?: Date
  higherDate?: Date
  page: number
  resultQuantity: number
  searchTerm?: string
}

export interface MovementRepositoryProtocol {
  create(
    movement: Movement,
    equipmentStatus?: EquipmentStatus
  ): Promise<Movement>
  genericFind(query: Query): Promise<Movement[]>
  deleteOne(id: string): Promise<boolean>
  //  updateOne(equipmentData: any): Promise<boolean>
}
