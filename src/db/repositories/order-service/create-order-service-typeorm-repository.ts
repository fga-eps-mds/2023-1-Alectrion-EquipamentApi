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
      date: data.date,
      history: data.history,
      description: data.description,
      senderName: data.senderName,
      equipment: data.equipment,
      equipmentSnapshot: data.equipmentSnapshot,
      receiverName: data.receiverName,
      senderFunctionalNumber: data.senderFunctionalNumber,
      receiverFunctionalNumber: data.receiverFunctionalNumber,
      status: data.status,
      technicians: data.technicians,
      receiverDate: data.receiverDate,
      senderPhone: data.senderPhone
    })

    await this.historyRepository.save(result)

    return result
  }
}
