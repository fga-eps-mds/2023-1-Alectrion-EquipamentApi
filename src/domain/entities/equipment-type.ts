import { Equipment } from './equipment'

export type EquipmentType = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  equipment?: Equipment[]
}
