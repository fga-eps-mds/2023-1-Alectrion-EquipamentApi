import {
  FindOrderServiceUseCaseDataQuery,
  OrderServiceRepositoryProtocol
} from '../../repository/protocol/orderServiceRepositoryProtocol'
import { OrderService } from '../../domain/entities/order-service'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class NotOSFoundError extends Error {
  constructor() {
    super('Order Service not found')
    this.name = 'NotOSFoundError'
  }
}

export interface FindOrderServiceUseCaseData {
  type?: string
  unit?: string
  date?: string
  brand?: string
  search?: string
  model?: string
  status?: string
  take?: number
  skip?: number
}

export class FindOrderService
  implements UseCase<FindOrderServiceUseCaseData, OrderService[]>
{
  constructor(private readonly osReposiory: OrderServiceRepositoryProtocol) {}

  async execute(
    query: FindOrderServiceUseCaseData
  ): Promise<UseCaseReponse<OrderService[]>> {
    if (query.take === undefined) query.take = 0

    if (query.skip === undefined) query.skip = 0

    const newQuery: FindOrderServiceUseCaseDataQuery = {
      type: query.type,
      unit: query.unit,
      date: query.date,
      brand: query.brand,
      search: query.search,
      model: query.model,
      status: query.status,
      take: query.take,
      skip: query.skip
    }

    const ordersServices = await this.osReposiory.findOrderServiceGeneric(
      newQuery
    )
    if (ordersServices !== null) {
      return {
        isSuccess: true,
        data: ordersServices
      }
    } else {
      return {
        isSuccess: false,
        error: new NotOSFoundError()
      }
    }
  }
}
