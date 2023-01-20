import { mock } from 'jest-mock-extended'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Status as OSStatus } from '../src/domain/entities/serviceOrderEnum/status'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import { OrderService } from '../src/domain/entities/order-service'
import {
  CreateOrderServiceController,
  CreateOrderServiceHttpRequest
} from '../src/presentation/controller/create-order-service-controller'
import {
  ok,
  notFound,
  badRequest,
  serverError
} from '../src/presentation/helpers'
import { 
  CreateOrderServiceUseCaseData,
  CreateOrderServiceUseCase 
} from '../src/useCases/create-order-service/create-order-service'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidUnitError,
  InvalidSenderError,
  UnitNotFoundError,
  InvalidDateError
} from '../src/useCases/create-order-service/errors'

const createOrderServiceUseCaseMocked = mock<CreateOrderServiceUseCase>()
const createOrderServiceController = new CreateOrderServiceController(
  createOrderServiceUseCaseMocked
)

const equipment: Equipment = {
  id: 'id',
  acquisitionDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  status: Status.ACTIVE,
  tippingNumber: 'any',
  model: 'DELL G15',
  serialNumber: 'any',
  type: Type.CPU,
  initialUseDate: new Date().toISOString(),
  invoiceNumber: 'any'
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
  destination: {
    createdAt: new Date(),
    id: 'any_id',
    name: 'any_name',
    updatedAt: new Date(),
    localization: 'any_localization'
  },
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

const request: CreateOrderServiceHttpRequest = {
  authorFunctionalNumber: 'any',
  date: new Date().toISOString(),
  description: '',
  destination: '',
  equipmentId: '',
  receiverName: '',
  senderFunctionalNumber: '',
  senderName: '',
  userId: '',
  recieverFunctionalNumber: ''
}

const useCaseParam: CreateOrderServiceUseCaseData = {
  equipmentId: request.equipmentId,
  authorId: request.userId,
  authorFunctionalNumber: request.authorFunctionalNumber,
  destination: request.destination,
  senderName: request.senderName,
  senderFunctionalNumber: request.senderFunctionalNumber,
  date: request.date,
  description: request.description,
  receiverName: request.receiverName,
  reciverFunctionalNumber: request.recieverFunctionalNumber
}

describe('Should test CreateOrderServiceController', () => {
  it('should create order service with success', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: orderService
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(ok(response.data))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return notFound error if usecase returns EquipmentNotFoundError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentNotFoundError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(notFound(response.data))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidAuthorError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidAuthorError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidAuthorError()))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidUnitError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidUnitError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidUnitError()))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidSenderError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidSenderError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidSenderError()))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns UnitNotFoundError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new UnitNotFoundError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(notFound(new UnitNotFoundError()))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return badrequest error if usecase returns InvalidDateError', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidDateError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(badRequest(new InvalidDateError()))
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })

  it('should return server error if usecase return success without data', async () => {
    createOrderServiceUseCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      error: new InvalidDateError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(serverError())
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalled()
    expect(createOrderServiceUseCaseMocked.execute).toHaveBeenCalledWith(
      useCaseParam
    )
  })
})
