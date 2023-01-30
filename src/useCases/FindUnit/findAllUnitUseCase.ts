import { Unit } from '../../domain/entities/unit'
import { UnitRepository } from '../../repository/unitRepository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export interface UnitInterface {
  name: string
  localization: string
}

export class NotUnitsFound extends Error {
  constructor() {
    super('Não Encontrada unidades.')
    this.name = 'NotUnitsFound'
  }
}

export class FindAllUnitUseCase implements UseCase<any, Unit[]> {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(): Promise<UseCaseReponse<Unit[]>> {
    const units = await this.unitRepository.findAll()
    if (units !== null) {
      return {
        isSuccess: true,
        data: units
      }
    } else {
      return {
        isSuccess: false,
        error: new NotUnitsFound()
      }
    }
  }
}
