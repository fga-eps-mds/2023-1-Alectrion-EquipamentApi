import { UpdateEquimentTypeController } from '../../presentation/controller/update-equipment-type.controller'
import { makeUpdateEquipmentType } from '../useCases/update-equipment-type'

export const makeUpdateEquipmentTypeController = () => {
  return new UpdateEquimentTypeController(makeUpdateEquipmentType())
}
