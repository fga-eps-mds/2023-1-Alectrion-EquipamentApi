import { DeleteEquipmentController } from '../../presentation/controller/deleteEquipmentController'
import { makeDeleteEquipment } from '../useCases/deleteEquipment'

export const makeDeleteEquipmentController = () => {
    return new DeleteEquipmentController(makeDeleteEquipment())
}
