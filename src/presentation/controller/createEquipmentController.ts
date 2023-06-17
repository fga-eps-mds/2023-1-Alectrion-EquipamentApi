import { Equipment } from '../../domain/entities/equipment'
import {
  CreateEquipmentUseCase,
  EquipmentTypeError,
  InvalidTippingNumber,
  NotFoundUnit,
  NullFields
} from '../../useCases/createEquipment/createEquipmentUseCase'
import { badRequest, HttpResponse, ok, serverError, notFound } from '../helpers'
import { Controller } from '../protocols/controller'

export type CreateEquipmentHttpRequest = {
  tippingNumber: string

  serialNumber: string

  type: string

  estado: string

  situacao: string

  model: string

  description?: string

  acquisitionDate: Date

  screenSize?: string

  power?: string

  screenType?: string

  processor?: string

  storageType?: string

  storageAmount?: string

  brandName: string

  acquisitionName: string

  unitId: string

  ram_size?: string
}

type Model = Error | Equipment

export class CreateEquipmentController extends Controller {
  constructor(private readonly createEquipment: CreateEquipmentUseCase) {
    super()
  }

  async perform(
    params: CreateEquipmentHttpRequest
  ): Promise<HttpResponse<Model>> {
    const response = await this.createEquipment.execute(params)
    if (response.data && response.isSuccess) {
      return ok(response.data)
    } else if (response.error instanceof NullFields) {
      return badRequest(new NullFields())
    } else if (response.error instanceof InvalidTippingNumber) {
      return badRequest(new InvalidTippingNumber())
    } else if (response.error instanceof NotFoundUnit) {
      return notFound(new NotFoundUnit())
    } else if (response.error instanceof EquipmentTypeError) {
      return notFound(new EquipmentTypeError())
    } else {
      return serverError(response.error)
    }
  }
}
