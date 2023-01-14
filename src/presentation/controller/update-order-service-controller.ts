import { UpdateOrderServiceUseCase } from '../../useCases/update-order-service/updateOrderServiceUseCase'
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

export type UpdateOrderServiceHttpRequest = {
  equipmentId: string
  userId: string
  receiverName: string
  authorFunctionalNumber: string
  destination: string
  senderName: string
  senderFunctionalNumber: string
  description: string
  date: string
  recieverFunctionalNumber: string
  status: string
  techinicias: string[]
}

export class UpdateOrderServiceController extends Controller {
  constructor(private updateOrderServiceUseCase: UpdateOrderServiceUseCase) {
    super()
  }

  async perform(params: UpdateOrderServiceHttpRequest) {
    const response = await this.uptadeOrderServiceUseCase.execute({
      equipmentId: params.equipmentId,
      authorId: params.userId,
      authorFunctionalNumber: params.authorFunctionalNumber,
      destination: params.destination,
      senderName: params.senderName,
      senderFunctionalNumber: params.senderFunctionalNumber,
      date: params.date,
      description: params.description,
      receiverName: params.receiverName,
      reciverFunctionalNumber: params.recieverFunctionalNumber,
      status: params.status,
      techinicias: params.techinicias
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
