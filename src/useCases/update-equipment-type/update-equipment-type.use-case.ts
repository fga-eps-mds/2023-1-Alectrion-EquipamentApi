import { EquipmentType } from '../../db/entities/equipment-type'
import { EquipmentTypeRepository } from '../../repository/equipment-type/equipment-type.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentTypeUpdateError extends Error {
  constructor() {
    super('Erro ao atualizar tipo')
    this.name = 'EquipmentTypeUpdateError'
  }
}
export type UpdateDataEquipmentType = {
  id: number
  name: string
}

export class UpdateEquipmentTypeUseCase
  implements UseCase<UpdateDataEquipmentType, void>
{
  public constructor(
    private readonly typeRepository: EquipmentTypeRepository
  ) {}

  public async execute(
    data: UpdateDataEquipmentType
  ): Promise<UseCaseReponse<void>> {
    const brand = new EquipmentType()
    brand.id = data.id
    brand.name = data.name

    return this.typeRepository
      .update(brand)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentTypeUpdateError() }
      })
  }
}
