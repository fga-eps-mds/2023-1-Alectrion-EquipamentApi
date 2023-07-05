import { ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
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
    const {
      type,
      unit,
      createdAt,
      updatedAt,
      finishDate,
      brand,
      model,
      search,
      status,
      skip,
      take,
      withdrawalName,
      technicianName,
      senderName
    } = query

    let newCreatedAt
    if (createdAt != null) {
      newCreatedAt = new Date(createdAt)
    }

    let newFinishDate
    if (finishDate != null) {
      newFinishDate= new Date(finishDate)
    }

    let newUpdatedAt
    if (updatedAt != null) {
      newUpdatedAt = new Date(updatedAt)
    }
    const defaultConditions = {
      status,
      createdAt: newCreatedAt ? MoreThanOrEqual(newCreatedAt) : undefined,
      finishDate: newFinishDate ? LessThanOrEqual(newFinishDate) : undefined,
      updatedAt: newUpdatedAt ? MoreThanOrEqual(newUpdatedAt) : undefined,
      senderName,
      technicianName,
      withdrawalName,
      
      equipment: {
        unit: unit ? { id: unit } : undefined,
        brand: brand ? { name: brand } : undefined,
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
              createdAt: defaultConditions.createdAt,
              updatedAt: defaultConditions.updatedAt,
              finishDate: defaultConditions.finishDate,
              senderName: defaultConditions.senderName,
              technicianName: defaultConditions.technicianName,
              withdrawalName: defaultConditions.withdrawalName
            },
            {
              equipment: {
                tippingNumber: ILike(`%${search}%`),
                ...defaultConditions.equipment
              },
              status: defaultConditions.status,
              createdAt: defaultConditions.createdAt,
              updatedAt: defaultConditions.updatedAt,
              finishDate: defaultConditions.finishDate,
              senderName: defaultConditions.senderName,
              technicianName: defaultConditions.technicianName,
              withdrawalName: defaultConditions.withdrawalName
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
