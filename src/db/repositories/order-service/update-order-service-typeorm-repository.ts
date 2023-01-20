import { OrderService } from '../../entities/order-service'
import {
  EditPayload,
  UpdateOrderServiceRepository
} from '../../../repository/order-service/update-order-service-repository'
import { dataSource } from '../../config'

export class UpdateOrderServiceTypeorm implements UpdateOrderServiceRepository {
  private readonly orderServiceRepository
  constructor() {
    this.orderServiceRepository = dataSource.getRepository(OrderService)
  }

  async updateOrderSevice(
    orderServiceId: string,
    editPayload: EditPayload
  ): Promise<void> {
    await this.orderServiceRepository.update(orderServiceId, { ...editPayload }) 
  }
}
