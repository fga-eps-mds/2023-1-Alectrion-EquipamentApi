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
  createdAt?: string
  updatedAt?: string
  finishDate?: string
  brand?: string
  search?: string
  model?: string
  status?: string
  take?: number
  skip?: number
  withdrawalName?: string
  technicianName?: string
  senderName?: string
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
      createdAt: query.createdAt,
      updatedAt: query.updatedAt,
      finishDate: query.finishDate,
      brand: query.brand,
      search: query.search,
      model: query.model,
      status: query.status,
      take: query.take,
      skip: query.skip,
      withdrawalName: query.withdrawalName,
      technicianName: query.technicianName,
      senderName: query.senderName
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
