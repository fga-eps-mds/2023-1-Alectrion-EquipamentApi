import { Movement } from '../../domain/entities/movement'
import { Borrow } from '../../domain/entities/borrow'
import { Dismiss } from '../../domain/entities/dismiss'
import { Ownership } from '../../domain/entities/ownership'

export type Query = {
  id?: string
  userId?: string
  equipmentId?: string
  type?: Number
  lowerDate?: Date
  higherDate?: Date
  page?: Number
  resultQuantity?: Number
}

export interface MovementRepositoryProtocol {
  create(movement: Movement, specializedMovementData: Borrow | Dismiss | Ownership): Promise<Movement>
  genericFind(query: Query): Promise<Movement[]>
//  updateOne(equipmentData: any): Promise<boolean>
//  deleteOne(movementId: string): Promise<boolean>
}
