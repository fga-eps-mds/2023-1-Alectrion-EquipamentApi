import { EquipmentBrand } from './brand'
import { EquipmentAcquisition } from '../../db/entities/equipment-acquisition'
import { ScreenType } from './equipamentEnum/screenType'
import { Status } from './equipamentEnum/status'
import { Estado } from './equipamentEnum/estado'
import { StorageType } from './equipamentEnum/storageType'
import { Type } from './equipamentEnum/type'
import { History } from './history'
import { OrderService } from './order-service'
import { Unit } from './unit'

export type Equipment = {
  id: string

  tippingNumber: string

  serialNumber: string

  type: Type

  estado: Estado

  situacao: Status

  model: string

  description?: string

  acquisitionDate: Date

  screenSize?: string

  power?: string

  screenType?: ScreenType

  processor?: string

  storageType?: StorageType

  storageAmount?: string

  history?: History

  ram_size?: string

  createdAt: Date

  updatedAt: Date

  orderServices?: OrderService[]

  brand?: EquipmentBrand

  acquisition?: EquipmentAcquisition

  unit?: Unit
}
