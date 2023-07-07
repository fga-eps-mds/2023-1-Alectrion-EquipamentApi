import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import { DeleteEquipmentBrandUseCase } from '../../useCases/delete-equipment-brand/delete-equipment-brand.use-case'

export const makeDeleteEquipmentBrand = () => {
  const equipmentBrand = new EquipmentBrandTypeormRepository()

  return new DeleteEquipmentBrandUseCase(equipmentBrand)
}
