import { MockProxy, mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Status as OSStatus } from '../src/domain/entities/serviceOrderEnum/status'
import { Equipment } from '../src/domain/entities/equipment'
import { History } from '../src/domain/entities/history'
import { OrderService } from '../src/domain/entities/order-service'
import { ListOneEquipmentRepository } from '../src/repository/equipment/list-one-equipment'
import { UpdateEquipmentRepository } from '../src/repository/equipment/update-equipment'
import { CreateHistoryRepository } from '../src/repository/history/create-history-repository'
import { CreateOrderServiceRepository } from '../src/repository/order-service/create-order-service'
import { ListOneUnitRepository } from '../src/repository/unit/list-one-unit'
import {
  CreateOrderServiceUseCase,
  CreateOrderServiceUseCaseData
} from '../src/useCases/create-order-service/create-order-service'
import {
  EquipmentNotFoundError,
  CreateOrderServiceError,
  InvalidSenderError
} from '../src/useCases/create-order-service/errors'

describe('Test create order use case', () => {
  let equipmentRepository: MockProxy<ListOneEquipmentRepository>
  let updateEquipmentRepository: MockProxy<UpdateEquipmentRepository>
  let unitRepository: MockProxy<ListOneUnitRepository>
  let historyRepository: MockProxy<CreateHistoryRepository>
  let createOrderServiceRepository: MockProxy<CreateOrderServiceRepository>
  let createOrderServiceUseCase: CreateOrderServiceUseCase

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
    type: { id: 2, name: 'any', createdAt: new Date(), updatedAt: new Date() }
  }

  const data: CreateOrderServiceUseCaseData = {
    equipmentId: 'equipment_id',
    authorId: 'author_id',
    seiProcess: '123456489',
    description: 'any_description',
    senderName: 'any-sender',
    senderDocument: '123456789456',
    senderPhone: '61992809831'
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

  beforeEach(() => {
    equipmentRepository = mock()
    updateEquipmentRepository = mock()
    unitRepository = mock()
    historyRepository = mock()
    createOrderServiceRepository = mock()
    createOrderServiceUseCase = new CreateOrderServiceUseCase(
      equipmentRepository,
      updateEquipmentRepository,
      historyRepository,
      createOrderServiceRepository
    )

    equipmentRepository.listOne.mockResolvedValue(equipment)
    unitRepository.listOne.mockResolvedValue({
      createdAt: new Date(),
      id: 'any_id',
      name: 'any_name',
      updatedAt: new Date(),
      localization: 'any_localization'
    })
    createOrderServiceRepository.create.mockResolvedValue(orderService)
  })
  test('should call equipment repository with correct params', async () => {
    await createOrderServiceUseCase.execute(data)

    expect(equipmentRepository.listOne).toBeCalledWith(data.equipmentId)
  })

  test('should return EquipmentNotFoundError if no equipment was found', async () => {
    equipmentRepository.listOne.mockResolvedValueOnce(undefined)

    const result = await createOrderServiceUseCase.execute(data)

    expect(equipmentRepository.listOne).toBeCalledWith(data.equipmentId)
    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentNotFoundError()
    })
  })

  test('should create equipment history if equipment found doesnt have history', async () => {
    await createOrderServiceUseCase.execute(data)

    expect(historyRepository.create).toBeCalledTimes(1)
    expect(historyRepository.create).toBeCalledWith({
      equipment,
      equipmentSnapshot: equipment
    })
  })

  test('should update history if equipment found already has history', async () => {
    const history = {
      createdAt: new Date(),
      updatedAt: new Date(),
      equipment,
      id: 'any_id',
      equipmentSnapshot: {}
    }
    equipmentRepository.listOne.mockResolvedValueOnce({
      ...equipment,
      history
    })

    await createOrderServiceUseCase.execute(data)

    expect(historyRepository.create).toBeCalledTimes(0)
    expect(createOrderServiceUseCase.history).toEqual(history)
  })

  test('should update history if equipment found already has history', async () => {
    const history: History = {
      createdAt: new Date(),
      updatedAt: new Date(),
      equipment,
      id: 'any_id',
      equipmentSnapshot: {}
    }
    equipmentRepository.listOne.mockResolvedValueOnce({
      ...equipment,
      history
    })

    await createOrderServiceUseCase.execute(data)

    expect(historyRepository.create).toBeCalledTimes(0)
    expect(createOrderServiceUseCase.history).toEqual(history)
  })

  test('should create order service', async () => {
    const result = await createOrderServiceUseCase.execute(data)

    expect(result).toEqual({
      isSuccess: true,
      data: orderService
    })
  })

  test('should call updateEquipmentRepository if order service was created', async () => {
    const result = await createOrderServiceUseCase.execute(data)

    expect(updateEquipmentRepository.updateEquipment).toBeCalledTimes(1)
    expect(updateEquipmentRepository.updateEquipment).toBeCalledWith(
      equipment.id,
      {
        situacao: Status.MAINTENANCE
      }
    )

    expect(result).toEqual({
      isSuccess: true,
      data: orderService
    })
  })

  test('should return CreateOrderServiceError if history returns undefined', async () => {
    historyRepository.create.mockResolvedValueOnce(null)

    const result = await createOrderServiceUseCase.execute(data)

    expect(result).toEqual({
      isSuccess: false,
      error: new CreateOrderServiceError()
    })
  })

  test('should return InvalidSenderError if senderName was undefined', async () => {
    const result = await createOrderServiceUseCase.execute({
      ...data,
      senderName: undefined
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new InvalidSenderError()
    })
  })
})
