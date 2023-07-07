import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { DeleteEquipmentTypeUseCase } from '../../useCases/delete-equipment-type/delete-equipment.type.use-case'

export const makeDeleteEquipmentType = () => {
  const equipmentType = new EquipmentTypeTypeormRepository()

  return new DeleteEquipmentTypeUseCase(equipmentType)
}
