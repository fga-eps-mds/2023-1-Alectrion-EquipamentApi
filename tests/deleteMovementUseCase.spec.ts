import { MockProxy, mock } from 'jest-mock-extended'

import { Movement } from '../src/domain/entities/movement'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'

import { MovementRepositoryProtocol } from '../src/repository/protocol/movementRepositoryProtocol'

import {
  DeleteMovementUseCase,
  DeleteMovementUseCaseData,
  InvalidMovementError,
  TimeLimitError,
  NotLastMovementError,
  NullFieldsError
} from '../src/useCases/deleteMovement/deleteMovementUseCase'

describe('Find movements use case', () => {
  let movementRepository: MockProxy<MovementRepositoryProtocol>

  let deleteMovementUseCase: DeleteMovementUseCase

  beforeEach(() => {
    movementRepository = mock()

    deleteMovementUseCase = new DeleteMovementUseCase(movementRepository)
  })

  test('should delete movement', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    movementRepository.deleteOne.mockResolvedValueOnce(true)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', true)
  })

  test('should not delete movement after 5 minutes of creation', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date((new Date() as any) - 6 * 60 * 1000),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    movementRepository.deleteOne.mockResolvedValueOnce(true)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(TimeLimitError)
  })

  test('should not delete invalid movement', async () => {
    const mockedResult: Movement[] = []

    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    movementRepository.deleteOne.mockResolvedValueOnce(true)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(InvalidMovementError)
  })

  test('should present internal error', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    movementRepository.deleteOne.mockResolvedValueOnce(false)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(Error)
  })

  test('should not delete non-last movement', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const mockedResultTwo: Movement[] = [
      {
        id: '4235dcf9-70ab-452f-9453-79d0bf89c0ac',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResultTwo)
    movementRepository.deleteOne.mockResolvedValueOnce(false)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(NotLastMovementError)
  })

  test('should not delete movement with null fields', async () => {
    const mockedResult: Movement[] = [
      {
        id: '130265af-6afd-494d-b025-e657db264e56',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]

    const mockedResultTwo: Movement[] = [
      {
        id: '4235dcf9-70ab-452f-9453-79d0bf89c0ac',
        date: new Date(),
        userId: '941f7db3-b754-4811-9884-24874fc40e28',
        type: 1,
        description: 'broke it lmao',
        equipments: [
          {
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
        ],
        destination: null,
        inChargeName: 'José Matheus',
        inChargeRole: 'Sargento',
        chiefName: 'Matheus Texeira',
        chiefRole: 'Delegado'
      }
    ]
    const data: DeleteMovementUseCaseData = {
      id: ''
    }

    movementRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResultTwo)
    movementRepository.deleteOne.mockResolvedValueOnce(false)

    const result = await deleteMovementUseCase.execute(data)

    expect(result).toHaveProperty('isSuccess', false)
    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(NullFieldsError)
  })
})
