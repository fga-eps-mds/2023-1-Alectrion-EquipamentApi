import { CreateMovementController } from '../../presentation/controller/createMovementController'
import { makeCreateMovement } from '../useCases/createMovement'

export const makeCreateMovementController = () => {
    return new CreateMovementController(makeCreateMovement())
}
