import { UpdateEquimentBrandController } from '../../presentation/controller/update-equipment-brand.controller'
import { makeUpdateEquipmentBrand } from '../useCases/update-equipment-brand'

export const makeUpdateEquipmentBrandController = () => {
  return new UpdateEquimentBrandController(makeUpdateEquipmentBrand())
}
