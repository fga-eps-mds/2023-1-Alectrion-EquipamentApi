import { OrderService } from '../../domain/entities/order-service'

export interface OrderServiceRepositoryProtocol {
  findOrderServiceGeneric(query: any): Promise<OrderService[] | undefined>
}
