import { MockProxy, mock } from 'jest-mock-extended'

import { Movement } from '../src/domain/entities/movement'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Type } from '../src/domain/entities/equipamentEnum/type'

import { MovementRepositoryProtocol } from '../src/repository/protocol/movementRepositoryProtocol'

import { DeleteMovementUseCase, DeleteMovementUseCaseData, InvalidMovementError, TimeLimitError } from '../src/useCases/deleteMovement/deleteMovementUseCase'

describe('Find movements use case', () => {
    let movementRepository : MockProxy<MovementRepositoryProtocol>

    let deleteMovementUseCase : DeleteMovementUseCase

    beforeEach(() => {
        movementRepository = mock()

        deleteMovementUseCase = new DeleteMovementUseCase(movementRepository)
    })

    test('should delete movement', async() => {
        const mockedResult : Movement[] = [{
            id: "130265af-6afd-494d-b025-e657db264e56",
            date: new Date(),
            userId: "941f7db3-b754-4811-9884-24874fc40e28",
            type: 1,
            description: "broke it lmao",
            equipments: [{
                id: "c266c9d5-4e91-4c2e-9c38-fb8710d7e896",
                tippingNumber: "123123",
                serialNumber: "123",
                type: Type.NOBREAK,
                status: Status.ACTIVE,
                model: "Xiaomi XT",
                description: "",
                initialUseDate: "2022-12-12",
                acquisitionDate: new Date("2022-12-12"),
                invoiceNumber: "123",
                power: "220",
                createdAt: new Date("2023-01-09T21:31:56.015Z"),
                updatedAt: new Date("2023-01-09T21:49:26.057Z")
            }],
            destination: null,
            source: null,
            inChargeName: 'José Matheus',
            inChargeRole: 'Sargento',
            chiefName: 'Matheus Texeira',
            chiefRole: 'Delegado'
        }]

        const data : DeleteMovementUseCaseData  = {
            id: "130265af-6afd-494d-b025-e657db264e56"
        }

        movementRepository.genericFind.mockResolvedValueOnce(mockedResult)
        movementRepository.deleteOne.mockResolvedValueOnce(true)

        const result = await deleteMovementUseCase.execute(data)

        expect(result).toHaveProperty('isSuccess', true)
    })

    test('should not delete movement after 5 minutes of creation', async() => {
        const mockedResult : Movement[] = [{
            id: "130265af-6afd-494d-b025-e657db264e56",
            date: new Date((new Date() as any) - (6 * 60 * 1000)),
            userId: "941f7db3-b754-4811-9884-24874fc40e28",
            type: 1,
            description: "broke it lmao",
            equipments: [{
                id: "c266c9d5-4e91-4c2e-9c38-fb8710d7e896",
                tippingNumber: "123123",
                serialNumber: "123",
                type: Type.NOBREAK,
                status: Status.ACTIVE,
                model: "Xiaomi XT",
                description: "",
                initialUseDate: "2022-12-12",
                acquisitionDate: new Date("2022-12-12"),
                invoiceNumber: "123",
                power: "220",
                createdAt: new Date("2023-01-09T21:31:56.015Z"),
                updatedAt: new Date("2023-01-09T21:49:26.057Z")
            }],
            destination: null,
            source: null,
            inChargeName: 'José Matheus',
            inChargeRole: 'Sargento',
            chiefName: 'Matheus Texeira',
            chiefRole: 'Delegado'
        }]

        const data : DeleteMovementUseCaseData  = {
            id: "130265af-6afd-494d-b025-e657db264e56"
        }

        movementRepository.genericFind.mockResolvedValueOnce(mockedResult)
        movementRepository.deleteOne.mockResolvedValueOnce(true)

        const result = await deleteMovementUseCase.execute(data)

        expect(result).toHaveProperty('isSuccess', false)
        expect(result).toHaveProperty('error')
        expect(result.error).toBeInstanceOf(TimeLimitError)
    })

    test('should not delete invalid movement', async() => {
        const mockedResult : Movement[] = []

        const data : DeleteMovementUseCaseData  = {
            id: "130265af-6afd-494d-b025-e657db264e56"
        }

        movementRepository.genericFind.mockResolvedValueOnce(mockedResult)
        movementRepository.deleteOne.mockResolvedValueOnce(true)

        const result = await deleteMovementUseCase.execute(data)

        expect(result).toHaveProperty('isSuccess', false)
        expect(result).toHaveProperty('error')
        expect(result.error).toBeInstanceOf(InvalidMovementError)
    })

    test('should present internal error', async() => {
        const mockedResult : Movement[] = [{
            id: "130265af-6afd-494d-b025-e657db264e56",
            date: new Date(),
            userId: "941f7db3-b754-4811-9884-24874fc40e28",
            type: 1,
            description: "broke it lmao",
            equipments: [{
                id: "c266c9d5-4e91-4c2e-9c38-fb8710d7e896",
                tippingNumber: "123123",
                serialNumber: "123",
                type: Type.NOBREAK,
                status: Status.ACTIVE,
                model: "Xiaomi XT",
                description: "",
                initialUseDate: "2022-12-12",
                acquisitionDate: new Date("2022-12-12"),
                invoiceNumber: "123",
                power: "220",
                createdAt: new Date("2023-01-09T21:31:56.015Z"),
                updatedAt: new Date("2023-01-09T21:49:26.057Z")
            }],
            destination: null,
            source: null,
            inChargeName: 'José Matheus',
            inChargeRole: 'Sargento',
            chiefName: 'Matheus Texeira',
            chiefRole: 'Delegado'
        }]

        const data : DeleteMovementUseCaseData  = {
            id: "130265af-6afd-494d-b025-e657db264e56"
        }

        movementRepository.genericFind.mockResolvedValueOnce(mockedResult)
        movementRepository.deleteOne.mockResolvedValueOnce(false)

        const result = await deleteMovementUseCase.execute(data)

        expect(result).toHaveProperty('isSuccess', false)
        expect(result).toHaveProperty('error')
        expect(result.error).toBeInstanceOf(Error)
    })
})
