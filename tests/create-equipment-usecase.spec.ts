import { MockProxy, mock } from 'jest-mock-extended'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { StorageType } from '../src/domain/entities/equipamentEnum/storageType'
import { Equipment } from '../src/domain/entities/equipment'
import { Unit } from '../src/domain/entities/unit'
import AcquisitionRepositoryProtocol from '../src/repository/protocol/acquisitionRepositoryProtocol'
import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'
import { UnitRepositoryProtocol } from '../src/repository/protocol/unitRepositoryProtocol'
import {
  CreateEquipmentUseCase,
  CreateEquipmentInterface,
  NotFoundUnit,
  InvalidTippingNumber,
  EquipmentTypeError
} from '../src/useCases/createEquipment/createEquipmentUseCase'
import { Equipment as EquipmentDb } from '../src/db/entities/equipment'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { ScreenType } from '../src/domain/entities/equipamentEnum/screenType'
import { EquipmentBrandRepository } from '../src/repository/equipment-brand/equipment-brand.repository'
import { EquipmentTypeRepository } from '../src/repository/equipment-type/equipment-type.repository'

describe('Test create order use case', () => {
  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>
  let unitRepository: MockProxy<UnitRepositoryProtocol>
  let brandRepository: MockProxy<EquipmentBrandRepository>
  let acquisitionRepository: MockProxy<AcquisitionRepositoryProtocol>
  let typeRepository: MockProxy<EquipmentTypeRepository>
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
    type: 'any',
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
    type: {
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ram_size: '16',
    storageAmount: '256',
    storageType: 'SSD' as StorageType,
    processor: 'i7',
    unit,
    brand: {
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  beforeEach(() => {
    equipmentRepository = mock()
    unitRepository = mock()
    brandRepository = mock()
    acquisitionRepository = mock()
    typeRepository = mock()
    createEquipmentUseCase = new CreateEquipmentUseCase(
      equipmentRepository,
      unitRepository,
      brandRepository,
      acquisitionRepository,
      typeRepository
    )

    unitRepository.findOne.mockResolvedValue(unit)

    brandRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
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

    expect(brandRepository.findByName).toBeCalledWith(
      createEquipmentInterface.brandName
    )
    expect(typeRepository.findByName).toBeCalledWith(
      createEquipmentInterface.type
    )
    expect(unitRepository.findOne).toBeCalledTimes(1)
  })

  test('should call brandRepository with no params', async () => {
    const { brandName, ...rest } = createEquipmentInterface

    await createEquipmentUseCase.execute({
      ...rest,
      brandName: undefined
    })

    expect(brandRepository.findByName.mockResolvedValue(null)).toBeCalledWith(
      undefined
    )
    expect(typeRepository.findByName).toBeCalledWith(
      createEquipmentInterface.type
    )
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
      type: 'Monitor',
      screenSize: '40pol',
      screenType: 'CRT'
    })

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeError()
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
      error: new EquipmentTypeError()
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
      error: new EquipmentTypeError()
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
      error: new EquipmentTypeError()
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
      error: new EquipmentTypeError()
    })
  })

  test('should create monitor', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Monitor',
      createdAt: data,
      updatedAt: data
    })
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: 'Monitor',
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
      id: 2,
      name: 'Monitor',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber
    equipmentDB.screenType = ScreenType.LED
    equipmentDB.screenSize = '40pol'

    expect(result.isSuccess).toEqual(true)
  })

  test('should create noBreak', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Nobreak',
      createdAt: data,
      updatedAt: data
    })
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: 'Nobreak',
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
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'Nobreak',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.power = '220'
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result.isSuccess).toEqual(true)
  })

  test('should create "estabilizador"', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Estabilizador',
      createdAt: data,
      updatedAt: data
    })
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: 'Estabilizador',
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
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.power = '220'
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result.isSuccess).toEqual(true)
  })

  /* test('should create webcam', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Webcam',
      createdAt: data,
      updatedAt: data
    })
    const result = await createEquipmentUseCase.execute({
      ...createGeneralEquipmentInterface,
      type: 'Webcam'
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
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'Webcam',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result.isSuccess).toEqual(true)
  }) */

  /* test('should create "escaneador"', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Escaneador',
      createdAt: data,
      updatedAt: data
    })
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
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'Escaneador',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.model = equipment.model
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result.isSuccess).toEqual(true)
  }) */

  test('should create equipment (CPU)', async () => {
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'CPU',
      createdAt: data,
      updatedAt: data
    })
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
      id: 2,
      name: 'any',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'CPU',
      createdAt: data,
      updatedAt: data
    }
    equipmentDB.processor = equipment.processor
    equipmentDB.storageType = equipment.storageType
    equipmentDB.storageAmount = equipment.storageAmount
    equipmentDB.model = equipment.model
    equipmentDB.ram_size = equipment.ram_size
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber

    expect(result.isSuccess).toEqual(true)
  })
})
