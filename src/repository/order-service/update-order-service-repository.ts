import { Status } from '../../domain/entities/serviceOrderEnum/status'

export type EditPayload = {
  seiProcess?: string
  description?: string
  senderPhone?: string
  technicianId?: string
  technicianName?: string
  withdrawalName?: string
  withdrawalDocument?: string
  finishDate?: Date
  status?: Status
}

export interface UpdateOrderServiceRepository {
  updateOrderSevice(
    orderServiceId: number,
    editPayload: EditPayload
  ): Promise<void>
}
