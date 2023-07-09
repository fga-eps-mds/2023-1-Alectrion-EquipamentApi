import { FindEquipmentTypeController } from '../../presentation/controller/find-equipment-type.controller'
import { makeFindEquipmentType } from '../useCases/find-equipment-type'

export const makeFindEquipmentTypeController = () => {
  return new FindEquipmentTypeController(makeFindEquipmentType())
}
