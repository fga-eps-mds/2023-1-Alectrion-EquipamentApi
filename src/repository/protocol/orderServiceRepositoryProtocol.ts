import { OrderService } from '../../domain/entities/order-service'

export type FindOrderServiceUseCaseDataQuery = {
  type?: number
  unit?: string
  date?: string
  brand?: number
  search?: string
  model?: string
  status?: string
  skip: number
  take: number
}

export interface OrderServiceRepositoryProtocol {
  findOrderServiceGeneric(query: any): Promise<OrderService[] | undefined>
}
