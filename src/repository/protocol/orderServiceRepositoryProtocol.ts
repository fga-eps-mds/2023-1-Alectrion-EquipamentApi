import { EquipmentBrand } from '../../domain/entities/brand';
import { OrderService } from '../../domain/entities/order-service'

export type Query = {
  resultQuantity: number
  type?: string
  unit?: string
  updatedAt?: string
  brand?: string
  search?: string
  model?: string 
  status?: string
  page?: number
}

export interface OrderServiceRepositoryProtocol {
  findOrderServiceGeneric(query: any): Promise<OrderService[] | undefined>
}
