import { MovementRepository } from '../../repository/movementRepository'

import { DeleteMovementUseCase } from '../../useCases/deleteMovement/deleteMovementUseCase'

export const makeDeleteMovement = () => {
    const movementRepository = new MovementRepository()

    return new DeleteMovementUseCase(movementRepository)
}
