import { Movement } from '../../domain/entities/movement'
import { FindMovementsUseCase, FindMovementsUseCaseData, InvalidDateError } from '../../useCases/findMovements/findMovementsUseCase'

import { Controller } from '../protocols/controller'
import { badRequest, HttpResponse, ok, serverError, notFound } from '../helpers'

type Model = Error | Movement[]

export class FindMovementsController extends Controller {
    constructor(private readonly findMovements: FindMovementsUseCase) {
        super()
    }

    async perform(httpRequest: FindMovementsUseCaseData): Promise<HttpResponse<Model>> {
        const response = await this.findMovements.execute(httpRequest)

        if(response.isSuccess && response.data)
            return ok(response.data)
        if(response.error instanceof InvalidDateError)
            return badRequest(response.error)
        return serverError(response.error)
    }
}
