import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { UpdateOrderServiceTypeorm } from '../../db/repositories/order-service/update-order-service-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { CreateHistoryTypeOrmRepository } from '../../db/repositories/history/create-history-typeorm-repository'
import { UpdateOrderServiceUseCase } from '../../useCases/update-order-service/update-order-service'

export const makeOrderService = () => {
  const equipmentRepository = new ListOneEquipmentTypeormRepository()
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const historyRepository = new CreateHistoryTypeOrmRepository()
  const updateOrderServiceRepository = new UpdateOrderServiceTypeorm()
  return new UpdateOrderServiceUseCase(
    equipmentRepository,
    updateEquipmentRepository,
    historyRepository,
    updateOrderServiceRepository
  )
}
