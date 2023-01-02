import { Equipment } from './equipment'

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

    type: Number
}
