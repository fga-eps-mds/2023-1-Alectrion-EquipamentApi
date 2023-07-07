import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import { UpdateEquipmentBrandUseCase } from '../../useCases/update-equipment-brnad/update-equipment-brand.use-case'

export const makeUpdateEquipmentBrand = () => {
  const equipmentBrand = new EquipmentBrandTypeormRepository()

  return new UpdateEquipmentBrandUseCase(equipmentBrand)
}
