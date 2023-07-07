import { EquipmentBrand } from '../../domain/entities/equipment-brand'
import { CreateEquipmentBrandUseCase } from '../../useCases/create-equipment-brand/create-equipment-brand.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | EquipmentBrand

type HttpRequest = {
  name: string
}

export class CreateEquimentBrandController extends Controller {
  constructor(
    private readonly equipmentBrandUseCase: CreateEquipmentBrandUseCase
  ) {
    super()
  }

  async perform(body: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentBrandUseCase.execute({
      name: body.name
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
