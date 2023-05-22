import { Equipment } from '../../db/entities/equipment'

import { UseCase, UseCaseReponse } from '../protocol/useCase'

import { MovementRepositoryProtocol } from '../../repository/protocol/movementRepositoryProtocol'

import { Movement } from '../../domain/entities/movement'

import { EquipmentRepositoryProtocol } from '../../repository/protocol/equipmentRepositoryProtocol'

export type DeleteEquipmentUseCaseData = {
  id: string
}

export class NullFieldsError extends Error {
  constructor() {
    super('Um ou mais campos obrigatórios possuem valores nulos.')
    this.name = 'NullFieldsError'
  }
}

export class InvalidEquipmentError extends Error {
  constructor() {
    super('ID fornecido inválido.')
    this.name = 'InvalidEquipmentError'
  }
}

export class TimeLimitError extends Error {
  constructor() {
    super('Tempo limite para operação excedido.')
    this.name = 'TimeLimitError'
  }
}

export class EquipmentMovedError extends Error {
  constructor() {
    super('Equipamento está em uma movimentação.')
    this.name = 'EquipmentMovedError'
  }
}

export class DeleteEquipmentUseCase
  implements UseCase<DeleteEquipmentUseCaseData, boolean>
{
  constructor(
    private readonly equipmentRepository: EquipmentRepositoryProtocol,
    private readonly movementRepository: MovementRepositoryProtocol
  ) {}

  private areFieldsNull(data: DeleteEquipmentUseCaseData): boolean {
    return data.id === ''
  }

  async execute(
    data: DeleteEquipmentUseCaseData
  ): Promise<UseCaseReponse<undefined>> {
    if (this.areFieldsNull(data))
      return {
        isSuccess: false,
        error: new NullFieldsError()
      }

    const result: Equipment = await this.equipmentRepository.findOne(
      data.id
    )

    if (result == null)
      return {
        isSuccess: false,
        error: new InvalidEquipmentError()
      }

    const movements: Movement[] = await this.movementRepository.genericFind({
      equipmentId: data.id,
      page: 0,
      resultQuantity: 0
    })
      
    if (movements.length > 0)
    return {
      isSuccess: false,
      error: new EquipmentMovedError()
    }

    const equipment: Equipment = result[0]

    const now = new Date()
    const timeLimit = 60 * 10 * 1000// 10 minutes

    if ((now as any) - (equipment.createdAt as any) > timeLimit)

    const now = new Date()

    if ((now as any) - (result.createdAt as any) > timeLimit)
      return {
        isSuccess: false,
        error: new TimeLimitError()
      }

    const wasDeleteSuccessful = await this.equipmentRepository.deleteOne(data.id)

    if (!wasDeleteSuccessful)
      return {
        isSuccess: false,
        error: new Error()
      }

    return {
      isSuccess: true
    }
  }
}