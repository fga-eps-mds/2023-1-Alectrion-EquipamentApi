import { checkAccessToken } from './middlewares/auth-middleware'
import { checkAdminAccessToken } from './middlewares/admin-auth-middleware'
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

const routes = Router()

routes.post(
  '/create-order-service/:equipmentId',
  // checkAccessToken,
  adapt(makeCreateOrderController())
)
routes.get('/find', adapt(makeGetEquipmentController()))
routes.post('/createEquipment', adapt(makeCreateEquipmentController()))
routes.delete(
  '/deleteEquipment',
  checkAdminAccessToken,
  adapt(makeDeleteEquipmentController())
)
routes.get('/getAllUnits', adapt(makeFindAllUnitsController()))
routes.get('/getAllBrands', adapt(makeFindAllBrandsController()))
routes.get('/getAllAcquisitions', adapt(makeFindAllAcquisitionsController()))
routes.get('/listOrderService', adapt(makeFindOrderServiceController()))
routes.get('/listOne', adapt(makeFindOneEquipmentController()))
routes.put('/updateOrderService', adapt(makeUpdateOrderController()))
routes.post('/createMovement', adapt(makeCreateMovementController()))
routes.get('/findMovements', adapt(makeFindMovementsController()))
routes.delete('/deleteMovement', adapt(makeDeleteMovementController()))
routes.put('/updateEquipment', adapt(makeUpdateEquipmentController()))

export default routes
