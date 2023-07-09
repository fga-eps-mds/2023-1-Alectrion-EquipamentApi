import { CreateEquipmentBrandController } from '../../presentation/controller/create-equipment-brand.controller'
import { makeCreateEquipmentBrand } from '../useCases/create-equipment-brand'

export const makeCreateEquipmentBrandController = () => {
  return new CreateEquipmentBrandController(makeCreateEquipmentBrand())
}
