import { Equipment } from './equipment'

export type Movement = {
    id: string
    
    date: Date

    userId: string

    equipments: Equipment[]

    type: Number
}
