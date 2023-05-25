import { dataSource } from '../db/config'
import { Unit } from '../db/entities/unit'
import { UnitRepositoryProtocol } from './protocol/unitRepositoryProtocol'

export class UnitRepository implements UnitRepositoryProtocol {
  private readonly unitRepository
  constructor() {
    this.unitRepository = dataSource.getRepository(Unit)
  }

  async findAll(): Promise<Unit[] | null> {
    const units = await this.unitRepository.find()
    return units
  }

  async create(unitData: Unit): Promise<Unit> {
    const unit = this.unitRepository.create({
      name: unitData.name,
      localization: unitData.localization
    })
    return await this.unitRepository.save(unit)
  }

  async findOne(unitId: string): Promise<Unit | null> {
    const result = await this.unitRepository.findOneBy({
      id: unitId
    })
    return result
  }
}
