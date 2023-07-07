import { FindEquimentTypeController } from '../../presentation/controller/find-equipment-type.controller'
import { makeFindEquipmentType } from '../useCases/find-equipment-type'

export const makeFindEquipmentTypeController = () => {
  return new FindEquimentTypeController(makeFindEquipmentType())
}
