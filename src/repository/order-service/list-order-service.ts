import { dataSource } from '../../db/config'
import { OrderService } from '../../db/entities/order-service'
import { OrderServiceRepositoryProtocol } from '../protocol/orderServiceRepositoryProtocol'

export class ListOrderServiceRepository
  implements OrderServiceRepositoryProtocol
{
  private readonly orderServiceRepository
  constructor() {
    this.orderServiceRepository = dataSource.getRepository(OrderService)
  }

  async findOrderServiceGeneric(
    query: any
  ): Promise<OrderService[] | undefined> {
    delete query.userId

    const os = await this.orderServiceRepository.find({
      relations: ['equipment'],
      where: {
        ...query
      }
    })
    return os
  }
}
