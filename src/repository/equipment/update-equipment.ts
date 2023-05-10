import { ScreenType } from '../../domain/entities/equipamentEnum/screenType'
import { Status } from '../../domain/entities/equipamentEnum/status'
import { StorageType } from '../../domain/entities/equipamentEnum/storageType'
import { Unit } from '../../domain/entities/unit'
import { Type } from '../../domain/entities/equipamentEnum/type'

export type EditPayload = {
  serialNumber?: string
  type?: Type
  situacao?: Status
  estado?: string
  model?: string
  description?: string
  initialUseDate?: string
  acquisitionDate: Date
  screenSize?: string
  invoiceNumber?: string
  power?: string
  screenType?: ScreenType
  processor?: string
  storageType?: StorageType
  storageAmount?: string
  brandName?: string
  acquisitionName?: string
  ram_size?: string
  unitId: string
  unit?: Unit
}

export interface UpdateEquipmentRepository {
  updateEquipment(equipmentId: string, editPayload: EditPayload): Promise<void>
}
