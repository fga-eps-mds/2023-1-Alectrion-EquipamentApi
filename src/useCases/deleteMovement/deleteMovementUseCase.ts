import { Movement } from '../../domain/entities/movement'

import { UseCase, UseCaseReponse } from './../protocol/useCase'

import { MovementRepositoryProtocol } from '../../repository/protocol/movementRepositoryProtocol'

export type DeleteMovementUseCaseData = {
    id: string
}

export class NullFieldsError extends Error {
    constructor() {
        super('Um ou mais campos obrigatórios possuem valores nulos.')
        this.name = 'NullFieldsError'
    }
}

export class InvalidMovementError extends Error {
    constructor() {
        super('ID fornecido inválido.')
        this.name = 'InvalidMovementError'
    }
}

export class TimeLimitError extends Error {
    constructor() {
        super('Tempo limite para operação excedido.')
        this.name = 'TimeLimitError'
    }
}

export class NotLastMovementError extends Error {
    constructor() {
        super('A movimentação fornecida não é a última movimentação registrada.')
        this.name = 'NotLastMovementError'
    }
}

export class DeleteMovementUseCase implements UseCase<DeleteMovementUseCaseData, boolean> {
    constructor(
        private readonly movementRepository: MovementRepositoryProtocol
    ) {}

    private areFieldsNull(data: DeleteMovementUseCaseData): boolean {
        return data.id == ''
    }

    async execute(data: DeleteMovementUseCaseData): Promise<UseCaseReponse<undefined>> {
        if(this.areFieldsNull(data))
            return {
                isSuccess: false,
                error: new NullFieldsError()
            }

        const timeLimit = 5 * 60 * 1000

        const result : Movement[] = await this.movementRepository.genericFind({
            id: data.id,
            page: 0,
            resultQuantity: 1
        })

        if(result.length < 1)
            return {
                isSuccess: false,
                error: new InvalidMovementError()
            }

        const movement : Movement = result[0]
        const lastMovement : Movement = (await this.movementRepository.genericFind({page: 0, resultQuantity: 1}))[0]

        const now = new Date()

        if((now as any) - (movement.date as any) > timeLimit)
            return {
                isSuccess: false,
                error: new TimeLimitError()
            }

        if(lastMovement.id != movement.id)
            return {
                isSuccess: false,
                error: new NotLastMovementError()
            }

        const wasDeleteSuccessful = await this.movementRepository.deleteOne(data.id)

        if(!wasDeleteSuccessful)
            return {
                isSuccess: false,
                error: new Error()
            }
        
        return {
            isSuccess: true
        }
    }
}
