import { ListOneEquipmentRepository } from './../../repository/equipment/list-one-equipment'
import { Equipment } from './../../domain/entities/equipment'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class EquipmentNotFoundError extends Error {
  constructor() {
    super('Equipment not found')
    this.name = 'EquipmentNotFoundError'
  }
}

export class FindOneEquipmentUseCase
  implements
    UseCase<
      {
        id?: string
        tippingNumber?: string
      },
      Equipment
    >
{
  constructor(
    private readonly listOneEquipmentRepository: ListOneEquipmentRepository
  ) {}

  async execute(payload: {
    id?: string
    tippingNumber?: string
  }): Promise<UseCaseReponse<Equipment>> {
    const equipment = await this.listOneEquipmentRepository.findOne({
      ...payload
    })
    if (equipment !== null) {
      return {
        isSuccess: true,
        data: equipment
      }
    } else {
      return {
        isSuccess: false,
        error: new EquipmentNotFoundError()
      }
    }
  }
}
