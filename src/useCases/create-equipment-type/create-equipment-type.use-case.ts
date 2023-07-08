import { EquipmentType } from '../../domain/entities/equipment-type'
import { EquipmentType as Type } from '../../db/entities/equipment-type'
import { UseCase, UseCaseReponse } from '../protocol/useCase'
import { EquipmentTypeRepository } from '../../repository/equipment-type/equipment-type.repository'

export class EquipmentTypeError extends Error {
  constructor() {
    super('Erro ao salvar tipo')
    this.name = 'EquipmentTypeError'
  }
}

export class EquipmentTypeDuplicateError extends Error {
  constructor() {
    super('Tipo duplicada')
    this.name = 'EquipmentTypeDuplicateError'
  }
}

export type CreateDataEquipmentType = {
  name: string
}

export class CreateEquipmentTypeUseCase
  implements UseCase<CreateDataEquipmentType, EquipmentType>
{
  public constructor(
    private readonly typeRepository: EquipmentTypeRepository
  ) {}

  public async execute(
    data: CreateDataEquipmentType
  ): Promise<UseCaseReponse<any>> {
    const possibleType = await this.typeRepository.findByName(data.name)
    if (possibleType) {
      return { isSuccess: false, error: new EquipmentTypeDuplicateError() }
    }

    const type = new Type()
    type.name = data.name

    return await this.typeRepository
      .create(type)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentTypeError() }
      })
  }
}
