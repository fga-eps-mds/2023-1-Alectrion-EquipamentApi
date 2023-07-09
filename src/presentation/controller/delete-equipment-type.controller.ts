import { DeleteEquipmentTypeUseCase } from '../../useCases/delete-equipment-type/delete-equipment.type.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | void

type HttpRequest = {
  id: number
}

export class DeleteEquipmentTypeController extends Controller {
  constructor(
    private readonly equipmentTypeUseCase: DeleteEquipmentTypeUseCase
  ) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentTypeUseCase.execute({
      id: params.id
    })

    if (response.isSuccess) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
