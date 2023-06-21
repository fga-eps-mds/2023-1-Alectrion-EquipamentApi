import { CreateOrderServiceUseCase } from '../../useCases/create-order-service/create-order-service'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidDateError,
  InvalidSenderError,
  InvalidUnitError,
  UnitNotFoundError
} from '../../useCases/create-order-service/errors'
import { notFound, ok, badRequest, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

export type CreateOrderServiceHttpRequest = {
  equipmentId: string
  authorId: string
  seiProcess: string
  description: string
  senderName: string
  senderDocument: string
  senderPhone?: string
}

export class CreateOrderServiceController extends Controller {
  constructor(private createOrderServiceUseCase: CreateOrderServiceUseCase) {
    super()
  }

  async perform(params: CreateOrderServiceHttpRequest) {
    const response = await this.createOrderServiceUseCase.execute({
      equipmentId: params.equipmentId,
      authorId: params.authorId,
      seiProcess: params.seiProcess,
      description: params.description,
      senderName: params.senderName,
      senderDocument: params.senderDocument,
      senderPhone: params.senderPhone
    })

    if (
      !response.isSuccess &&
      response.error instanceof EquipmentNotFoundError
    ) {
      return notFound(response.error)
    }

    if (!response.isSuccess && response.error instanceof InvalidAuthorError) {
      return badRequest(response.error)
    }

    if (!response.isSuccess && response.error instanceof InvalidUnitError) {
      return badRequest(response.error)
    }

    if (!response.isSuccess && response.error instanceof InvalidSenderError) {
      return badRequest(response.error)
    }

    if (!response.isSuccess && response.error instanceof UnitNotFoundError) {
      return notFound(response.error)
    }

    if (!response.isSuccess && response.error instanceof InvalidDateError) {
      return badRequest(response.error)
    }

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else return serverError()
  }
}
