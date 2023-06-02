import { ILike, MoreThanOrEqual } from 'typeorm'
import { dataSource } from '../../db/config'
import { OrderService } from '../../db/entities/order-service'
import { OrderServiceRepositoryProtocol, Query } from '../protocol/orderServiceRepositoryProtocol'
import { Equipment } from '../../db/entities/equipment'

export class ListOrderServiceRepository
  implements OrderServiceRepositoryProtocol
{
  private readonly orderServiceRepository
  constructor() {
    this.orderServiceRepository = dataSource.getRepository(OrderService)
  }

async findOrderServiceGeneric(query: Query): Promise<OrderService[]> {
  const {
    type,
    unit,
    updatedAt,
    brand,
    model,
    search,
    status,
  } = query

  const {...rest } = query

  let formattedHigherDate = new Date(updatedAt)

  const defaultConditions = {
    status,
    updatedAt,
    equipment: {
      unit:unit ? { id: unit } : undefined,
      brand:brand ? { name: brand } : undefined,
      type:type,
      model:model
    },
    
  }

  const whereConditions =
    typeof search !== 'undefined'
      ? [
          {
            equipment:{
              tippingNumber: ILike(`%${search}%`),
            ...defaultConditions
            }
          },
          {
            equipment:{
              serialNumber: ILike(`%${search}%`),
            ...defaultConditions
            }
          },
        ]
      : defaultConditions

  const allFieldsUndefined = Object.values(rest).every(
    (value) => typeof value === 'undefined'
  )

  const queryResult = await this.orderServiceRepository.find({
    relations: [
      'equipment',
      'equipment.brand',
      'equipment.unit',
    ],
    order: { date: 'DESC' },
    where: allFieldsUndefined ? undefined : whereConditions,
    take: query.resultQuantity,
    skip: query.page * query.resultQuantity
  })

  return queryResult
}
}
