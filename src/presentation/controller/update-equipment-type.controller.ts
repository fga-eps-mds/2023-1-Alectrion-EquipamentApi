import { UpdateEquipmentTypeUseCase } from '../../useCases/update-equipment-type/update-equipment-type.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | void

type HttpRequest = {
  id: number
  name: string
}

export class UpdateEquipmentTypeController extends Controller {
  constructor(
    private readonly equipmentTypeUseCase: UpdateEquipmentTypeUseCase
  ) {
    super()
  }

  async perform(body: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentTypeUseCase.execute({
      id: body.id,
      name: body.name
    })

    if (response.isSuccess) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
