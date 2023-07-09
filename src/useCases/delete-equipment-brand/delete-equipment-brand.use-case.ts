import { EquipmentBrandRepository } from '../../repository/equipment-brand/equipment-brand.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentBrandDeleteError extends Error {
  constructor() {
    super('Erro ao deletar marca')
    this.name = 'EquipmentBrandDeleteError'
  }
}

export type DeleteDataEquipmentBrand = {
  id: number
}

export class DeleteEquipmentBrandUseCase
  implements UseCase<DeleteDataEquipmentBrand, void>
{
  public constructor(
    private readonly brandRepository: EquipmentBrandRepository
  ) {}

  public async execute(
    data: DeleteDataEquipmentBrand
  ): Promise<UseCaseReponse<void>> {
    return await this.brandRepository
      .delete(data.id)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentBrandDeleteError() }
      })
  }
}
