import { EquipmentRepository } from '../../repository/equipamentRepository'
import { UnitRepository } from '../../repository/unitRepository'
import { MovementRepository } from '../../repository/movementRepository'
import { CreateMovementUseCase } from '../../useCases/createMovement/createMovementUseCase'
import { UpdateEquipmentTypeorm } from '../../db/repositories/equipment/update-equipment-typeorm-repository'

export const makeCreateMovement = () => {
  const equipmentRepository = new EquipmentRepository()
  const unitRepository = new UnitRepository()
  const movementRepository = new MovementRepository()
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()

  return new CreateMovementUseCase(
    equipmentRepository,
    unitRepository,
    movementRepository,
    updateEquipmentRepository
  )
}
