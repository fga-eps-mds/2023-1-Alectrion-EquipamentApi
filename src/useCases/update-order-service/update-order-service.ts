/* eslint-disable prettier/prettier */
import { Status } from '../../domain/entities/equipamentEnum/status'
import { Status as OSStatus } from '../../domain/entities/serviceOrderEnum/status'
import { History } from '../../domain/entities/history'
import { OrderService } from '../../domain/entities/order-service'
import { UpdateEquipmentRepository } from '../../repository/equipment/update-equipment'
import { CreateHistoryRepository } from '../../repository/history/create-history-repository'
import { ListOneEquipmentRepository } from './../../repository/equipment/list-one-equipment'
import { UseCase } from './../protocol/useCase'
import { UpdateOrderServiceRepository } from '../../repository/order-service/update-order-service-repository'
import {
  EquipmentNotFoundError,
  UpdateOrderServiceError
} from '../create-order-service/errors'

export type UpdateOrderServiceUseCaseData = {
  id: number
  equipmentId: string
  description?: string
  seiProcess?: string
  senderPhone?: string
  senderDocument: string
  technicianId?: string
  technicianName?: string
  withdrawalName?: string
  withdrawalDocument?: string
  finishDate?: string
  status?: string
}

export class UpdateOrderServiceUseCase
  implements UseCase<UpdateOrderServiceUseCaseData, OrderService>
{
  public history: null | History = null

  constructor(
    private readonly equipmentRepository: ListOneEquipmentRepository,
    private readonly updateEquipmentRepository: UpdateEquipmentRepository,
    private readonly historyRepository: CreateHistoryRepository,
    private readonly updateOrderServiceRepository: UpdateOrderServiceRepository,
  ) {}

  async execute(data: UpdateOrderServiceUseCaseData) {
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
      await this.updateOrderServiceRepository.updateOrderSevice(data.id, {
        seiProcess: data.seiProcess,
        description: data.description,
        senderPhone: data.senderPhone,
        senderDocument: data.senderDocument,
        technicianId: data.technicianId,
        technicianName: data.technicianName,
        withdrawalName: data.withdrawalName,
        withdrawalDocument: data.withdrawalDocument,
        finishDate: new Date(data.finishDate),
        status: data.status as OSStatus
        
      })

      if (
        this.handleOSStatus(data.status) === OSStatus.CONCLUDED ||
        this.handleOSStatus(data.status) === OSStatus.CANCELED
      ) {
        await this.updateEquipmentRepository.updateEquipment(equipment.id, {
          situacao: Status.ACTIVE
        })
      } else {
        await this.updateEquipmentRepository.updateEquipment(equipment.id, {
          situacao: Status.MAINTENANCE
        })
      }

      return {
        isSuccess: true
      }
    } else
      return {
        isSuccess: false,
        error: new UpdateOrderServiceError()
      }
  }

  private handleOSStatus(status: string): OSStatus {
    switch (status.toUpperCase()) {
      case 'MAINTENANCE': {
        return OSStatus.MAINTENANCE
      }
      case 'WARRANTY': {
        return OSStatus.WARRANTY
      }
      case 'CONCLUDED': {
        return OSStatus.CONCLUDED
      }
      case 'CANCELED': {
        return OSStatus.CANCELED
      }
    }
  }
}
