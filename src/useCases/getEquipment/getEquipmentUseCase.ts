import { Equipment } from '../../db/entities/equipment'
import { EquipmentRepositoryProtocol } from '../../repository/protocol/equipmentRepositoryProtocol'

import { UseCase, UseCaseReponse } from '../protocol/useCase'

export interface GetEquipmentInput {
  userId?: string

  id?: string

  tippingNumber?: string

  serialNumber?: string

  acquisition?: string

  type?: string

  situacao?: string

  model?: string

  unit?: string

  brand?: string

  screenSize?: string

  power?: string

  screenType?: string

  processador?: string

  storageType?: string

  ram_size?: string

  storageAmount?: string

  createdAt?: Date

  take?: number

  skip?: number
}

class GetEquipmentUseCase implements UseCase<GetEquipmentInput, Equipment[]> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly equipmentRepository: EquipmentRepositoryProtocol
  ) {}

  async execute(
    query: GetEquipmentInput
  ): Promise<UseCaseReponse<Equipment[]>> {
    if (query.tippingNumber !== undefined || query.serialNumber !== undefined) {
      const id = query.tippingNumber ?? query.serialNumber ?? ''
      const equipment =
        await this.equipmentRepository.findByTippingNumberOrSerialNumber(id)
      if (!equipment) {
        return {
          isSuccess: true,
          data: []
        }
      }
      return {
        isSuccess: true,
        data: [equipment]
      }
    }

    if (query.take === undefined) query.take = 0

    if (query.skip === undefined) query.skip = 0

    const equipaments = await this.equipmentRepository.genericFind(query)

    if (equipaments.length === 0) {
      return {
        isSuccess: true,
        data: []
      }
    }

    return {
      isSuccess: true,
      data: equipaments
    }
  }
}

export { GetEquipmentUseCase }
