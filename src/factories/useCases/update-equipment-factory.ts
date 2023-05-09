import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'
import { BrandRepository } from '../../repository/brandRepository'
import { AcquisitionRepository } from '../../repository/acquisitionRepository'

export const makeEquipment = () => {
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const listOneEquipmentRepository = new ListOneEquipmentTypeormRepository()
  const brandRepository = new BrandRepository()
  const acquisitionRepository = new AcquisitionRepository()
  return new UpdateEquipmentUseCase(
    listOneEquipmentRepository,
    updateEquipmentRepository,
    brandRepository,
    acquisitionRepository
  )
}
