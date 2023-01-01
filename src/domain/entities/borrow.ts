import { Movement } from './movement'
import { Unit } from './unit'

export type Borrow = {
    id: string

    movement: Movement

    destination: Unit
}
