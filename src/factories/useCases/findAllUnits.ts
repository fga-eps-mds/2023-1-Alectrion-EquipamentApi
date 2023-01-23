import { UnitRepository } from '../../repository/unitRepository'
import { FindAllUnitUseCase } from '../../../src/useCases/FindUnit/findAllUnitUseCase'

export const makeFindAllUnits = () => {
  const unitRepository = new UnitRepository()
  return new FindAllUnitUseCase(unitRepository)
}
