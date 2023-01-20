import { UnitRepository } from '../../repository/unitRepository'
import { FindAllUnitUseCase } from '../../useCases/FindUnit/findAllUnitUseCase'

export const makeFindAllUnits = () => {
  const unitRepository = new UnitRepository()
  return new FindAllUnitUseCase(unitRepository)
}
