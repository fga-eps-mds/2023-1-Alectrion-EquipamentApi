import { UseCase } from '../protocol/useCase'
import { Status } from '../../domain/entities/equipamentEnum/status'
import { History } from '../../domain/entities/history'
import { Equipment } from '../../domain/entities/equipment'
import { CreateHistoryRepository } from '../../repository/history/create-history-repository'
import { ListOneUnitRepository } from '../../repository/unit/list-one-unit'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'
import { ListOneEquipmentRepository } from '../../repository/equipment/list-one-equipment'

export type UpdateEquipmentUseCaseData = {
  tippingNumber: string

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

  brand: string

  acquisition: string

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
    private readonly unitRepository: ListOneUnitRepository,
    private readonly historyRepository: CreateHistoryRepository,
    private readonly updateEquipmentRepository: UpdateEquipmentRepository
  ) {}

  async execute(data: UpdateEquipmentUseCaseData) {
    await this.updateEquipmentRepository.updateEquipment(data.tippingNumber, {
      situacao: data.situacao.toUpperCase() as Status,
      model: data.model,
      description: data.description,
      initialUseDate: new Date(data.initialUseDate),
      invoiceNumber: data.invoiceNumber
      // brand: data.brand as EquipmentBrand,
      //  acquisition: data.acquisition
    })
  }
}
