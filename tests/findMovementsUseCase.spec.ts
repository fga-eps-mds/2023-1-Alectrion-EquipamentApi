import { MockProxy, mock } from 'jest-mock-extended'

import { MovementRepositoryProtocol } from '../src/repository/protocol/movementRepositoryProtocol'

import {
  FindMovementsUseCase,
  FindMovementsUseCaseData,
  InvalidDateError
} from '../src/useCases/findMovements/findMovementsUseCase'

import { Equipment } from '../src/domain/entities/equipment'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Movement } from '../src/domain/entities/movement'

describe('Find movements use case', () => {
  let movementRepository: MockProxy<MovementRepositoryProtocol>

  let findMovementsUseCase: FindMovementsUseCase

  let mockedEquipment: Equipment

  beforeEach(() => {
    mockedEquipment = {
      id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
      tippingNumber: '123123',
      serialNumber: '123',
      type: Type.Nobreak,
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      acquisitionDate: new Date('2022-12-12'),
      power: '220',
      createdAt: new Date('2023-01-09T21:31:56.015Z'),
      updatedAt: new Date('2023-01-09T21:49:26.057Z')
    }

    movementRepository = mock()

    findMovementsUseCase = new FindMovementsUseCase(movementRepository)
  })

  test('should find movements with a simple query', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date('2023-01-09T21:36:35.971Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      },
      {
        id: '8253fbbd-eb19-42a6-86e6-f45126921e37',
        date: new Date('2023-01-09T21:39:25.373Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const query: FindMovementsUseCaseData = {
      type: 1
    }

    movementRepository.genericFind.mockResolvedValueOnce(mockedResult)

    const result = await findMovementsUseCase.execute(query)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data).toHaveLength(2)
    expect(result.data[0]).toHaveProperty('type', 1)
    expect(result.data[1]).toHaveProperty('type', 1)
  })

  test('should find movements with a complex query', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date('2023-01-09T21:36:35.971Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      },
      {
        id: '8253fbbd-eb19-42a6-86e6-f45126921e37',
        date: new Date('2023-01-09T21:39:25.373Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const query: FindMovementsUseCaseData = {
      type: 1,
      userid: '941f7db3-b754-4811-9884-24874fc40e28',
      equipmentid: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    }

    movementRepository.genericFind.mockResolvedValueOnce(mockedResult)

    const result = await findMovementsUseCase.execute(query)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result.data).toBeInstanceOf(Array)
    expect(result.data).toHaveLength(2)
    expect(result.data[0]).toHaveProperty('type', 1)
    expect(result.data[1]).toHaveProperty('type', 1)
    expect(result.data[0]).toHaveProperty(
      'userId',
      '941f7db3-b754-4811-9884-24874fc40e28'
    )
    expect(result.data[1]).toHaveProperty(
      'userId',
      '941f7db3-b754-4811-9884-24874fc40e28'
    )
    expect(result.data[0]).toHaveProperty('equipments')
    expect(result.data[0].equipments).toHaveLength(1)
    expect(result.data[0].equipments[0]).toHaveProperty(
      'id',
      'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    )
    expect(result.data[1]).toHaveProperty('equipments')
    expect(result.data[1].equipments).toHaveLength(1)
    expect(result.data[1].equipments[0]).toHaveProperty(
      'id',
      'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
    )
  })

  test('should not find movements with invalid date ranges', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date('2023-01-09T21:36:35.971Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      },
      {
        id: '8253fbbd-eb19-42a6-86e6-f45126921e37',
        date: new Date('2023-01-09T21:39:25.373Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const query: FindMovementsUseCaseData = {
      type: 1,
      lowerDate: new Date('2023-01-10T07:16:32.276Z'),
      higherDate: new Date('2023-01-10T07:14:54.078Z')
    }

    movementRepository.genericFind.mockResolvedValueOnce(mockedResult)

    const result = await findMovementsUseCase.execute(query)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).not.toHaveProperty('data')
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidDateError)
  })

  test('should find movements with by date when higher date is missing', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date('2023-01-09T21:36:35.971Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      },
      {
        id: '8253fbbd-eb19-42a6-86e6-f45126921e37',
        date: new Date('2023-01-09T21:39:25.373Z'),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [mockedEquipment],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const query: FindMovementsUseCaseData = {
      type: 1,
      lowerDate: new Date('2023-01-10T07:16:32.276Z')
    }

    movementRepository.genericFind.mockResolvedValueOnce(mockedResult)

    const result = await findMovementsUseCase.execute(query)

    expect(result).toHaveProperty('isSuccess', true)
    expect(result).toHaveProperty('data')
    expect(result).not.toHaveProperty('error')
  })
})
