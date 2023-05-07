import { UseCase } from '../protocol/useCase'
import { Status } from '../../domain/entities/equipamentEnum/status'
import { History } from '../../domain/entities/history'
import { Equipment } from '../../domain/entities/equipment'
// import { CreateHistoryRepository } from '../../repository/history/create-history-repository'
// import { ListOneUnitRepository } from '../../repository/unit/list-one-unit'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'
import { ListOneEquipmentRepository } from '../../repository/equipment/list-one-equipment'
import { ScreenType } from '../../domain/entities/equipamentEnum/screenType'
// import { Estado } from '../../domain/entities/equipamentEnum/estado'
import { StorageType } from '../../domain/entities/equipamentEnum/storageType'
import { Type } from '../../domain/entities/equipamentEnum/type'
import { EquipmentBrand } from '../../domain/entities/brand'

export type UpdateEquipmentUseCaseData = {
  tippingNumber: string
  id: string
  serialNumber: string
  type: string
  situacao: string
  estado: string
  model: string
  description?: string
  initialUseDate: string
  acquisitionDate: Date
  screenSize?: string
  invoiceNumber: string
  power?: string
  screenType?: string
  processor?: string
  storageType?: string
  storageAmount?: string
  brand: EquipmentBrand
  acquisition: EquipmentBrand
  unitId: string
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
    private readonly updateEquipmentRepository: UpdateEquipmentRepository
  ) {}

  async execute(data: UpdateEquipmentUseCaseData) {
    await this.updateEquipmentRepository.updateEquipment(data.id, {
      tippingNumber: data.tippingNumber,
      serialNumber: data.serialNumber,
      type: data.type as Type,
      situacao: data.situacao.toUpperCase() as Status,
      estado: data.estado,
      model: data.model,
      description: data.description,
      initialUseDate: data.initialUseDate,
      acquisitionDate: data.acquisitionDate,
      invoiceNumber: data.invoiceNumber,
      power: data.power,
      screenType: data.screenType as ScreenType,
      processor: data.processor,
      storageType: data.storageType as StorageType,
      storageAmount: data.storageAmount,
      brand: data.brand as EquipmentBrand,
      acquisition: data.acquisition as EquipmentBrand,
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
  }
}
