import { MockProxy, mock } from 'jest-mock-extended'

import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'
import { UnitRepositoryProtocol as UnitRepositoryProtocol } from '../src/repository/protocol/unitRepositoryProtocol'
import { MovementRepositoryProtocol } from '../src/repository/protocol/movementRepositoryProtocol'

import {
  CreateMovementUseCase,
  CreateMovementUseCaseData,
  InvalidDestinationError,
  InvalidEquipmentError,
  InvalidStatusError,
  InvalidTypeError,
  NullFieldsError
} from '../src/useCases/createMovement/createMovementUseCase'

import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Unit } from '../src/domain/entities/unit'
import { Movement } from '../src/domain/entities/movement'

describe('Create movement use case', () => {
  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>
  let unitRepository: MockProxy<UnitRepositoryProtocol>
  let movementRepository: MockProxy<MovementRepositoryProtocol>

  let createMovementUseCase: CreateMovementUseCase

  let mockedEquipment // Should have : Equipment, but the Equipment repository is badly typed

  const mockedUnitOne: Unit = {
    id: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
    name: 'Conselho Superior da Polícia Civil',
    localization: 'Goiânia'
  }

  beforeEach(() => {
    mockedEquipment = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: 'Novo',
      model: 'Xiaomi XT',
      description: '',
      acquisitionDate: new Date('2022-12-12'),
      power: '220',
      createdAt: new Date('2023-01-09T21:31:56.015Z'),
      updatedAt: new Date('2023-01-09T21:49:26.057Z')
    }

    equipmentRepository = mock()
    unitRepository = mock()
    movementRepository = mock()

    createMovementUseCase = new CreateMovementUseCase(
      equipmentRepository,
      unitRepository,
      movementRepository
    )
  })

  test('should create a borrow movement', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE_LOAN }],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 0,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('type', 0)
    expect(result.data).toHaveProperty('equipments')
    expect(result.data.equipments).toBeInstanceOf(Array)
    expect(result.data.equipments).toHaveLength(1)
    expect(result.data.equipments[0]).toHaveProperty(
      'situacao',
      Status.ACTIVE_LOAN
    )
    expect(result.data).toHaveProperty('destination')
    expect(result.data).toHaveProperty('inChargeName', 'José Matheus')
    expect(result.data).toHaveProperty('inChargeRole', 'Sargento')
    expect(result.data).toHaveProperty('chiefName', 'Matheus Texeira')
    expect(result.data).toHaveProperty('chiefRole', 'Delegado')
  })

  test('should create a dismiss movement with no description and technical reserve status', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.TECHNICAL_RESERVE }],
      type: 1,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 1,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      status: Status.TECHNICAL_RESERVE,
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('type', 1)
    expect(result.data).toHaveProperty('equipments')
    expect(result.data.equipments).toBeInstanceOf(Array)
    expect(result.data.equipments).toHaveLength(1)
    expect(result.data.equipments[0]).toHaveProperty(
      'situacao',
      Status.TECHNICAL_RESERVE
    )
    expect(result.data).not.toHaveProperty('description')
    expect(result.data).toHaveProperty('inChargeName', 'José Matheus')
    expect(result.data).toHaveProperty('inChargeRole', 'Sargento')
    expect(result.data).toHaveProperty('chiefName', 'Matheus Texeira')
    expect(result.data).toHaveProperty('chiefRole', 'Delegado')
  })

  test('should create a dismiss movement with a description and downgraded status', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.DOWNGRADED }],
      type: 1,
      description: 'Caiu no chão e ficou só o caco.',
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 1,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      status: Status.DOWNGRADED,
      description: 'Caiu no chão e ficou só o caco.',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('type', 1)
    expect(result.data).toHaveProperty('equipments')
    expect(result.data.equipments).toBeInstanceOf(Array)
    expect(result.data.equipments).toHaveLength(1)
    expect(result.data.equipments[0]).toHaveProperty(
      'situacao',
      Status.DOWNGRADED
    )
    expect(result.data).toHaveProperty(
      'description',
      'Caiu no chão e ficou só o caco.'
    )
    expect(result.data).toHaveProperty('inChargeName', 'José Matheus')
    expect(result.data).toHaveProperty('inChargeRole', 'Sargento')
    expect(result.data).toHaveProperty('chiefName', 'Matheus Texeira')
    expect(result.data).toHaveProperty('chiefRole', 'Delegado')
  })

  test('should create an ownership movement', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE }],
      type: 2,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 2,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toHaveProperty('id')
    expect(result.data).toHaveProperty('type', 2)
    expect(result.data).toHaveProperty('equipments')
    expect(result.data.equipments).toBeInstanceOf(Array)
    expect(result.data.equipments).toHaveLength(1)
    expect(result.data.equipments[0]).toHaveProperty('situacao', Status.ACTIVE)
    expect(result.data).toHaveProperty('destination')
    expect(result.data).toHaveProperty('inChargeName', 'José Matheus')
    expect(result.data).toHaveProperty('inChargeRole', 'Sargento')
    expect(result.data).toHaveProperty('chiefName', 'Matheus Texeira')
    expect(result.data).toHaveProperty('chiefRole', 'Delegado')
  })

  test('should not create a movement with missing obligatory fields', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE_LOAN }],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 0,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      userid: '',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(NullFieldsError)
  })

  test('should not create a movement with an invalid type', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE_LOAN }],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 4,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidTypeError)
  })

  test('should not create a movement with invalid equipments', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE_LOAN }],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['heeheehoohoo'],
      type: 0,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(null)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidEquipmentError)
  })

  test('should not create a borrow movement with an invalid destination', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.ACTIVE_LOAN }],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 0,
      destination: 'piparaparapo',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(null)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidDestinationError)
  })

  test('should not create a dismiss movement with an invalid status', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, situacao: Status.TECHNICAL_RESERVE }],
      type: 1,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 1,
      status: Status.MAINTENANCE,
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidStatusError)
  })

  test('should not create an ownership movement with an invalid destination', async () => {
    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [{ ...mockedEquipment, status: Status.ACTIVE }],
      type: 2,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const data: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 2,
      destination: 'piparaparapo',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(null)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)

    const result = await createMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidDestinationError)
  })
})
