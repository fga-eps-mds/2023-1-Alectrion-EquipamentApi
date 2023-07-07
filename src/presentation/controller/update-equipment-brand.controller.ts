import { UpdateEquipmentBrandUseCase } from '../../useCases/update-equipment-brnad/update-equipment-brand.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | void

type HttpRequest = {
  id: number
  name: string
}

export class UpdateEquimentBrandController extends Controller {
  constructor(
    private readonly equipmentBrandUseCase: UpdateEquipmentBrandUseCase
  ) {
    super()
  }

  async perform(body: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentBrandUseCase.execute({
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
