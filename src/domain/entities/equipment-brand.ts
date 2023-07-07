import { Equipment } from './equipment'

export type EquipmentBrand = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  equipment?: Equipment[]
}
