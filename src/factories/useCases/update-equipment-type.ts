import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { UpdateEquipmentTypeUseCase } from '../../useCases/update-equipment-type/update-equipment-type.use-case'

export const makeUpdateEquipmentType = () => {
  const equipmentType = new EquipmentTypeTypeormRepository()

  return new UpdateEquipmentTypeUseCase(equipmentType)
}
