import { OrderService } from '../../domain/entities/order-service'

export type FindOrderServiceUseCaseDataQuery = {
  type?: string
  unit?: string
  date?: string
  brand?: string
  search?: string
  model?: string
  status?: string
  skip: number
  take: number
}

export interface OrderServiceRepositoryProtocol {
  findOrderServiceGeneric(query: any): Promise<OrderService[] | undefined>
}
