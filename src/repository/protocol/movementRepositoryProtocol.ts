import { Movement } from '../../domain/entities/movement'
import { Borrow } from '../../domain/entities/borrow'
import { Dismiss } from '../../domain/entities/dismiss'
import { Ownership } from '../../domain/entities/ownership'
import { Status as EquipmentStatus } from '../../domain/entities/equipamentEnum/status'

export type Query = {
  id?: string
  userId?: string
  equipmentId?: string
  type?: Number
  lowerDate?: Date
  higherDate?: Date
  page: Number
  resultQuantity: Number
}

export type DismissParameters = {
  dismiss: Dismiss
  status: EquipmentStatus
}

export interface MovementRepositoryProtocol {
  create(movement: Movement, specializedMovementData: Borrow | DismissParameters | Ownership): Promise<Movement>
  genericFind(query: Query): Promise<Movement[]>
//  updateOne(equipmentData: any): Promise<boolean>
//  deleteOne(movementId: string): Promise<boolean>
}
