import { EquipmentType } from '../../domain/entities/equipment-type'
import { CreateEquipmentTypeUseCase } from '../../useCases/create-equipment-type/create-equipment-type.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | EquipmentType

type HttpRequest = {
  name: string
}

export class CreateEquimentTypeController extends Controller {
  constructor(
    private readonly equipmentTypeUseCase: CreateEquipmentTypeUseCase
  ) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentTypeUseCase.execute({
      name: params.name
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
