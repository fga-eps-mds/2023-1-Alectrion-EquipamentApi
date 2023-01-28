import { MovementRepository } from '../../repository/movementRepository'

import { FindMovementsUseCase } from '../../useCases/findMovements/findMovementsUseCase'

export const makeFindMovements = () => {
    const movementRepository = new MovementRepository()

    return new FindMovementsUseCase(movementRepository)
}
