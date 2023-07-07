import { checkAdminAccessToken } from './middlewares/admin-auth-middleware'
import { Router } from 'express'
import { adaptExpressRoute as adapt } from './adapters/express-router'
import { makeCreateOrderController } from './factories/controllers/create-order-service'
import { makeCreateEquipmentController } from './factories/controllers/createEquipment'
import { makeDeleteEquipmentController } from './factories/controllers/deleteEquipment'
import { makeFindAllAcquisitionsController } from './factories/controllers/findAllAcquisitions'
import { makeFindAllUnitsController } from './factories/controllers/findAllUnits'
import { makeGetEquipmentController } from './factories/controllers/getEquipment'
import { makeFindOrderServiceController } from './factories/controllers/find-order-service'
import { makeFindOneEquipmentController } from './factories/controllers/find-one-equipment-controller'
import { makeUpdateOrderController } from './factories/controllers/update-order-service'
import { makeCreateMovementController } from './factories/controllers/createMovement'
import { makeFindMovementsController } from './factories/controllers/findMovements'
import { makeDeleteMovementController } from './factories/controllers/deleteMovement'
import { makeUpdateEquipmentController } from './factories/controllers/update-equipment'
import { makeFindEquipmentBrandController } from './factories/controllers/find-equipment-brand'
import { makeCreateEquipmentBrandController } from './factories/controllers/create-equipment-brand'
import { makeUpdateEquipmentBrandController } from './factories/controllers/update-equiment-brand'
import { makeDeleteEquipmentBrandController } from './factories/controllers/delete-equipment-brand'
import { makeFindEquipmentTypeController } from './factories/controllers/find-equipment-type'
import { makeCreateEquipmentTypeController } from './factories/controllers/create-equipment-type'
import { makeUpdateEquipmentTypeController } from './factories/controllers/update-equipment-type'
import { makeDeleteEquipmentTypeController } from './factories/controllers/delete-equipment-type'

const routes = Router()

routes.post('/create-order-service', adapt(makeCreateOrderController()))
routes.get('/find', adapt(makeGetEquipmentController()))
routes.post('/createEquipment', adapt(makeCreateEquipmentController()))
routes.delete(
  '/deleteEquipment',
  checkAdminAccessToken,
  adapt(makeDeleteEquipmentController())
)
routes.get('/getAllUnits', adapt(makeFindAllUnitsController()))
routes.get('/getAllAcquisitions', adapt(makeFindAllAcquisitionsController()))
routes.get('/listOrderService', adapt(makeFindOrderServiceController()))
routes.get('/listOne', adapt(makeFindOneEquipmentController()))
routes.put('/updateOrderService', adapt(makeUpdateOrderController()))
routes.post('/createMovement', adapt(makeCreateMovementController()))
routes.get('/findMovements', adapt(makeFindMovementsController()))
routes.delete('/deleteMovement', adapt(makeDeleteMovementController()))
routes.put('/updateEquipment', adapt(makeUpdateEquipmentController()))
/* Equipment brands endpoints */
routes.get('/brand', adapt(makeFindEquipmentBrandController()))
routes.post(
  '/brand',
  checkAdminAccessToken,
  adapt(makeCreateEquipmentBrandController())
)
routes.put(
  '/brand',
  checkAdminAccessToken,
  adapt(makeUpdateEquipmentBrandController())
)
routes.delete(
  '/brand',
  checkAdminAccessToken,
  adapt(makeDeleteEquipmentBrandController())
)
/* Equipment types endpoints */
routes.get('/type', adapt(makeFindEquipmentTypeController()))
routes.post(
  '/type',
  checkAdminAccessToken,
  adapt(makeCreateEquipmentTypeController())
)
routes.put(
  '/type',
  checkAdminAccessToken,
  adapt(makeUpdateEquipmentTypeController())
)
routes.delete(
  '/type',
  checkAdminAccessToken,
  adapt(makeDeleteEquipmentTypeController())
)

export default routes
