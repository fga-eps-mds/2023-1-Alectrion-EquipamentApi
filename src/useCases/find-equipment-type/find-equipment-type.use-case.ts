import { EquipmentType } from '../../db/entities/equipment-type'
import { EquipmentTypeRepository } from '../../repository/equipment-type/equipment-type.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentTypeFindError extends Error {
  constructor() {
    super('Erro ao buscar tipo')
    this.name = 'EquipmentTypeFindError'
  }
}

export type FindDataEquipmentType = {
  search: string
}

export class FindEquipmentTypeUseCase
  implements UseCase<FindDataEquipmentType, EquipmentType[]>
{
  public constructor(
    private readonly typeRepository: EquipmentTypeRepository
  ) {}

  public async execute(
    data: FindDataEquipmentType
  ): Promise<UseCaseReponse<EquipmentType[]>> {
    return this.typeRepository
      .find(data.search)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentTypeFindError() }
      })
  }
}
