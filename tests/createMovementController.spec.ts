import { MockProxy, mock } from 'jest-mock-extended'

import {
  CreateMovementUseCase,
  CreateMovementUseCaseData,
  InvalidDestinationError,
  NullFieldsError
} from '../src/useCases/createMovement/createMovementUseCase'
import { CreateMovementController } from '../src/presentation/controller/createMovementController'

import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Unit } from '../src/domain/entities/unit'
import { Movement } from '../src/domain/entities/movement'
import { HttpResponse } from '../src/presentation/helpers/http'
import { ServerError } from '../src/presentation/errors'

describe('Create movement controller', () => {
  let createMovementUseCase: MockProxy<CreateMovementUseCase>
  let createMovementController: CreateMovementController

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
      estado: Estado.Novo,
      model: 'Xiaomi XT',
      description: '',
      acquisitionDate: new Date('2022-12-12'),
      power: '220',
      createdAt: new Date('2023-01-09T21:31:56.015Z'),
      updatedAt: new Date('2023-01-09T21:49:26.057Z')
    }

    createMovementUseCase = mock()
    createMovementController = new CreateMovementController(
      createMovementUseCase
    )
  })

  test('should get a successful response', async () => {
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

    createMovementUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: mockedMovement
    })

    const response: HttpResponse = await createMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 200)
    expect(response).toHaveProperty('data')
  })

  test('should get a bad request response', async () => {
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

    createMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new NullFieldsError()
    })

    const response: HttpResponse = await createMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 400)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(NullFieldsError)
  })

  test('should get a not found response', async () => {
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

    createMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidDestinationError()
    })

    const response: HttpResponse = await createMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 404)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(InvalidDestinationError)
  })

  test('should return server error response', async () => {
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

    createMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })

    const response: HttpResponse = await createMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})
