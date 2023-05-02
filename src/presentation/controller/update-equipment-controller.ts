/* eslint-disable prettier/prettier */
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidDateError,  
  InvalidSenderError
} from '../../useCases/create-order-service/errors'
import { notFound, ok, badRequest, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

export type UpdateEquipmentHttpRequest = {
  tippingNumber: string
  situacao: string
  model: string
  description?: string
  initialUseDate: string
  invoiceNumber: string
  brand: string
  acquisition: string

}

export class UpdateEquipmentController extends Controller {
  constructor(private updateEquipmentUseCase: UpdateEquipmentUseCase) {
    super()
  }

  async perform(params: UpdateEquipmentHttpRequest) {
    const response = await this.updateEquipmentUseCase.execute({
      tippingNumber: params.tippingNumber,
      situacao: params.situacao,
      model: params.model,
      description: params.description,
      initialUseDate: params.initialUseDate,
      acquisition: params.acquisition,
      invoiceNumber: params.invoiceNumber,
      brand: params.brand,
    })

    if (
      !response.isSuccess &&
      response.error instanceof EquipmentNotFoundError
    ) {
      return notFound(response.error)
    }

    if (response.isSuccess) {
      return ok(response)
    } else return serverError()
  }
}
