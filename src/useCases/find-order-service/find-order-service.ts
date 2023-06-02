import { Query } from '../../repository/protocol/orderServiceRepositoryProtocol'
import { OrderService } from '../../domain/entities/order-service'
import { OrderServiceRepositoryProtocol } from '../../repository/protocol/orderServiceRepositoryProtocol'
import { UseCase, UseCaseReponse } from '../protocol/useCase'


export class NotOSFoundError extends Error {
  constructor() {
    super('Order Service not found')
    this.name = 'NotOSFoundError'
  }
}

export type FindOrderServiceUseCaseData = {
  receiverName: string
  equipmentId: string
  authorId: string
  authorFunctionalNumber: string
  sender: string
  senderFunctionalNumber: string
  date: string
  tippingNumber: string
  serialNumber: string
  type: string
  situacao: string
}

export class FindOrderService
  implements UseCase<Query, OrderService[]>
{
  constructor(private readonly osReposiory: OrderServiceRepositoryProtocol) {}
  async execute(
    query: Query
  ): Promise<UseCaseReponse<OrderService[]>> {

    const page = query.page ? query.page : 0
    const resultQuantity = query.resultQuantity ? query.resultQuantity : 50

    const newQuery: Query = {
      resultQuantity,
      page,
      type: query.type,
      unit: query.unit,
      updatedAt: query.updatedAt,
      brand: query.brand,
      search: query.search,
      model: query.model, 
      status: query.status
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
