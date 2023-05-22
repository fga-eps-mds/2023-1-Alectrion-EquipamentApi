import { MockProxy, mock } from 'jest-mock-extended'

import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'

import { Equipment as EquipmentDb } from '../src/db/entities/equipment'

import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'

import {
  CreateMovementUseCase,
  CreateMovementUseCaseData
} from '../src/useCases/createMovement/createMovementUseCase'

import {
  DeleteEquipmentUseCase,
  DeleteEquipmentUseCaseData,
  InvalidEquipmentError,
  TimeLimitError,
  NullFieldsError,
  EquipmentMovedError
} from '../src/useCases/deleteEquipment/deleteEquipmentUseCase'

import { MovementRepository } from '../src/repository/movementRepository'
import { MovementRepositoryProtocol } from '../src/repository/protocol/movementRepositoryProtocol'
import { UnitRepositoryProtocol } from '../src/repository/protocol/unitRepositoryProtocol'
import { CreateOrderServiceTypeOrmRepository } from '../src/db/repositories/order-service/create-order-service-typeorm-repository'
import { UnitRepository } from '../src/repository/unitRepository'
import { Unit } from '../src/domain/entities/unit'
import { Movement } from '../src/domain/entities/movement'

describe('Delete equipments use case', () => {
  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>
  let movementRepository: MockProxy<MovementRepositoryProtocol>
  let unitRepository: MockProxy<UnitRepositoryProtocol>

  let deleteEquipmentUseCase: DeleteEquipmentUseCase
  let createMovementUseCase: CreateMovementUseCase

  const mockedUnitOne: Unit = {
    id: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
    name: 'Conselho Superior da Polícia Civil',
    localization: 'Goiânia'
  }

  beforeEach(() => {
    equipmentRepository = mock()
    movementRepository = mock()
    unitRepository = mock()

    deleteEquipmentUseCase = new DeleteEquipmentUseCase(
      equipmentRepository,
      movementRepository
    )
    createMovementUseCase = new CreateMovementUseCase(
      equipmentRepository,
      unitRepository,
      movementRepository
    )
  })

  test('should get a null fields error', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: ''
    }
    const result = deleteEquipmentUseCase.execute(data)
    expect((await result).isSuccess).toBe(false)
    expect((await result).error).toBeInstanceOf(NullFieldsError)
  })

  test('should get a invalid equipment error', async () => {
    const mockedResult: EquipmentDb[] = []

    const data: DeleteEquipmentUseCaseData = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }
    equipmentRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)

    const result = await deleteEquipmentUseCase.execute(data)
    expect(result).toHaveProperty('isSuccess', false)
    expect(result.error).toBeInstanceOf(InvalidEquipmentError)
  })

  test('should get an unsuccessful delete error', async () => {
    const now = Date.now()
    const mockedResult: EquipmentDb = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      initialUseDate: '2022-12-12',
      acquisitionDate: new Date('2022-12-12'),
      invoiceNumber: '123',
      power: '220',
      createdAt: new Date(now),
      updatedAt: new Date(now)
    }

    const data: DeleteEquipmentUseCaseData = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }
    equipmentRepository.findOne
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    equipmentRepository.deleteOne.mockReturnValueOnce(Promise.resolve(false))

    const result = await deleteEquipmentUseCase.execute(data)
    expect(result).toHaveProperty('isSuccess', false)
    expect(result.error).toBeInstanceOf(Error)
  })

  test('should delete equipment', async () => {
    const now = Date.now()
    const mockedResult: EquipmentDb = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      initialUseDate: '2022-12-12',
      acquisitionDate: new Date('2022-12-12'),
      invoiceNumber: '123',
      power: '220',
      createdAt: new Date(now),
      updatedAt: new Date(now)
    }

    const data: DeleteEquipmentUseCaseData = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }

    equipmentRepository.findOne
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    equipmentRepository.deleteOne.mockResolvedValueOnce(true)

    const result = await deleteEquipmentUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
  })

  test('should not delete equipment with a movimentation associated', async () => {
    const now = Date.now()
    const mockedEquipment: EquipmentDb = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      initialUseDate: '2022-12-12',
      acquisitionDate: new Date('2022-12-12'),
      invoiceNumber: '123',
      power: '220',
      createdAt: new Date(now),
      updatedAt: new Date(now)
    }

    const mockedMovement: Movement = {
      id: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      date: new Date(),
      userId: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: [mockedEquipment],
      type: 0,
      destination: mockedUnitOne,
      inChargeName: 'José Matheus',
      inChargeRole: 'Sargento',
      chiefName: 'Matheus Texeira',
      chiefRole: 'Delegado'
    }

    const move: CreateMovementUseCaseData = {
      userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
      equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
      type: 0,
      destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
      inchargename: 'José Matheus',
      inchargerole: 'Sargento',
      chiefname: 'Matheus Texeira',
      chiefrole: 'Delegado'
    }

    const data: DeleteEquipmentUseCaseData = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }

    equipmentRepository.findOne.mockResolvedValueOnce(mockedEquipment).mockResolvedValueOnce(mockedEquipment)
    unitRepository.findOne.mockResolvedValueOnce(mockedUnitOne)
    movementRepository.create.mockResolvedValueOnce(mockedMovement)
    movementRepository.genericFind.mockResolvedValueOnce([mockedMovement])
    equipmentRepository.deleteOne.mockResolvedValueOnce(Promise.resolve(false))

    const moveResult = await createMovementUseCase.execute(move)

    
    console.log('moveResult error:', moveResult.error)
    console.log('moveResult isSucess:', moveResult.isSuccess)
    console.log('moveResult data:', moveResult.data)
    
    
    expect(moveResult).toHaveProperty('isSuccess', true)
    expect(moveResult.data).toHaveProperty('equipments')
    expect(moveResult.data.equipments).toBeInstanceOf(Array)
    expect(moveResult.data.equipments).toHaveLength(1)
    
    const result = await deleteEquipmentUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(EquipmentMovedError)
  })

  test('should not delete equipment after 10 minutes of creation', async () => {
    const now = Date.now()
    const tenMinutes = 60 * 10 * 1000

    const mockedResult: EquipmentDb = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      initialUseDate: '2022-12-12',
      acquisitionDate: new Date(now - tenMinutes),
      invoiceNumber: '123',
      power: '220',
      createdAt: new Date(now - tenMinutes - 1),
      updatedAt: new Date(now - tenMinutes - 1)
    }

    const data: DeleteEquipmentUseCaseData = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }

    equipmentRepository.findOne
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    equipmentRepository.deleteOne.mockResolvedValueOnce(true)

    const result = await deleteEquipmentUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(TimeLimitError)
  })
})
