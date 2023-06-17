import { MockProxy, mock } from 'jest-mock-extended'

import {
  FindMovementsUseCase,
  FindMovementsUseCaseData,
  InvalidDateError
} from '../src/useCases/findMovements/findMovementsUseCase'
import { FindMovementsController } from '../src/presentation/controller/findMovementsController'

import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Movement } from '../src/domain/entities/movement'
import { HttpResponse } from '../src/presentation/helpers/http'
import { ServerError } from '../src/presentation/errors'

describe('Create movement controller', () => {
  let findMovementsUseCase: MockProxy<FindMovementsUseCase>
  let findMovementsController: FindMovementsController

  let mockedEquipment // Should have : Equipment, but the Equipment repository is badly typed

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

    findMovementsUseCase = mock()
    findMovementsController = new FindMovementsController(findMovementsUseCase)
  })

  test('should get a successful response', async () => {
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

    findMovementsUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: mockedResult
    })

    const response: HttpResponse = await findMovementsController.perform(query)

    expect(response).toHaveProperty('statusCode', 200)
    expect(response).toHaveProperty('data')
  })

  test('should get a bad request response', async () => {
    const query: FindMovementsUseCaseData = {
      type: 1,
      lowerDate: new Date('2023-01-10T07:16:32.276Z'),
      higherDate: new Date('2023-01-10T07:14:54.078Z')
    }

    findMovementsUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidDateError()
    })

    const response: HttpResponse = await findMovementsController.perform(query)

    expect(response).toHaveProperty('statusCode', 400)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(InvalidDateError)
  })

  test('should return server error request response', async () => {
    const query: FindMovementsUseCaseData = {
      type: 1,
      lowerDate: new Date('2023-01-10T07:16:32.276Z'),
      higherDate: new Date('2023-01-10T07:14:54.078Z')
    }

    findMovementsUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })

    const response: HttpResponse = await findMovementsController.perform(query)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})
