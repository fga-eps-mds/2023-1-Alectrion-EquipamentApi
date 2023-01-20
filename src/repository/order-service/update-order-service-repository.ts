import { Equipment } from '../../domain/entities/equipment'
import { History } from '../../domain/entities/history'
import { Unit } from '../../domain/entities/unit'
import { Status } from '../../domain/entities/serviceOrderEnum/status'

export type EditPayload = {
  equipment?: Equipment
  history?: History
  equipmentSnapshot?: any
  description?: string
  authorId?: string
  receiverName?: string
  authorFunctionalNumber?: string
  destination?: Unit
  senderName?: string
  senderFunctionalNumber?: string
  date?: Date
  receiverFunctionalNumber?: string
  status?: Status
  technicians?: string[]
  receiverDate?: Date
}

export interface UpdateOrderServiceRepository {
  updateOrderSevice(
    orderServiceId: string,
    editPayload: EditPayload
  ): Promise<void>
}
