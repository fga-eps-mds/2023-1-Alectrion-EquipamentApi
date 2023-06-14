import { Equipment } from '../../domain/entities/equipment'
import { History } from '../../domain/entities/history'
import { OrderService } from '../../domain/entities/order-service'
import { Status } from '../../domain/entities/serviceOrderEnum/status'

export type CreateOrderServiceData = {
  equipment: Equipment
  history: History
  equipmentSnapshot: any
  description: string
  authorId: string
  receiverName: string
  authorFunctionalNumber: string
  senderName: string
  senderFunctionalNumber: string
  date: Date
  receiverFunctionalNumber: string
  status: Status
  technicians: string[]
  receiverDate?: Date
  senderPhone?: string
}

export interface CreateOrderServiceRepository {
  create(data: CreateOrderServiceData): Promise<OrderService>
}
