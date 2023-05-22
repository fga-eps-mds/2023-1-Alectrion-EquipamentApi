import { dataSource } from '../db/config'
import { Equipment } from '../db/entities/equipment'
import { EquipmentRepositoryProtocol } from './protocol/equipmentRepositoryProtocol'

export class EquipmentRepository implements EquipmentRepositoryProtocol {
  private readonly equipmentRepository
  constructor() {
    this.equipmentRepository = dataSource.getRepository(Equipment)
  }

  async create(equipmentData: Equipment): Promise<Equipment> {
    const equipment = await this.equipmentRepository.save(equipmentData)
    return equipment
  }

  updateOne(equipmentData: any): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async findOne(equipmentId: string): Promise<Equipment | null> {
    const equipment = await this.equipmentRepository.findOneBy({
      id: equipmentId
    })
    return equipment
  }

  async genericFind(query: any): Promise<Equipment[]> {
    console.log('Query repository: ', query)
    
    const take = query.take
    const skip = query.skip
    
    delete query.take
    delete query.skip

    const equipments = await this.equipmentRepository.find({
      take: take,
      skip: skip,
      relations: {
        brand: true,
        acquisition: true,
        unit: true
      },
      where: {
        ...query
      }
    })
    return equipments
  }

  async findByTippingNumberOrSerialNumber(
    id: string
  ): Promise<Equipment | null> {
    const equipment = await this.equipmentRepository.findOne({
      relations: {
        brand: true,
        acquisition: true,
        unit: true
      },
      where: [{ tippingNumber: id }, { serialNumber: id }]
    })
    return equipment
  }

  async findByTippingNumber(tippingNumber: string): Promise<Equipment | null> {
    const result = await this.equipmentRepository.findOneBy({
      tippingNumber
    })
    return result
  }
  async deleteOne(id: string): Promise<boolean> {
    const equipament: Equipment[] = await this.genericFind({
      id
    })

    const result = await this.equipmentRepository.delete(id)

    if (result.affected === 1) return true
    return false
  }
}
