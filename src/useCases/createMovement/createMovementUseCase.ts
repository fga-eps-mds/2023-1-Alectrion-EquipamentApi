import { Equipment } from '../../domain/entities/equipment'
import { Movement, Types } from '../../domain/entities/movement'
import { Status as EquipmentStatus } from '../../domain/entities/equipamentEnum/status'

import { UseCase, UseCaseReponse } from './../protocol/useCase'

import { EquipmentRepositoryProtocol } from '../../repository/protocol/equipmentRepositoryProtocol'
import { UnitRepositoryProtocol } from '../../repository/protocol/unitRepositoryProtocol'
import { MovementRepositoryProtocol } from '../../repository/protocol/movementRepositoryProtocol'
import { UpdateEquipmentUseCase } from '../../useCases/updateEquipment/updateEquipment'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'

export type CreateMovementUseCaseData = {
  userid: string
  equipments: string[]
  type: number
  description?: string
  inchargename: string
  inchargerole: string
  chiefname: string
  chiefrole: string
  destination?: string
  status?: EquipmentStatus
}

export class NullFieldsError extends Error {
  constructor() {
    super('Um ou mais campos obrigatórios possuem valores nulos.')
    this.name = 'NullFieldsError'
  }
}

export class InvalidTypeError extends Error {
  constructor() {
    super('Tipo de movimento inválido.')
    this.name = 'InvalidTypeError'
  }
}

export class InvalidDestinationError extends Error {
  constructor() {
    super('Unidade de destino inválida.')
    this.name = 'InvalidDestinationError'
  }
}

export class InvalidEquipmentError extends Error {
  constructor() {
    super('Um ou mais equipamentos inválidos.')
    this.name = 'InvalidEquipmentError'
  }
}

export class InvalidStatusError extends Error {
  constructor() {
    super('Status para baixa inválido.')
    this.name = 'InvalidStatusError'
  }
}

export class CreateMovementUseCase
  implements UseCase<CreateMovementUseCaseData, Movement>
{
  constructor(
    private readonly equipmentRepository: EquipmentRepositoryProtocol,
    private readonly unitRepository: UnitRepositoryProtocol,
    private readonly movementRepository: MovementRepositoryProtocol,
    private readonly updateEquipmentRepository: UpdateEquipmentRepository
  ) {}

  private areFieldsNull(data: CreateMovementUseCaseData): boolean {
    if (
      data.userid === '' ||
      !data.equipments.length ||
      !(
        data.inchargename &&
        data.inchargerole &&
        data.inchargename.length &&
        data.inchargerole.length
      )
    )
      return true
    return false
  }

  private isTypeInvalid(data: CreateMovementUseCaseData): boolean {
    if (data.type < Types.Borrow || data.type > Types.Ownership) return true
    return false
  }

  private isUnitValid(unit: any): boolean {
    if (!unit) return true
    return false
  }

  private areEquipmentsInvalid(equipments: Equipment[]): boolean {
    if (equipments.includes(null)) return true
    return false
  }

  private isStatusInvalid(data: CreateMovementUseCaseData): boolean {
    return ![
      EquipmentStatus.DOWNGRADED,
      EquipmentStatus.TECHNICAL_RESERVE
    ].includes(data.status)
  }

  async execute(
    data: CreateMovementUseCaseData
  ): Promise<UseCaseReponse<Movement>> {
    if (this.areFieldsNull(data))
      return {
        isSuccess: false,
        error: new NullFieldsError()
      }

    if (this.isTypeInvalid(data))
      return {
        isSuccess: false,
        error: new InvalidTypeError()
      }

    const equipments = []
    for (const equipment of data.equipments)
      equipments.push(await this.equipmentRepository.findOne(equipment))

    if (this.areEquipmentsInvalid(equipments))
      return {
        isSuccess: false,
        error: new InvalidEquipmentError()
      }

    const movement: Movement = {
      id: '-1',
      date: new Date(),
      userId: data.userid,
      equipments,
      type: data.type,
      inChargeName: data.inchargename,
      inChargeRole: data.inchargerole,
      chiefName: data.chiefname,
      chiefRole: data.chiefrole
    }

    let result

    switch (data.type) {
      case Types.Borrow: {
        const destination = await this.unitRepository.findOne(data.destination)

        if (this.isUnitValid(destination))
          return {
            isSuccess: false,
            error: new InvalidDestinationError()
          }

        movement.destination = destination

        result = await this.movementRepository
          .create(movement)
          .then((atualization) => {
            atualization.equipments.map((att) => {
              this.updateEquipmentRepository.updateEquipment(att.id, {
                situacao: EquipmentStatus.ACTIVE_LOAN
              })
            })
          })
        break
      }

      case Types.Dismiss: {
        if (this.isStatusInvalid(data))
          return {
            isSuccess: false,
            error: new InvalidStatusError()
          }

        movement.description = data.description

        result = await this.movementRepository
          .create(movement, data.status)
          .then((atualization) => {
            atualization.equipments.map((att) => {
              this.updateEquipmentRepository.updateEquipment(att.id, {
                situacao: EquipmentStatus.DOWNGRADED
              })
            })
          })
        break
      }

      default: {
        const destination = await this.unitRepository.findOne(data.destination)

        if (this.isUnitValid(destination))
          return {
            isSuccess: false,
            error: new InvalidDestinationError()
          }

        movement.destination = destination

        result = await this.movementRepository
          .create(movement)
          .then((atualization) => {
            atualization.equipments.map((att) => {
              this.updateEquipmentRepository.updateEquipment(att.id, {
                situacao: EquipmentStatus.ACTIVE_LOAN
              })
            })
          })
        break
      }
    }

    return {
      isSuccess: true,
      data: result
    }
  }
}
