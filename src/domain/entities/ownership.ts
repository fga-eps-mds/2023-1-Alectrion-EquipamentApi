import { Movement } from './movement'
import { Unit } from './unit'

export type Ownership = {
    id: string

    movement: Movement

    source: Unit

    destination: Unit
}
