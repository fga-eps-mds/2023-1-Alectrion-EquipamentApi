/* eslint-disable prettier/prettier */
import { UpdateOrderServiceUseCase } from '../../useCases/update-order-service/update-order-service'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidDateError,
  InvalidSenderError
} from '../../useCases/create-order-service/errors'
import { notFound, ok, badRequest, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

export type UpdateOrderServiceHttpRequest = {
  id: number
  equipmentId: string
  description?: string
  seiProcess?: string
  senderPhone?: string
  senderDocument?: string
  technicianId?: string
  technicianName?: string
  withdrawalName?: string
  withdrawalDocument?: string
  finishDate?: string
  status?: string
}

export class UpdateOrderServiceController extends Controller {
  constructor(private updateOrderServiceUseCase: UpdateOrderServiceUseCase) {
    super()
  }

  async perform(params: UpdateOrderServiceHttpRequest) {
    const response = await this.updateOrderServiceUseCase.execute({
      id: params.id,
      equipmentId: params.equipmentId,
      description: params.description,
      seiProcess: params.seiProcess,
      senderPhone: params.senderPhone,
      senderDocument: params.senderDocument,
      technicianId: params.technicianId,
      technicianName: params.technicianName,
      withdrawalName: params.withdrawalName,
      withdrawalDocument: params.withdrawalDocument,
      finishDate: params.finishDate,
      status: params.status
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

    if (!response.isSuccess && response.error instanceof InvalidSenderError) {
      return badRequest(response.error)
    }

    if (!response.isSuccess && response.error instanceof InvalidDateError) {
      return badRequest(response.error)
    }

    if (response.isSuccess) {
      return ok(response)
    } else return serverError()
  }
}
