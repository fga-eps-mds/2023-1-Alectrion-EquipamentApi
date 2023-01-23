import { Unit } from '../../domain/entities/unit'
import { FindAllUnitUseCase } from '../../../src/useCases/FindUnit/findAllUnitUseCase'
import { HttpResponse, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

type Model = Error | Unit[]

export class FindAllUnitsController extends Controller {
  constructor(private readonly findAllUnits: FindAllUnitUseCase) {
    super()
  }

  async perform(): Promise<HttpResponse<Model>> {
    const response = await this.findAllUnits.execute()
    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else {
      return serverError(response.error)
    }
  }
}
