import {
  DeleteMovementUseCase,
  DeleteMovementUseCaseData,
  InvalidMovementError,
  NullFieldsError,
  TimeLimitError
} from '../../useCases/deleteMovement/deleteMovementUseCase'

import { Controller } from '../protocols/controller'
import {
  badRequest,
  HttpResponse,
  ok,
  serverError,
  notFound,
  unauthorized
} from '../helpers'

type Result = {
  result: boolean
}

type Model = Error | Result

export class DeleteMovementController extends Controller {
  constructor(private readonly deleteMovement: DeleteMovementUseCase) {
    super()
  }

  async perform(
    httpRequest: DeleteMovementUseCaseData
  ): Promise<HttpResponse<Model>> {
    const response = await this.deleteMovement.execute(httpRequest)

    if (response.isSuccess) return ok({ result: true })
    if (response.error instanceof NullFieldsError)
      return badRequest(response.error)
    if (response.error instanceof InvalidMovementError)
      return notFound(response.error)
    if (response.error instanceof TimeLimitError) return unauthorized(response.error)
    return serverError(response.error)
  }
}
