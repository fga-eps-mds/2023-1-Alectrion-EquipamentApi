import { EquipmentBrand } from '../../db/entities/equipment-brand'
import { EquipmentBrandRepository } from '../../repository/equipment-brand/equipment-brand.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentBrandFindError extends Error {
  constructor() {
    super('Erro ao buscar marca')
    this.name = 'EquipmentBrandFindError'
  }
}

export type FindDataEquipmentBrand = {
  search: string
}

export class FindEquipmentBrandUseCase
  implements UseCase<FindDataEquipmentBrand, EquipmentBrand[]>
{
  public constructor(
    private readonly brandRepository: EquipmentBrandRepository
  ) {}

  public async execute(
    data: FindDataEquipmentBrand
  ): Promise<UseCaseReponse<EquipmentBrand[]>> {
    return await this.brandRepository
      .find(data.search)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentBrandFindError() }
      })
  }
}
