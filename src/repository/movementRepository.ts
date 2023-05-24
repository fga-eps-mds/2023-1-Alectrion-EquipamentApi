import {
  MoreThanOrEqual,
  LessThanOrEqual,
  And,
  ILike,
  Not,
  IsNull
} from 'typeorm'
import { dataSource } from '../db/config'
import { Movement as MovementEntity } from '../db/entities/movement'
import { Equipment as EquipmentEntity } from '../db/entities/equipment'
import { Unit as UnitEntity } from '../db/entities/unit'

import { Types as MovementTypes, Movement } from '../domain/entities/movement'
import { Status as EquipmentStatus } from '../domain/entities/equipamentEnum/status'

import {
  MovementRepositoryProtocol,
  Query
} from './protocol/movementRepositoryProtocol'

export class MovementRepository implements MovementRepositoryProtocol {
  private readonly movementRepository
  private readonly equipmentRepository
  private readonly unitRepository

  constructor() {
    this.movementRepository = dataSource.getRepository(MovementEntity)
    this.equipmentRepository = dataSource.getRepository(EquipmentEntity)
    this.unitRepository = dataSource.getRepository(UnitEntity)
  }

  async updateEquipments(
    equipments: any[],
    status: EquipmentStatus
  ): Promise<void> {
    for (const equipment of equipments) {
      equipment.situacao = status
      await this.equipmentRepository.save(equipment)
    }
  }

  async create(
    movement: Movement,
    equipmentStatus?: EquipmentStatus
  ): Promise<Movement> {
    const equipments = []
    for (const equipment of movement.equipments) {
      const equipmentEntity = await this.equipmentRepository.findOneBy({
        id: equipment.id
      })
      equipments.push(equipmentEntity)
    }

    const movementEntity = this.movementRepository.create({
      date: movement.date,
      userId: movement.userId,
      type: movement.type,
      description: movement.description,
      inChargeName: movement.inChargeName,
      inChargeRole: movement.inChargeRole,
      chiefName: movement.chiefName,
      chiefRole: movement.chiefRole,
      equipmentSnapshots: JSON.stringify(equipments),
      equipments
    })

    let savedMovementEntity

    switch (movement.type) {
      case MovementTypes.Borrow: {
        const destination = await this.unitRepository.findOneBy({
          id: movement.destination.id
        })

        movementEntity.destination = destination

        savedMovementEntity = await this.movementRepository.save(movementEntity)
        await this.updateEquipments(equipments, EquipmentStatus.ACTIVE_LOAN)
        break
      }

      case MovementTypes.Dismiss: {
        savedMovementEntity = await this.movementRepository.save(movementEntity)
        await this.updateEquipments(equipments, equipmentStatus)
        break
      }

      default: {
        const destination = await this.unitRepository.findOneBy({
          id: movement.destination.id
        })

        movementEntity.destination = destination

        savedMovementEntity = await this.movementRepository.save(movementEntity)
        await this.updateEquipments(equipments, EquipmentStatus.ACTIVE)
        break
      }
    }

    return { ...movement, equipments, id: savedMovementEntity.id }
  }

  async genericFind(query: Query): Promise<Movement[]> {
    const {
      id,
      userId,
      type,
      searchTerm,
      equipmentId,
      destination,
      lowerDate,
      higherDate
    } = query

    const { resultQuantity, page, ...rest } = query

    const defaultConditions = {
      id,
      userId,
      type,
      equipments: equipmentId ? { id: equipmentId } : undefined,
      destination: destination ? { id: destination } : undefined,
      date: lowerDate
        ? And(MoreThanOrEqual(lowerDate), LessThanOrEqual(higherDate))
        : undefined
    }

    const whereConditions = [
      {
        inChargeName: ILike(`%${searchTerm}%`),
        ...defaultConditions
      },
      {
        inChargeRole: ILike(`%${searchTerm}%`),
        ...defaultConditions
      },
      {
        chiefName: ILike(`%${searchTerm}%`),
        ...defaultConditions
      },
      {
        chiefRole: ILike(`%${searchTerm}%`),
        ...defaultConditions
      }
    ]

    const allFieldsUndefined = Object.values(rest).every(
      (value) => typeof value === 'undefined'
    )

    const queryResult = await this.movementRepository.find({
      relations: [
        'equipments',
        'equipments.brand',
        'equipments.unit',
        'destination'
      ],
      order: { date: 'DESC' },
      where: allFieldsUndefined ? undefined : whereConditions,
      take: query.resultQuantity,
      skip: query.page * query.resultQuantity
    })

    return queryResult
  }

  async deleteOne(id: string): Promise<boolean> {
    const movement: Movement[] = await this.genericFind({
      id,
      page: 0,
      resultQuantity: 1
    })

    const snapshots = JSON.parse(movement[0].equipmentSnapshots)
    for (const snapshot of snapshots) {
      await this.equipmentRepository.update(snapshot.id, {
        situacao: snapshot.situacao
      })
    }

    const result = await this.movementRepository.delete(id)

    if (result.affected === 1) return true
    return false
  }
}
