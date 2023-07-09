import { Equipment } from '../../domain/entities/equipment'
import { OrderService } from '../../domain/entities/order-service'
import { Status } from '../../domain/entities/serviceOrderEnum/status'

export type CreateOrderServiceData = {
  equipment: Equipment
  authorId: string
  seiProcess: string
  description: string
  senderName: string
  senderDocument: string
  senderPhone?: string
  status: Status
}

export interface CreateOrderServiceRepository {
  create(data: CreateOrderServiceData): Promise<OrderService>
}
