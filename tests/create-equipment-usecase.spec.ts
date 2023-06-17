import { MockProxy, mock } from 'jest-mock-extended'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { StorageType } from '../src/domain/entities/equipamentEnum/storageType'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import { Unit } from '../src/domain/entities/unit'
import AcquisitionRepositoryProtocol from '../src/repository/protocol/acquisitionRepositoryProtocol'
import { BrandRepositoryProtocol } from '../src/repository/protocol/brandRepositoryProtocol'
import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'
import { UnitRepositoryProtocol } from '../src/repository/protocol/unitRepositoryProtocol'
import {
  CreateEquipmentUseCase,
  CreateEquipmentInterface,
  NotFoundUnit,
  InvalidTippingNumber,
  NullFields,
  EquipmentTypeError
} from '../src/useCases/createEquipment/createEquipmentUseCase'
import { Equipment as EquipmentDb } from '../src/db/entities/equipment'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { ScreenType } from '../src/domain/entities/equipamentEnum/screenType'

describe('Test create order use case', () => {
  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>
  let unitRepository: MockProxy<UnitRepositoryProtocol>
  let brandRepository: MockProxy<BrandRepositoryProtocol>
  let acquisitionRepository: MockProxy<AcquisitionRepositoryProtocol>
  let createEquipmentUseCase: CreateEquipmentUseCase

  const unit: Unit = {
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
    id: 'teste',
    localization: 'localization',
    name: 'nome'
  }

  const createEquipmentInterface: CreateEquipmentInterface = {
    acquisitionDate: new Date('2023-01-20'),
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: 'any',
    model: 'DELL G15',
    serialNumber: 'any',
    type: Type.CPU,
    unitId: 'any_id',
    acquisitionName: 'any_name',
    brandName: 'brand_name',
    ram_size: '16',
    storageAmount: '256',
    storageType: 'SSD',
    processor: 'i7'
  }

  const createGeneralEquipmentInterface = {
    acquisitionDate: new Date('2023-01-20'),
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: 'any',
    model: 'DELL G15',
    serialNumber: 'any',
    unitId: 'any_id',
    acquisitionName: 'any_name',
    brandName: 'brand_name'
  }

  const equipment: Equipment = {
    id: 'id',
    acquisition: {
      id: '',
      name: ''
    },
    acquisitionDate: createEquipmentInterface.acquisitionDate,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: createEquipmentInterface.tippingNumber,
    model: createEquipmentInterface.model,
    serialNumber: createEquipmentInterface.serialNumber,
    type: createEquipmentInterface.type as Type,
    ram_size: '16',
    storageAmount: '256',
    storageType: 'SSD' as StorageType,
    processor: 'i7',
    unit,
    brand: {
      id: '',
      name: 'brand'
    }
  }

  beforeEach(() => {
    equipmentRepository = mock()
    unitRepository = mock()
    brandRepository = mock()
    acquisitionRepository = mock()
    createEquipmentUseCase = new CreateEquipmentUseCase(
      equipmentRepository,
      unitRepository,
      brandRepository,
      acquisitionRepository
    )

    unitRepository.findOne.mockResolvedValue(unit)

    brandRepository.findOneByName.mockResolvedValue({
      id: '',
      name: 'brand'
    })

    acquisitionRepository.findOneByName.mockResolvedValue({
      id: '',
      name: ''
    })

    equipmentRepository.findByTippingNumber.mockResolvedValue(undefined)
  })
  test('should call unit repository with correct params', async () => {
    await createEquipmentUseCase.execute(createEquipmentInterface)

    expect(unitRepository.findOne).toBeCalledWith(
      createEquipmentInterface.unitId
    )
    expect(unitRepository.findOne).toBeCalledTimes(1)
  })

  test('should call brandRepository with correct params', async () => {
    await createEquipmentUseCase.execute(createEquipmentInterface)

    expect(brandRepository.findOneByName).toBeCalledWith(
      createEquipmentInterface.brandName
    )
    expect(unitRepository.findOne).toBeCalledTimes(1)
  })

  test('should call brandRepository with no params', async () => {
    const { brandName, ...rest } = createEquipmentInterface

    await createEquipmentUseCase.execute({
      ...rest,
      brandName: undefined
    })

    expect(
      brandRepository.findOneByName.mockResolvedValue(null)
    ).toBeCalledWith(undefined)
    expect(unitRepository.findOne).toBeCalledTimes(1)
  })

  test('should return NotFoundUnit if no unit found', async () => {
    unitRepository.findOne.mockResolvedValueOnce(undefined)

    const result = await createEquipmentUseCase.execute(
      createEquipmentInterface
    )

    expect(result).toEqual({
      isSuccess: false,
      error: new NotFoundUnit()
    })
  })

  test('should return InvalidTippingNumber if already exists equipment with tippingNumber', async () => {
    equipmentRepository.findByTippingNumber.mockResolvedValueOnce(
      equipment as unknown as EquipmentDb
    )

    const result = await createEquipmentUseCase.execute(
      createEquipmentInterface
    )

    expect(result).toEqual({
      isSuccess: false,
      error: new InvalidTippingNumber()
    })
  })

  test('should return NullFields if pass wrong screen type for monitor', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Monitor,
      screenSize: '40pol',
      screenType: 'CRT'
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new NullFields()
    })
  })

  test('should return EquipmentTypeError if pass wrong equipment type', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createEquipmentInterface,
      type: 'TESTE'
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeError()
    })
  })

  test('should return NullFields if pass required info for CPU', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createEquipmentInterface,
      type: 'CPU',
      ram_size: undefined
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new NullFields()
    })
  })

  test('should return NullFields if pass required info for monitor', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createEquipmentInterface,
      type: 'Monitor',
      screenType: 'LCDS'
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new NullFields()
    })
  })

  test('should return NullFields if pass required info for monitor', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createEquipmentInterface,
      type: 'Nobreak'
      // power: undefined
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new NullFields()
    })
  })

  test('should return NullFields if pass required info for monitor', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createEquipmentInterface,
      type: 'Estabilizador',
      power: undefined
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new NullFields()
    })
  })

  test('should create monitor', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Monitor,
      screenType: ScreenType.LED,
      screenSize: '40pol'
    })

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = Type.Monitor
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber
    equipmentDB.screenType = ScreenType.LED
    equipmentDB.screenSize = '40pol'

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  test('should create noBreak', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Nobreak,
      power: '220'
    })

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = Type?.Nobreak
    equipmentDB.power = '220'
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  test('should create "estabilizador"', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Estabilizador,
      power: '220'
    })

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = Type?.Estabilizador
    equipmentDB.power = '220'
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  test('should create webcam', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Webcam
    })

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = Type?.Webcam
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  test('should create "escaneador"', async () => {
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: Type.Escaneador
    })

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = Type?.Escaneador
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  test('should create equipment (CPU)', async () => {
    const result = await createEquipmentUseCase.execute(
      createEquipmentInterface
    )

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.unit = {
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
      id: 'teste',
      localization: 'localization',
      name: 'nome'
    }
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = equipment.type
    equipmentDB.processor = equipment.processor
    equipmentDB.storageType = equipment.storageType
    equipmentDB.storageAmount = equipment.storageAmount
    equipmentDB.model = equipment.model
    equipmentDB.ram_size = equipment.ram_size
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })
})
