import { Unit } from '../../domain/entities/unit'

export interface UnitRepositoryProtocol {
  create(unit: Unit): Promise<Unit | undefined>
  findOne(unitId: string): Promise<Unit | null>
  findAll(): Promise<Unit[] | null>
}
