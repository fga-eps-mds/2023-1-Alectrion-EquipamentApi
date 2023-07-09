import { DeleteEquipmentBrandController } from '../../presentation/controller/delete-equipment-brand.controller'
import { makeDeleteEquipmentBrand } from '../useCases/delete-equipment-brand'

export const makeDeleteEquipmentBrandController = () => {
  return new DeleteEquipmentBrandController(makeDeleteEquipmentBrand())
}
