import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { CreateOrderServiceTypeOrmRepository } from './../../db/repositories/order-service/create-order-service-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { CreateHistoryTypeOrmRepository } from '../../db/repositories/history/create-history-typeorm-repository'
import { CreateOrderServiceUseCase } from '../../useCases/create-order-service/create-order-service'

export const makeOrderService = () => {
  const equipmentRepository = new ListOneEquipmentTypeormRepository()
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const historyRepository = new CreateHistoryTypeOrmRepository()
  const createOrderServiceRepository = new CreateOrderServiceTypeOrmRepository()
  return new CreateOrderServiceUseCase(
    equipmentRepository,
    updateEquipmentRepository,
    historyRepository,
    createOrderServiceRepository
  )
}
