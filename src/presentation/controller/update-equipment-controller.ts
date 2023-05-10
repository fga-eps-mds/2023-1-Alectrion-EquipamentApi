/* eslint-disable prettier/prettier */
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'
// import {
//   EquipmentNotFoundError,
//   InvalidAuthorError,
//   InvalidDateError,  
//   InvalidSenderError
// } from '../../useCases/create-order-service/errors'
import { notFound, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

export type UpdateEquipmentHttpRequest = {
  tippingNumber: string
  id: string
  serialNumber: string
  type: string
  situacao: string
  estado: string
  model: string
  description: string
  initialUseDate: string
  acquisitionDate: Date
  screenSize: string
  invoiceNumber: string
  power: string
  screenType: string
  processor: string
  storageType: string
  storageAmount: string
  brandName: string
  acquisitionName: string
  unitId: string
  ram_size: string
}

export class UpdateEquipmentController extends Controller {
  constructor(private updateEquipmentUseCase: UpdateEquipmentUseCase) {
    super()
  }

  async perform(params: UpdateEquipmentHttpRequest) {
    const response = await this.updateEquipmentUseCase.execute({
      tippingNumber: params.tippingNumber,
      id: params.id,
      serialNumber: params.serialNumber,
      type: params.type,
      situacao: params.situacao,
      estado: params.estado,
      model: params.model,
      description: params.description,
      initialUseDate: params.initialUseDate,
      acquisitionDate:params.acquisitionDate,
      screenSize: params.screenSize,
      invoiceNumber: params.invoiceNumber,
      power: params.power,
      screenType: params.screenType,
      processor: params.processor,
      storageType: params.storageType,
      storageAmount: params.storageAmount,
      brandName: params.brandName,
      acquisitionName: params.acquisitionName,
      unitId: params.unitId,
      ram_size: params.ram_size
    })

    if (!response.isSuccess) {
      return notFound(response.error)
    }

    if (response.isSuccess) {
      return ok(response)
    } else return serverError()
  }
}
