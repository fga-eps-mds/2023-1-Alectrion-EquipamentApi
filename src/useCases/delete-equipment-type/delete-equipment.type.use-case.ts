import { EquipmentTypeRepository } from '../../repository/equipment-type/equipment-type.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentTypeDeleteError extends Error {
  constructor() {
    super('Erro ao deletar tipo')
    this.name = 'EquipmentTypeDeleteError'
  }
}

export type DeleteDataEquipmentType = {
  id: number
}

export class DeleteEquipmentTypeUseCase
  implements UseCase<DeleteDataEquipmentType, void>
{
  public constructor(
    private readonly typeRepository: EquipmentTypeRepository
  ) {}

  public async execute(
    data: DeleteDataEquipmentType
  ): Promise<UseCaseReponse<void>> {
    return await this.typeRepository
      .delete(data.id)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentTypeDeleteError() }
      })
  }
}
