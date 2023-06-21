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
  id: 2,
  equipmentId: 'equipment_id',
  description: 'any_description',
  seiProcess: '123456789',
  senderPhone: '61992809831',
  senderDocument: '12345678910',
  technicianId: '123456',
  technicianName: 'Pessoa',
  status: 'CANCELED'
}

const useCaseParam: UpdateOrderServiceUseCaseData = {
  id: request.id,
  equipmentId: request.equipmentId,
  description: request.description,
  seiProcess: request.seiProcess,
  senderPhone: request.senderPhone,
  senderDocument: request.senderDocument,
  technicianId: request.technicianId,
  technicianName: request.technicianName,
  status: request.status
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
