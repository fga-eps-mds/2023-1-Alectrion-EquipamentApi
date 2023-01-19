import { DeleteMovementController } from '../../presentation/controller/deleteMovementController'
import { makeDeleteMovement } from '../useCases/deleteMovement'

export const makeDeleteMovementController = () => {
    return new DeleteMovementController(makeDeleteMovement())
}
