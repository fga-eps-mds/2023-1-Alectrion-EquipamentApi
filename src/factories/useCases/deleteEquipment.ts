import { EquipmentRepository } from '../../repository/equipamentRepository'

import { DeleteEquipmentUseCase } from '../../useCases/deleteEquipment/deleteEquipmentUseCase'

export const makeDeleteEquipment = () => {
    const equipmentRepository = new EquipmentRepository()

    return new DeleteEquipmentUseCase(equipmentRepository)
}