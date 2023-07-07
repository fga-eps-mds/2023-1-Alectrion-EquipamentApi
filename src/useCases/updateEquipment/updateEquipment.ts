import { UseCase, UseCaseReponse } from '../protocol/useCase'
import { Status } from '../../domain/entities/equipamentEnum/status'
import { History } from '../../domain/entities/history'
import { Equipment } from '../../domain/entities/equipment'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'
import { ListOneEquipmentRepository } from '../../repository/equipment/list-one-equipment'
import { ScreenType } from '../../domain/entities/equipamentEnum/screenType'
import { StorageType } from '../../domain/entities/equipamentEnum/storageType'
import AcquisitionRepositoryProtocol from '../../repository/protocol/acquisitionRepositoryProtocol'
import { EquipmentAcquisition } from '../../db/entities/equipment-acquisition'
import { EquipmentBrand } from '../../db/entities/equipment-brand'
import { EquipmentBrandRepository } from '../../repository/equipment-brand/equipment-brand.repository'
import {
  InvalidEquipmentBrand,
  InvalidEquipmentType
} from '../createEquipment/createEquipmentUseCase'
import { EquipmentTypeRepository } from '../../repository/equipment-type/equipment-type.repository'
import { EquipmentType } from '../../db/entities/equipment-type'

export type UpdateEquipmentUseCaseData = {
  id: string
  tippingNumber?: string
  serialNumber: string
  type: string
  situacao: string
  estado: string
  model: string
  description?: string
  acquisitionDate?: Date
  screenSize?: string
  power?: string
  screenType?: string
  processor?: string
  storageType?: string
  storageAmount?: string
  brandName: string
  acquisitionName: string
  unitId?: string
  ram_size?: string
}

export class UpdateEquipmentError extends Error {
  constructor() {
    super('Não foi possivel atualizar o equipamento.')
    this.name = 'UpdateEquipmentError'
  }
}

export class UpdateEquipmentUseCase
  implements UseCase<UpdateEquipmentUseCaseData, Equipment>
{
  public history: null | History = null

  constructor(
    private readonly equipmentRepository: ListOneEquipmentRepository,
    private readonly updateEquipmentRepository: UpdateEquipmentRepository,
    private readonly brandRepository: EquipmentBrandRepository,
    private readonly acquisitionRepository: AcquisitionRepositoryProtocol,
    private readonly typeRepository: EquipmentTypeRepository
  ) {}

  async execute(
    data: UpdateEquipmentUseCaseData
  ): Promise<UseCaseReponse<Equipment>> {
    const brand = await this.brandRepository.findByName(data.brandName)
    if (!brand) {
      return {
        isSuccess: false,
        error: new InvalidEquipmentBrand()
      }
    }

    let acquisition = await this.acquisitionRepository.findOneByName(
      data.acquisitionName
    )
    if (!acquisition) {
      acquisition = await this.acquisitionRepository.create({
        name: data.acquisitionName,
        id: '',
        equipment: []
      })
    }

    const type = await this.typeRepository.findByName(data.type)
    if (!type) {
      return {
        isSuccess: false,
        error: new InvalidEquipmentType()
      }
    }

    await this.updateEquipmentRepository.updateEquipment(data.id, {
      serialNumber: data.serialNumber,
      tippingNumber: data.tippingNumber,
      type: type as EquipmentType,
      situacao: data.situacao as Status,
      estado: data.estado,
      model: data.model,
      description: data.description,
      acquisitionDate: data.acquisitionDate,
      power: data.power,
      screenType: data.screenType as ScreenType,
      processor: data.processor,
      storageType: data.storageType as StorageType,
      storageAmount: data.storageAmount,
      brand: brand as EquipmentBrand,
      acquisition: acquisition as unknown as EquipmentAcquisition,
      unitId: data.unitId,
      ram_size: data.ram_size
    })

    const equipment = await this.equipmentRepository.listOne(data.id)

    if (equipment === undefined) {
      return {
        isSuccess: false,
        error: new UpdateEquipmentError()
      }
    }

    return {
      isSuccess: true,
      data: equipment as unknown as Equipment
    }
  }
}
