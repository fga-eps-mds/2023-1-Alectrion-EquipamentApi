import { Equipment } from '../../domain/entities/equipment'
import { History } from '../../domain/entities/history'
import { OrderService } from '../../domain/entities/order-service'
import { Status } from '../../domain/entities/serviceOrderEnum/status'
import { Unit } from '../../domain/entities/unit'

export type CreateOrderServiceData = {
  equipment: Equipment
  history: History
  equipmentSnapshot: any
  description: string
  authorId: string
  receiverName: string
  authorFunctionalNumber: string
  destination: Unit
  senderName: string
  senderFunctionalNumber: string
  date: Date
  receiverFunctionalNumber: string
  status: Status
  technicians: string[]
}

export interface CreateOrderServiceRepository {
  create(data: CreateOrderServiceData): Promise<OrderService>
}
