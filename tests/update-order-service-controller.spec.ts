import { mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Status as OSStatus } from '../src/domain/entities/serviceOrderEnum/status'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import { OrderService } from '../src/domain/entities/order-service'
import {
  UpdateOrderServiceController,
  UpdateOrderServiceHttpRequest
} from '../src/presentation/controller/update-order-service-controller'
import {
  ok,
  notFound,
  badRequest,
  serverError
} from '../src/presentation/helpers'
import { 
    UpdateOrderServiceUseCaseData,
    UpdateOrderServiceUseCase } from '../src/useCases/update-order-service/update-order-service' 
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidSenderError,
  InvalidDateError,
  UpdateOrderServiceError
} from '../src/useCases/create-order-service/errors'

const updateOrderServiceUseCaseMocked = mock<UpdateOrderServiceUseCase>()
const updateOrderServiceController = new UpdateOrderServiceController(
    updateOrderServiceUseCaseMocked
)

const equipment: Equipment = {
  id: 'id',
  acquisitionDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  situacao: Status.ACTIVE,
  tippingNumber: 'any',
  model: 'DELL G15',
  serialNumber: 'any',
  type: Type.CPU,
  initialUseDate: new Date().toISOString(),
  invoiceNumber: 'any',
  estado: Estado.Novo
}

const orderService: OrderService = {
  receiverName: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  date: new Date(),
  id: 'any_id',
  receiverFunctionalNumber: 'any',
  status: ('MAINTENANCE' as OSStatus),
  equipment,
  authorId: 'any_author',
  equipmentSnapshot: equipment,
  sender: 'any_sender',
  senderFunctionalNumber: 'any_sender_number',
  history: {
    equipment,
    equipmentSnapshot: {},
    createdAt: new Date(),
    id: 'any_id',
    updatedAt: new Date()
  }
}

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

const useCaseParam : UpdateOrderServiceUseCaseData = {
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
      isSuccess: true,
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
