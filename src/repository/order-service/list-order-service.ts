import { ILike, MoreThanOrEqual } from 'typeorm'
import { dataSource } from '../../db/config'
import { OrderService } from '../../db/entities/order-service'
import {
  OrderServiceRepositoryProtocol,
  FindOrderServiceUseCaseDataQuery
} from '../protocol/orderServiceRepositoryProtocol'

export class ListOrderServiceRepository
  implements OrderServiceRepositoryProtocol
{
  private readonly orderServiceRepository
  constructor() {
    this.orderServiceRepository = dataSource.getRepository(OrderService)
  }

  async findOrderServiceGeneric(
    query: FindOrderServiceUseCaseDataQuery
  ): Promise<OrderService[]> {
    const { type, unit, date, brand, model, search, status, skip, take } = query

    let newDate
    if (date != null) {
      newDate = new Date(date)
    }
    const defaultConditions = {
      status,
      date: newDate ? MoreThanOrEqual(newDate) : undefined,
      equipment: {
        unit: unit ? { id: unit } : undefined,
        brand: brand ? { id: brand } : undefined,
        type,
        model
      }
    }

    const searchConditions =
      typeof search !== 'undefined'
        ? [
            {
              equipment: {
                serialNumber: ILike(`%${search}%`),
                ...defaultConditions.equipment
              },
              status: defaultConditions.status,
              date: defaultConditions.date
            },
            {
              equipment: {
                tippingNumber: ILike(`%${search}%`),
                ...defaultConditions.equipment
              },
              status: defaultConditions.status,
              date: defaultConditions.date
            }
          ]
        : defaultConditions

    const queryResult = await this.orderServiceRepository.find({
      relations: ['equipment', 'equipment.brand', 'equipment.unit'],
      order: { updatedAt: 'DESC' },
      where: searchConditions,
      take,
      skip
    })

    return queryResult
  }
}
