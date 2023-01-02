import { Movement } from '../../domain/entities/movement'
import { Borrow } from '../../domain/entities/borrow'
import { Dismiss } from '../../domain/entities/dismiss'
import { Ownership } from '../../domain/entities/ownership'

export interface MovementRepositoryProtocol {
  create(movement: Movement, specializedMovementData: Borrow | Dismiss | Ownership): Promise<Movement>
//  updateOne(equipmentData: any): Promise<boolean>
//  findOne(equipmentId: string): Promise<Movement | null>
//  genericFind(query: any): Promise<Movement[]>
//  deleteOne(movementId: string): Promise<boolean>
}
