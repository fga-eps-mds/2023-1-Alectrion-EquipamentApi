import { UpdateEquipmentTypeorm } from './../../db/repositories/equipment/update-equipment-typeorm-repository'
import { UpdateOrderServiceTypeorm } from '../../db/repositories/order-service/update-order-service-typeorm-repository'
import { ListOneEquipmentTypeormRepository } from '../../db/repositories/equipment/list-one-equipment-typeorm-repository'
import { CreateHistoryTypeOrmRepository } from '../../db/repositories/history/create-history-typeorm-repository'
import { ListOneUnitTypeormRepository } from '../../db/repositories/unit/list-one-unit-typeorm-repository'
import { UpdateOrderServiceUseCase } from '../../useCases/update-order-service/update-order-service'
import { ListOrderServiceRepository } from '../../repository/order-service/list-order-service'

export const makeOrderService = () => {
  const listOneEquipmentRepository = new ListOneEquipmentTypeormRepository()
  const updateEquipmentRepository = new UpdateEquipmentTypeorm()
  const listOneUnitRepository = new ListOneUnitTypeormRepository()
  const createHistoryRepository = new CreateHistoryTypeOrmRepository()
  const updateOrderServiceTypeOrmRepository = new UpdateOrderServiceTypeorm()
  const listOrderServiceRepository = new ListOrderServiceRepository()
  return new UpdateOrderServiceUseCase(
    listOneEquipmentRepository,
    updateEquipmentRepository,
    listOneUnitRepository,
    createHistoryRepository,
    updateOrderServiceTypeOrmRepository,
    listOrderServiceRepository
  )
}
