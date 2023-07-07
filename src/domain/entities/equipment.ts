import { EquipmentBrand } from './equipment-brand'
import { EquipmentAcquisition } from '../../db/entities/equipment-acquisition'
import { ScreenType } from './equipamentEnum/screenType'
import { Status } from './equipamentEnum/status'
import { Estado } from './equipamentEnum/estado'
import { StorageType } from './equipamentEnum/storageType'
import { History } from './history'
import { OrderService } from './order-service'
import { Unit } from './unit'
import { EquipmentType } from './equipment-type'

export type Equipment = {
  id: string

  tippingNumber: string

  serialNumber: string

  type?: EquipmentType

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
