import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { CreateEquipmentTypeUseCase } from '../../useCases/create-equipment-type/create-equipment-type.use-case'

export const makeCreateEquipmentType = () => {
  const equipmentType = new EquipmentTypeTypeormRepository()

  return new CreateEquipmentTypeUseCase(equipmentType)
}
