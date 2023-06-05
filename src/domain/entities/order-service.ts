import { History } from './history'
import { Equipment } from './equipment'
import { Status } from './serviceOrderEnum/status'

export type OrderService = {
  id: string

  date: Date

  description?: string

  authorId: string

  receiverName: string

  sender?: string

  equipmentSnapshot: any

  senderFunctionalNumber: string

  createdAt: Date

  updatedAt: Date

  equipment: Equipment

  history: History

  receiverFunctionalNumber: string

  technicians?: string[]

  status: Status

  receiverDate?: Date

  authorFunctionalNumber: string

  senderPhone?: string
}
