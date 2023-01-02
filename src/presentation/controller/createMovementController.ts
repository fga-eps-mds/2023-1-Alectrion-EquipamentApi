import { Movement } from '../../domain/entities/movement'
import { CreateMovementUseCase, CreateMovementUseCaseData, InvalidDestinationError, InvalidEquipmentError, InvalidSourceError, InvalidTypeError, InvalidUserError, NullFieldsError } from '../../useCases/createMovement/createMovementUseCase'

import { Controller } from '../protocols/controller'
import { badRequest, HttpResponse, ok, serverError, notFound } from '../helpers'


type Model = Error | Movement

export class CreateMovementController extends Controller {
    constructor(private readonly createMovement: CreateMovementUseCase) {
        super()
    }

    async perform(httpRequest: CreateMovementUseCaseData): Promise<HttpResponse<Model>> {
        const response = await this.createMovement.execute(httpRequest)

        if(response.isSuccess && response.data)
            return ok(response.data)
        if(response.error instanceof NullFieldsError || response.error instanceof InvalidTypeError || response.error instanceof InvalidEquipmentError)
            return badRequest(response.error)
        if(response.error instanceof InvalidDestinationError || response.error instanceof InvalidSourceError || response.error instanceof InvalidUserError)
            return notFound(response.error)
        return serverError(response.error)
    }
}
