import { Equipment } from '../../db/entities/equipment'

import { UseCase, UseCaseReponse } from '../protocol/useCase'

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
  }''
}


export class DeleteEquipmentUseCase
  implements UseCase<DeleteEquipmentUseCaseData, boolean>
{
  constructor(
    private readonly equipmentRepository: EquipmentRepositoryProtocol
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

    const timeLimit = 60 * 10 * 1000// 10 minutes

    const result: Equipment[] = await this.equipmentRepository.genericFind({
      id: data.id
    })

    if (result.length < 1)
      return {
        isSuccess: false,
        error: new InvalidEquipmentError()
      }

    const equipment: Equipment = result[0]

    const now = new Date()

    if ((now as any) - (equipment.createdAt as any) > timeLimit)
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