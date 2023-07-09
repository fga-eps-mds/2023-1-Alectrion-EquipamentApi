import { DeleteEquipmentTypeController } from '../../presentation/controller/delete-equipment-type.controller'
import { makeDeleteEquipmentType } from '../useCases/delete-equipment-type'

export const makeDeleteEquipmentTypeController = () => {
  return new DeleteEquipmentTypeController(makeDeleteEquipmentType())
}
