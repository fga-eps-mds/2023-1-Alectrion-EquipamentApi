import { History } from './history'
import { Equipment } from './equipment'
import { Unit } from './unit'
import { Status } from './serviceOrderEnum/status'

export type OrderService = {
  id: string

  date: Date

  description?: string

  authorId: string

  receiverName: string

  sender: string

  equipmentSnapshot: any

  senderFunctionalNumber: string

  createdAt: Date

  updatedAt: Date

  equipment: Equipment

  history: History

  destination: Unit

  receiverFunctionalNumber: string

  technicians?: string[]

  status: Status
}
