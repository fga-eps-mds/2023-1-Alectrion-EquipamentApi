import { Equipment } from '../../db/entities/equipment'
import { EquipmentRepositoryProtocol } from '../../repository/protocol/equipmentRepositoryProtocol'

import { UseCase, UseCaseReponse } from '../protocol/useCase'

export interface GetEquipmentInput {
  userId?: string

  id?: string

  tippingNumber?: string

  serialNumber?: string

  acquision?: string

  type?: string

  situação?: string

  model?: string

  unit?: string

  brand?: string

  initialUseDate?: string

  screenSize?: string

  invoiceNumber?: string

  power?: string

  screenType?: string

  processador?: string

  storageType?: string

  ram_size?: string

  storageAmount?: string

  createdAt?: Date
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
