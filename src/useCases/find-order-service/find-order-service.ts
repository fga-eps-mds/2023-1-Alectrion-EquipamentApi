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
  destination: string
  sender: string
  senderFunctionalNumber: string
  date: string
  tippingNumber: string
  serialNumber: string
  type: string
  situacao: string
}

export class FindOrderService
  implements UseCase<FindOrderServiceUseCaseData, OrderService[]>
{
  constructor(private readonly osReposiory: OrderServiceRepositoryProtocol) {}
  async execute(
    query: FindOrderServiceUseCaseData
  ): Promise<UseCaseReponse<OrderService[]>> {
    const queryFormatted = {
      date: query.date,
      receiverName: query.receiverName,
      senderFunctionalNumber: query.senderFunctionalNumber,
      sender: query.sender,
      equipment: {
        tippingNumber: query.tippingNumber,
        serialNumber: query.serialNumber,
        type: query.type,
        situacao: query.situacao
      }
    }
    const ordersServices = await this.osReposiory.findOrderServiceGeneric(
      queryFormatted
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
