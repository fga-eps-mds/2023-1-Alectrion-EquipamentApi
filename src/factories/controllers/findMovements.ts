import { FindMovementsController } from '../../presentation/controller/findMovementsController'
import { makeFindMovements } from '../useCases/findMovements'

export const makeFindMovementsController = () => {
    return new FindMovementsController(makeFindMovements())
}
