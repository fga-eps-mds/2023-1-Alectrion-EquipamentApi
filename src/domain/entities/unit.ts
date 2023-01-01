import { Equipment } from './equipment'
import { OrderService } from './order-service'
import { Borrow } from './borrow'
import { Ownership } from './ownership'

export type Unit = {
  id?: string

  name: string

  localization: string

  createdAt?: Date

  updatedAt?: Date

  orderServices?: OrderService[]

  equipments?: Equipment[]

  borrows?: Borrow[]

  ownershipSources?: Ownership[]

  ownershipDestinations?: Ownership[]
}
