import { CreateEquipmentTypeController } from '../../presentation/controller/create-equipment-type.controller'
import { makeCreateEquipmentType } from '../useCases/create-equipment-type'

export const makeCreateEquipmentTypeController = () => {
  return new CreateEquipmentTypeController(makeCreateEquipmentType())
}
