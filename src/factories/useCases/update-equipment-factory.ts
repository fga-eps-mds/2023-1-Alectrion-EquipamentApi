import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'

export const makeEquipment = () => {
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const listOneEquipmentRepository = new ListOneEquipmentTypeormRepository()
  return new UpdateEquipmentUseCase(
    listOneEquipmentRepository,
    updateEquipmentRepository
  )
}
