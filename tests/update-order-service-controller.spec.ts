import { mock } from 'jest-mock-extended'
import {
  UpdateOrderServiceController,
  UpdateOrderServiceHttpRequest
} from '../src/presentation/controller/update-order-service-controller'
import { ok, notFound, badRequest } from '../src/presentation/helpers'
import {
  UpdateOrderServiceUseCaseData,
  UpdateOrderServiceUseCase
} from '../src/useCases/update-order-service/update-order-service'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidSenderError,
  InvalidDateError
} from '../src/useCases/create-order-service/errors'

const updateOrderServiceUseCaseMocked = mock<UpdateOrderServiceUseCase>()
const updateOrderServiceController = new UpdateOrderServiceController(
  updateOrderServiceUseCaseMocked
)
const request: UpdateOrderServiceHttpRequest = {
  id: 'any_id',
  status: 'CANCELED',
  techinicias: [],
  recieverDate: new Date().toISOString(),
  authorFunctionalNumber: 'any',
  date: new Date().toISOString(),
  description: '',
  equipmentId: '',
  receiverName: '',
  senderFunctionalNumber: '',
  senderName: '',
  userId: '',
  recieverFunctionalNumber: ''
}

const useCaseParam: UpdateOrderServiceUseCaseData = {
  equipmentId: request.equipmentId,
  authorId: request.userId,
  authorFunctionalNumber: request.authorFunctionalNumber,
  senderName: request.senderName,
  senderFunctionalNumber: request.senderFunctionalNumber,
  date: request.date,
  description: request.description,
  receiverName: request.receiverName,
  reciverFunctionalNumber: request.recieverFunctionalNumber,
  id: request.id,
  status: request.status,
  techinicias: request.techinicias,
  receiverDate: request.recieverDate
}

describe('Should test UpdateOrderServiceController', () => {
  it('should update order service with success', async () => {
    updateOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await updateOrderServiceController.perform(request)

    expect(response).toEqual(ok(response.data))
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return notFound error if usecase returns EquipmentNotFoundError', async () => {
    updateOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentNotFoundError()
    })

    const response = await updateOrderServiceController.perform(request)

    expect(response).toEqual(notFound(response.data))
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidAuthorError', async () => {
    updateOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidAuthorError()
    })

    const response = await updateOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidAuthorError()))
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidSenderError', async () => {
    updateOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidSenderError()
    })

    const response = await updateOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidSenderError()))
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidDateError', async () => {
    updateOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidDateError()
    })

    const response = await updateOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidDateError()))
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(updateOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })
})
