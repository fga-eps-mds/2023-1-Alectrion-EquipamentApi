import { Equipment } from '../../domain/entities/equipment'
import {
  GetEquipmentInput,
  GetEquipmentUseCase
} from '../../useCases/getEquipment/getEquipmentUseCase'

import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type HttpRequest = GetEquipmentInput
type Model = Error | Equipment[]

export class GetEquipmentController extends Controller {
  constructor(private getEquipmentUseCase: GetEquipmentUseCase) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    delete params.userId
    const response = await this.getEquipmentUseCase.execute(params)
    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error.message)
    }
  }
}
