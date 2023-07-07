import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import { FindEquipmentBrandUseCase } from '../../useCases/find-equipment-brand/find-equipment-brand.use-case'

export const makeFindEquipmentBrand = () => {
  const equipmentBrand = new EquipmentBrandTypeormRepository()

  return new FindEquipmentBrandUseCase(equipmentBrand)
}
