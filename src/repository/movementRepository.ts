import { MoreThanOrEqual, LessThanOrEqual, And } from 'typeorm'
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
import { Status as EquipmentStatus } from '../domain/entities/equipamentEnum/status'

import { MovementRepositoryProtocol, Query, DismissParameters } from './protocol/movementRepositoryProtocol'

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

    async updateEquipments(equipments: any[], status: EquipmentStatus): Promise<void> {
        for(let equipment of equipments) {
            equipment.status = status
            await this.equipmentRepository.save(equipment)
        }
    }

    async create(movement: Movement, specializedMovementData: Borrow | DismissParameters | Ownership): Promise<Movement> {
        const equipments = []
        for(let equipment of movement.equipments) {
            const equipmentEntity = await this.equipmentRepository.findOneBy({
                id: equipment.id
            })
            equipments.push(equipmentEntity)
        }

        const movementEntity = this.movementRepository.create({
            date: movement.date,
            userId: movement.userId,
            type: movement.type,
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

                await this.updateEquipments(equipments, EquipmentStatus.ACTIVE_LOAN)
                await this.borrowRepository.save(borrowEntity)
                break
            }

            case MovementTypes.Dismiss: {
                const dismissEntity = this.dismissRepository.create({
                    id: savedMovementEntity.id,
                    movement: savedMovementEntity,
                    description: (specializedMovementData as DismissParameters).dismiss.description
                })

                await this.updateEquipments(equipments, (specializedMovementData as DismissParameters).status)
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

                await this.updateEquipments(equipments, EquipmentStatus.ACTIVE)
                await this.ownershipRepository.save(ownershipEntity)
                break
            }
        }

        return {...movement, id: savedMovementEntity.id}
    }

    async genericFind(query: Query): Promise<Movement[]> {
        const queryResult = await this.movementRepository.find({
            relations: {
                equipments: true
            },
            where: {
                id: query.id,
                userId: query.userId,
                type: query.type,
                equipments: query.equipmentId ? {
                    id: query.equipmentId
                } : undefined,
                date: query.lowerDate ? And(MoreThanOrEqual(query.lowerDate), LessThanOrEqual(query.higherDate)) : undefined
            },
            take: query.resultQuantity,
            skip: query.page * query.resultQuantity
        })

        return queryResult
    }
}
