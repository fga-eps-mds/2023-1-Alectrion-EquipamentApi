import { Movement } from '../../domain/entities/movement'

import { UseCase, UseCaseReponse } from './../protocol/useCase'

import {
  MovementRepositoryProtocol,
  Query
} from '../../repository/protocol/movementRepositoryProtocol'
import { Unit } from '../../domain/entities/unit'

export type FindMovementsUseCaseData = {
  id?: string
  destinationId?: string
  userid?: string
  equipmentid?: string
  inChargeName?: string
  type?: number
  lowerDate?: Date
  higherDate?: Date
  page?: number
  resultquantity?: number
  searchTerm?: string
}

export class InvalidDateError extends Error {
  constructor() {
    super('As datas fornecidas são inválidas.')
    this.name = 'InvalidDateError'
  }
}

export class FindMovementsUseCase
  implements UseCase<FindMovementsUseCaseData, Movement[]>
{
  constructor(
    private readonly movementRepository: MovementRepositoryProtocol
  ) {}

  private areDatesInvalid(data: FindMovementsUseCaseData): boolean {
    if (data.lowerDate) {
      if (data.higherDate && data.higherDate < data.lowerDate) {
        return true
      }
      return false
    }
  }

  async execute(
    data: FindMovementsUseCaseData
  ): Promise<UseCaseReponse<Movement[]>> {
    if (this.areDatesInvalid(data))
      return {
        isSuccess: false,
        error: new InvalidDateError()
      }

    const page = data.page ? data.page : 0
    const resultQuantity = data.resultquantity ? data.resultquantity : 50

    const query: Query = {
      id: data.id,
      destination: data.destinationId,
      userId: data.userid,
      equipmentId: data.equipmentid,
      type: data.type,
      inChargeName: data.inChargeName,
      lowerDate: data.lowerDate,
      higherDate: data.higherDate,
      searchTerm: data.searchTerm,
      page,
      resultQuantity
    }

    const result = await this.movementRepository.genericFind(query)

    return {
      isSuccess: true,
      data: result
    }
  }
}
