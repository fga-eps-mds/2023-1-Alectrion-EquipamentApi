import { Equipment } from './equipment'
import { Unit } from './unit'

export enum Types {
  Borrow = 0,
  Dismiss,
  Ownership
}

export type Movement = {
  id: string

  date: Date

  userId: string

  equipments: Equipment[]

  type: number

  inChargeName: string

  inChargeRole: string

  chiefName: string

  chiefRole: string

  equipmentSnapshots?: any

  description?: string

  destination?: Unit
}
