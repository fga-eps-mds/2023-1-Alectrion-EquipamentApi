import { UpdateOrderServiceUseCase } from '../../useCases/update-order-service/update-order-service'
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
  id: string
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
  techinicias: []
  recieverDate: string
}

export class UpdateOrderServiceController extends Controller {
  constructor(private updateOrderServiceUseCase: UpdateOrderServiceUseCase) {
    super()
  }

  async perform(params: UpdateOrderServiceHttpRequest) {
    const response = await this.updateOrderServiceUseCase.execute({
      id: params.id,
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
      techinicias: params.techinicias,
      receiverDate: params.recieverDate
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

    if (response.isSuccess) {
      return ok(response)
    } else return serverError()
  }
}
