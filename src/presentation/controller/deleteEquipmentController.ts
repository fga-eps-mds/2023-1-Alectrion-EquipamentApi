import {
    DeleteEquipmentUseCase,
    DeleteEquipmentUseCaseData,
    InvalidEquipmentError,
    NullFieldsError,
    TimeLimitError,
    EquipmentMovedError
  } from '../../useCases/deleteEquipment/deleteEquipmentUseCase'
  
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
  
  export class DeleteEquipmentController extends Controller {
    constructor(private readonly deleteEquipment: DeleteEquipmentUseCase) {
      super()
    }
  
    async perform(
      httpRequest: DeleteEquipmentUseCaseData
    ): Promise<HttpResponse<Model>> {
      const response = await this.deleteEquipment.execute(httpRequest)
  
      if (response.isSuccess) 
        return ok()

      if (response.error instanceof NullFieldsError)
        return badRequest(response.error)

      if (response.error instanceof InvalidEquipmentError)
        return notFound(response.error)

      if (response.error instanceof TimeLimitError || response.error instanceof EquipmentMovedError) 
        return unauthorized(response.error)

      return serverError(response.error)
    }
  }
  
  
