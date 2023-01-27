import { Equipment } from './equipment'
import { OrderService } from './order-service'

export type History = {
  id: string

  equipmentSnapshot: any

  orderServices?: OrderService[]

  equipment: Equipment

  createdAt: Date

  updatedAt: Date
}
