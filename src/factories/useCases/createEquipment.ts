import { EquipmentBrandTypeormRepository } from '../../db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import { EquipmentTypeTypeormRepository } from '../../db/repositories/equipment-type/equipment-type.typeorm-repository'
import { AcquisitionRepository } from '../../repository/acquisitionRepository'
import { EquipmentRepository } from '../../repository/equipamentRepository'
import { UnitRepository } from '../../repository/unitRepository'
import { CreateEquipmentUseCase } from '../../useCases/createEquipment/createEquipmentUseCase'

export const makeCreateEquipment = () => {
  const equipmentRepository = new EquipmentRepository()
  const unitRepository = new UnitRepository()
  const brandRepository = new EquipmentBrandTypeormRepository()
  const acquisitionRepository = new AcquisitionRepository()
  const typeRepository = new EquipmentTypeTypeormRepository()
  return new CreateEquipmentUseCase(
    equipmentRepository,
    unitRepository,
    brandRepository,
    acquisitionRepository,
    typeRepository
  )
}
