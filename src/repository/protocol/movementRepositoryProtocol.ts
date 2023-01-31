import { Movement } from '../../domain/entities/movement'
import { Status as EquipmentStatus } from '../../domain/entities/equipamentEnum/status'

export type Query = {
  id?: string
  userId?: string
  equipmentId?: string
  type?: number
  lowerDate?: Date
  higherDate?: Date
  page: number
  resultQuantity: number
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
