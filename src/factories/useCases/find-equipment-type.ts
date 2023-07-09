import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { FindEquipmentTypeUseCase } from '../../useCases/find-equipment-type/find-equipment-type.use-case'

export const makeFindEquipmentType = () => {
  const equipmentType = new EquipmentTypeTypeormRepository()

  return new FindEquipmentTypeUseCase(equipmentType)
}
