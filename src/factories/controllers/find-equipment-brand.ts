import { FindEquimentBrandController } from '../../presentation/controller/find-equipment-brand.controller'
import { makeFindEquipmentBrand } from '../useCases/find-equipment-brand'

export const makeFindEquipmentBrandController = () => {
  return new FindEquimentBrandController(makeFindEquipmentBrand())
}
