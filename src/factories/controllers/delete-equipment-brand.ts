import { DeleteEquimentBrandController } from '../../presentation/controller/delete-equipment-brand.controller'
import { makeDeleteEquipmentBrand } from '../useCases/delete-equipment-brand'

export const makeDeleteEquipmentBrandController = () => {
  return new DeleteEquimentBrandController(makeDeleteEquipmentBrand())
}
