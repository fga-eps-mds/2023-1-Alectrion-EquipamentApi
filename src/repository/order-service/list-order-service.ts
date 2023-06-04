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

    const take = query.take
    const skip = query.skip

    delete query.take
    delete query.skip

    const os = await this.orderServiceRepository.find({
      take: take,
      skip: skip,
      relations: ['equipment', 'equipment.brand', 'equipment.unit'],
      where: {
        ...query
      }
    })
    return os
  }
}
