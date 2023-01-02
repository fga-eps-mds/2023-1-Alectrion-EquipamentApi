import { dataSource } from '../db/config'
import { Movement as MovementEntity } from '../db/entities/movement'
import { Borrow as BorrowEntity } from '../db/entities/borrow'
import { Dismiss as DismissEntity } from '../db/entities/dismiss'
import { Ownership as OwnershipEntity } from '../db/entities/ownership'
import { Equipment as EquipmentEntity } from '../db/entities/equipment'
import { Unit as UnitEntity } from '../db/entities/unit'

import { Types as MovementTypes, Movement } from '../domain/entities/movement'
import { Borrow } from '../domain/entities/borrow'
import { Dismiss } from '../domain/entities/dismiss'
import { Ownership } from '../domain/entities/ownership'

import { MovementRepositoryProtocol } from './protocol/movementRepositoryProtocol'

export class MovementRepository implements MovementRepositoryProtocol {
    private readonly movementRepository
    private readonly borrowRepository
    private readonly dismissRepository
    private readonly ownershipRepository
    private readonly equipmentRepository
    private readonly unitRepository

    constructor() {
        this.movementRepository = dataSource.getRepository(MovementEntity)
        this.borrowRepository = dataSource.getRepository(BorrowEntity)
        this.dismissRepository = dataSource.getRepository(DismissEntity)
        this.ownershipRepository = dataSource.getRepository(OwnershipEntity)
        this.equipmentRepository = dataSource.getRepository(EquipmentEntity)
        this.unitRepository = dataSource.getRepository(UnitEntity)
    }

    async create(movement: Movement, specializedMovementData: Borrow | Dismiss | Ownership): Promise<Movement> {
        const equipments = movement.equipments.map(async (equipment) => {
            return await this.equipmentRepository.findOneBy({
                id: equipment.id
            })
        })

        const movementEntity = this.movementRepository.create({
            date: movement.date,
            userId: movement.userId,
            equipments
        })

        const savedMovementEntity = await this.movementRepository.save(movementEntity)

        switch(movement.type) {
            case MovementTypes.Borrow: {
                const destination = await this.unitRepository.findOneBy({
                    id: (specializedMovementData as Borrow).destination.id
                })

                const borrowEntity = this.borrowRepository.create({
                    id: savedMovementEntity.id,
                    movement: savedMovementEntity,
                    destination
                })

                await this.borrowRepository.save(borrowEntity)
                break
            }

            case MovementTypes.Dismiss: {
                const dismissEntity = this.dismissRepository.create({
                    id: savedMovementEntity.id,
                    movement: savedMovementEntity,
                    description: (specializedMovementData as Dismiss).description
                })

                await this.dismissRepository.save(dismissEntity)
                break
            }

            default: {
                const destination = await this.unitRepository.findOneBy({
                    id: (specializedMovementData as Ownership).destination.id
                })

                const source = await this.unitRepository.findOneBy({
                    id: (specializedMovementData as Ownership).source.id
                })

                const ownershipEntity = this.borrowRepository.create({
                    id: savedMovementEntity.id,
                    movement: savedMovementEntity,
                    destination,
                    source
                })

                await this.ownershipRepository.save(ownershipEntity)
                break
            }
        }

        return {...movement, id: savedMovementEntity.id}
    }
}
