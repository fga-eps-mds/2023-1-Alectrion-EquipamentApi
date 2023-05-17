import { UpdateEquipmentController } from '../../presentation/controller/update-equipment-controller'
import { makeEquipment } from '../useCases/update-equipment-factory'

export const makeUpdateEquipmentController = () => {
  return new UpdateEquipmentController(makeEquipment())
}
