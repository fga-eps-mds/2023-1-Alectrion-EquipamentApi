import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'
import { AcquisitionRepository } from '../../repository/acquisitionRepository'
import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'

export const makeEquipment = () => {
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const listOneEquipmentRepository = new ListOneEquipmentTypeormRepository()
  const brandRepository = new EquipmentBrandTypeormRepository()
  const acquisitionRepository = new AcquisitionRepository()
  const typeRepository = new EquipmentTypeTypeormRepository()
  return new UpdateEquipmentUseCase(
    listOneEquipmentRepository,
    updateEquipmentRepository,
    brandRepository,
    acquisitionRepository,
    typeRepository
  )
}
