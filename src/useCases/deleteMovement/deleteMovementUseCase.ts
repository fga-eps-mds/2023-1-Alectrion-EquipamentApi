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

export class TimeLimitError extends Error {
    constructor() {
        super('Tempo limite para operação excedido.')
        this.name = 'TimeLimitError'
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

        const movement : Movement = await this.movementRepository.genericFind({
            id: data.id,
            page: 1,
            resultQuantity: 1
        })[0]

        const now = new Date()

        if(now - movement.date > timeLimit)
            return {
                isSuccess: false,
                error: new TimeLimitError()
            }

        return {
            isSuccess: true
        }
    }
}
