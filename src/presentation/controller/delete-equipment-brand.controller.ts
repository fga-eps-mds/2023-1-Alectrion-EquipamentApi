import { DeleteEquipmentBrandUseCase } from '../../useCases/delete-equipment-brand/delete-equipment-brand.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | void

type HttpRequest = {
  id: number
}

export class DeleteEquipmentBrandController extends Controller {
  constructor(
    private readonly equipmentBrandUseCase: DeleteEquipmentBrandUseCase
  ) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentBrandUseCase.execute({
      id: params.id
    })

    if (response.isSuccess) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
