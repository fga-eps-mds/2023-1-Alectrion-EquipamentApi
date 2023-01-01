import { Movement } from '../../db/entities/movement'
import { Borrow } from '../../db/entities/borrow'
import { Dismiss } from '../../db/entities/dismiss'
import { Ownership } from '../../db/entities/ownership'

export interface MovementRepositoryProtocol {
  create(movement: Movement, specializedMovementData: Borrow | Dismiss | Ownership): Promise<Movement>
  updateOne(equipmentData: any): Promise<boolean>
  findOne(equipmentId: string): Promise<Movement | null>
  genericFind(query: any): Promise<Movement[]>
  deleteOne(movementId: string): Promise<boolean>
}
