import { checkAdminAccessToken } from './middlewares/admin-auth-middleware'
import { isNotQueryUser } from './middlewares/query-user-authorization-middleware'
import { Router } from 'express'
import { adaptExpressRoute as adapt } from './adapters/express-router'
import { makeCreateOrderController } from './factories/controllers/create-order-service'
import { makeCreateEquipmentController } from './factories/controllers/createEquipment'
import { makeDeleteEquipmentController } from './factories/controllers/deleteEquipment'
import { makeFindAllAcquisitionsController } from './factories/controllers/findAllAcquisitions'
import { makeFindAllBrandsController } from './factories/controllers/findAllBrands'
import { makeFindAllUnitsController } from './factories/controllers/findAllUnits'
import { makeGetEquipmentController } from './factories/controllers/getEquipment'
import { makeFindOrderServiceController } from './factories/controllers/find-order-service'
import { makeFindOneEquipmentController } from './factories/controllers/find-one-equipment-controller'
import { makeUpdateOrderController } from './factories/controllers/update-order-service'
import { makeCreateMovementController } from './factories/controllers/createMovement'
import { makeFindMovementsController } from './factories/controllers/findMovements'
import { makeDeleteMovementController } from './factories/controllers/deleteMovement'
import { makeUpdateEquipmentController } from './factories/controllers/update-equipment'
import { makeCreateReportController } from './factories/controllers/create-report'
import { makeFindReportController } from './factories/controllers/find-report'

const routes = Router()

routes.post(
  '/create-order-service',
  isNotQueryUser,
  adapt(makeCreateOrderController())
)
routes.get('/find', isNotQueryUser, adapt(makeGetEquipmentController()))
routes.post(
  '/createEquipment',
  isNotQueryUser,
  adapt(makeCreateEquipmentController())
)
routes.delete(
  '/deleteEquipment',
  checkAdminAccessToken,
  adapt(makeDeleteEquipmentController())
)
routes.get('/getAllUnits', isNotQueryUser, adapt(makeFindAllUnitsController()))
routes.get(
  '/getAllBrands',
  isNotQueryUser,
  adapt(makeFindAllBrandsController())
)
routes.get(
  '/getAllAcquisitions',
  isNotQueryUser,
  adapt(makeFindAllAcquisitionsController())
)
routes.get(
  '/listOrderService',
  isNotQueryUser,
  adapt(makeFindOrderServiceController())
)
routes.get('/listOne', isNotQueryUser, adapt(makeFindOneEquipmentController()))
routes.put(
  '/updateOrderService',
  isNotQueryUser,
  adapt(makeUpdateOrderController())
)
routes.post(
  '/createMovement',
  isNotQueryUser,
  adapt(makeCreateMovementController())
)
routes.get(
  '/findMovements',
  isNotQueryUser,
  adapt(makeFindMovementsController())
)
routes.delete(
  '/deleteMovement',
  isNotQueryUser,
  adapt(makeDeleteMovementController())
)
routes.put(
  '/updateEquipment',
  isNotQueryUser,
  adapt(makeUpdateEquipmentController())
)
routes.post('/report', adapt(makeCreateReportController()))
routes.get('/report', adapt(makeFindReportController()))

export default routes
