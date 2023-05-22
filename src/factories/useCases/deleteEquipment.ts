import { EquipmentRepository } from '../../repository/equipamentRepository'
import { MovementRepository } from '../../repository/movementRepository'
import { DeleteEquipmentUseCase } from '../../useCases/deleteEquipment/deleteEquipmentUseCase'

export const makeDeleteEquipment = () => {
  const equipmentRepository = new EquipmentRepository()
  const movementRepository = new MovementRepository()

  return new DeleteEquipmentUseCase(
    equipmentRepository,
    movementRepository
  )
}
