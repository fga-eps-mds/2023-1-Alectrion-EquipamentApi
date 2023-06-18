import { Equipment } from './equipment'
import { Status } from './serviceOrderEnum/status'

export type OrderService = {
  id: number
  equipment: Equipment
  authorId: string
  seiProcess: string
  description: string
  senderName: string
  senderDocument: string
  senderPhone?: string
  technicianId?: string
  technicianName?: string
  withdrawalName?: string
  withdrawalDocument?: string
  finishDate?: Date
  createdAt: Date
  updatedAt: Date
  status: Status
}
