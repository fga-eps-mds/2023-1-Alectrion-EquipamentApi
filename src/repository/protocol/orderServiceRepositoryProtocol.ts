import { OrderService } from '../../domain/entities/order-service'

export type FindOrderServiceUseCaseDataQuery = {
  type?: string
  unit?: string
  createdAt?: string
  updatedAt?: string
  finishDate?: string
  brand?: string
  search?: string
  model?: string
  status?: string
  skip: number
  take: number
  withdrawalName?: string
  technicianName?: string
  senderName?: string
}

export interface OrderServiceRepositoryProtocol {
  findOrderServiceGeneric(query: any): Promise<OrderService[] | undefined>
}
