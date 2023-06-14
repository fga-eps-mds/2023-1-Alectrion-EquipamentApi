import { Status } from '../../domain/entities/equipamentEnum/status'
import { Status as OStatus } from '../../domain/entities/serviceOrderEnum/status'
import { History } from '../../domain/entities/history'
import { OrderService } from '../../domain/entities/order-service'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'
import { CreateHistoryRepository } from '../../repository/history/create-history-repository'
import { CreateOrderServiceRepository } from '../../repository/order-service/create-order-service'
import { ListOneUnitRepository } from '../../repository/unit/list-one-unit'
import { ListOneEquipmentRepository } from './../../repository/equipment/list-one-equipment'
import { UseCase } from './../protocol/useCase'
import {
  EquipmentNotFoundError,
  InvalidAuthorError,
  InvalidSenderError,
  CreateOrderServiceError,
  InvalidDateError
} from './errors'

export type CreateOrderServiceUseCaseData = {
  equipmentId: string
  description: string
  authorId: string
  receiverName: string
  authorFunctionalNumber: string
  senderName: string
  senderFunctionalNumber: string
  date: string
  receiverFunctionalNumber: string
  senderPhone: string
}

export class CreateOrderServiceUseCase
  implements UseCase<CreateOrderServiceUseCaseData, OrderService>
{
  public history: null | History = null

  constructor(
    private readonly equipmentRepository: ListOneEquipmentRepository,
    private readonly updateEquipmentRepository: UpdateEquipmentRepository,
    private readonly unitRepository: ListOneUnitRepository,
    private readonly historyRepository: CreateHistoryRepository,
    private readonly createOrderServiceRepository: CreateOrderServiceRepository
  ) {}

  async execute(data: CreateOrderServiceUseCaseData) {
    if (!data.authorFunctionalNumber || !data.receiverName) {
      return {
        isSuccess: false,
        error: new InvalidAuthorError()
      }
    }

    if (!data.date || !Date.parse(data.date)) {
      return {
        isSuccess: false,
        error: new InvalidDateError()
      }
    }

    if (!data.senderName || !data.senderFunctionalNumber) {
      return {
        isSuccess: false,
        error: new InvalidSenderError()
      }
    }

    const equipment = await this.equipmentRepository.listOne(data.equipmentId)

    if (equipment === undefined) {
      return {
        isSuccess: false,
        error: new EquipmentNotFoundError()
      }
    }

    if (!equipment.history) {
      this.history = await this.historyRepository.create({
        equipment,
        equipmentSnapshot: equipment
      })
    } else this.history = equipment.history

    if (this.history !== null) {
      const orderService = await this.createOrderServiceRepository.create({
        authorId: data.authorId,
        receiverName: data.receiverName,
        authorFunctionalNumber: data.authorFunctionalNumber,
        description: data.description,
        equipment,
        history: this.history,
        equipmentSnapshot: equipment,
        senderName: data.senderName,
        senderFunctionalNumber: data.senderFunctionalNumber,
        date: new Date(data.date),
        receiverFunctionalNumber: data.receiverFunctionalNumber,
        status: 'MAINTENANCE' as OStatus,
        technicians: [],
        receiverDate: null,
        senderPhone: data.senderPhone
      })

      await this.updateEquipmentRepository.updateEquipment(equipment.id, {
        situacao: Status.MAINTENANCE
      })

      return {
        isSuccess: true,
        data: orderService
      }
    } else
      return {
        isSuccess: false,
        error: new CreateOrderServiceError()
      }
  }
}
