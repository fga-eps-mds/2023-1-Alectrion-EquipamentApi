import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import { CreateEquipmentBrandUseCase } from '../../useCases/create-equipment-brand/create-equipment-brand.use-case'

export const makeCreateEquipmentBrand = () => {
  const equipmentBrand = new EquipmentBrandTypeormRepository()

  return new CreateEquipmentBrandUseCase(equipmentBrand)
}
