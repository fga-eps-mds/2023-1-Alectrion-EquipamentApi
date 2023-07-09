import { OrderService } from './../../entities/order-service'
import {
  CreateOrderServiceData,
  CreateOrderServiceRepository
} from './../../../repository/order-service/create-order-service'
import { dataSource } from '../../config'

export class CreateOrderServiceTypeOrmRepository
  implements CreateOrderServiceRepository
{
  private readonly historyRepository
  constructor() {
    this.historyRepository = dataSource.getRepository(OrderService)
  }

  async create(data: CreateOrderServiceData) {
    const result = this.historyRepository.create({
      authorId: data.authorId,
      description: data.description,
      senderName: data.senderName,
      equipment: data.equipment,
      status: data.status,
      senderPhone: data.senderPhone,
      seiProcess: data.seiProcess,
      senderDocument: data.senderDocument
    })

    await this.historyRepository.save(result)

    return result
  }
}
