import { UpdateOrderServiceController } from '../../presentation/controller/update-order-service-controller'
import { makeOrderService } from '../useCases/update-order-service-factory'

export const makeUpdateOrderController = () => {
  return new UpdateOrderServiceController(makeOrderService())
}
