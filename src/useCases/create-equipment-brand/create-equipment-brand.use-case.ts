import { EquipmentBrand } from '../../domain/entities/equipment-brand'
import { EquipmentBrand as Brand } from '../../db/entities/equipment-brand'
import { EquipmentBrandRepository } from '../../repository/equipment-brand/equipment-brand.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentBrandError extends Error {
  constructor() {
    super('Erro ao salvar marca')
    this.name = 'EquipmentBrandError'
  }
}

export class EquipmentBrandDuplicateError extends Error {
  constructor() {
    super('Marca duplicada')
    this.name = 'EquipmentBrandDuplicateError'
  }
}

export type CreateDataEquipmentBrand = {
  name: string
}

export class CreateEquipmentBrandUseCase
  implements UseCase<CreateDataEquipmentBrand, EquipmentBrand>
{
  public constructor(
    private readonly brandRepository: EquipmentBrandRepository
  ) {}

  public async execute(
    data: CreateDataEquipmentBrand
  ): Promise<UseCaseReponse<EquipmentBrand>> {
    this.brandRepository.findByName(data.name).then((it) => {
      if (it !== undefined) {
        return { isSuccess: false, error: new EquipmentBrandDuplicateError() }
      }
    })

    const brand = new Brand()
    brand.name = data.name

    return this.brandRepository
      .create(brand)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new EquipmentBrandError() }
      })
  }
}
