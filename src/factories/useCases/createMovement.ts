import { EquipmentRepository } from '../../repository/equipamentRepository'
import { UnitRepository } from '../../repository/unitRepository'
import { MovementRepository } from '../../repository/movementRepository'

import { CreateMovementUseCase } from '../../useCases/createMovement/createMovementUseCase'

export const makeCreateMovement = () => {
  const equipmentRepository = new EquipmentRepository()
  const unitRepository = new UnitRepository()
  const movementRepository = new MovementRepository()

  return new CreateMovementUseCase(
    equipmentRepository,
    unitRepository,
    movementRepository
  )
}
