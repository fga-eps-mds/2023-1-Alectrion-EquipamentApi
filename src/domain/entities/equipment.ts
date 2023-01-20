import { EquipmentBrand } from './brand'
import { Dismissed } from './dismissed'
import { ScreenType } from './equipamentEnum/screenType'
import { Situação } from './equipamentEnum/status'
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

  situação: Situação

  model: string

  description?: string

  initialUseDate: string

  acquisitionDate: Date

  screenSize?: string

  invoiceNumber: string

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

  dismisseds?: Dismissed[]

  brand?: EquipmentBrand

  acquisition?: EquipmentBrand

  unit?: Unit
}
