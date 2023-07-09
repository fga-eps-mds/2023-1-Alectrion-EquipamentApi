import { EquipmentType } from '../../domain/entities/equipment-type'
import { FindEquipmentTypeUseCase } from '../../useCases/find-equipment-type/find-equipment-type.use-case'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | EquipmentType[]

type HttpRequest = {
  search: string
}

export class FindEquipmentTypeController extends Controller {
  constructor(private readonly equipmentTypeUseCase: FindEquipmentTypeUseCase) {
    super()
  }

  async perform(params: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.equipmentTypeUseCase.execute({
      search: params.search
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
