import { mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
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
  InvalidSenderError,
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
  situacao: Status.ACTIVE,
  estado: Estado.Novo,
  tippingNumber: 'any',
  model: 'DELL G15',
  serialNumber: 'any',
  type: Type.CPU
}

const orderService: OrderService = {
  id: 2,
  equipment,
  description: 'any_description',
  seiProcess: '123456789',
  senderPhone: '61992809831',
  senderDocument: '12345678910',
  technicianId: '123456',
  technicianName: 'Pessoa',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: OSStatus.MAINTENANCE,
  authorId: '123456789',
  senderName: 'Pessoa 2'
}

const request: CreateOrderServiceHttpRequest = {
  equipmentId: 'equipment_id',
  authorId: 'author_id',
  seiProcess: '123456489',
  description: 'any_description',
  senderName: 'any-sender',
  senderDocument: '123456789456',
  senderPhone: '61992809831'
}

const useCaseParam: CreateOrderServiceUseCaseData = {
  equipmentId: request.equipmentId,
  authorId: request.authorId,
  seiProcess: request.seiProcess,
  description: request.description,
  senderName: request.senderName,
  senderDocument: request.senderDocument,
  senderPhone: request.senderPhone
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
