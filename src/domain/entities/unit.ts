import { Equipment } from './equipment'
import { OrderService } from './order-service'
import { Movement } from './movement'

export type Unit = {
  id?: string

  name: string

  localization: string

  createdAt?: Date

  updatedAt?: Date

  orderServices?: OrderService[]

  equipments?: Equipment[]

  borrows?: Movement[]

  ownershipSources?: Movement[]

  ownershipDestinations?: Movement[]
}
