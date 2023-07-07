import { EquipmentBrand } from '../../domain/entities/equipment-brand'
import { FindEquipmentBrandUseCase } from '../../useCases/find-equipment-brand/find-equipment-brand.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | EquipmentBrand[]

type HttpRequest = {
  search: string
}

export class FindEquimentBrandController extends Controller {
  constructor(
    private readonly equipmentBrandUseCase: FindEquipmentBrandUseCase
  ) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentBrandUseCase.execute({
      search: params.search
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
