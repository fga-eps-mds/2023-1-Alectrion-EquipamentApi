/* eslint-disable */
import { MoreThanOrEqual, ILike } from 'typeorm'
import { dataSource } from '../db/config'
import { Equipment } from '../db/entities/equipment'
import { EquipmentRepositoryProtocol, Query } from './protocol/equipmentRepositoryProtocol'


export class EquipmentRepository implements EquipmentRepositoryProtocol {
  private readonly equipmentRepository
  constructor() {
    this.equipmentRepository = dataSource.getRepository(Equipment)
  }

  async create(equipmentData: Equipment): Promise<Equipment> {
    const equipment = await this.equipmentRepository.save(equipmentData)
    return equipment
  }

  async deleteOne(equipmentId: string): Promise<boolean> {

    const result = await this.equipmentRepository.delete(equipmentId)

    if(result.affected === 1) return true
    return false
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

  async genericFind(query: Query): Promise<Equipment[]> {    
    const {
      type,
      unit,
      situation,
      updatedAt,
      brand,
      search,
      searchTipping,
      take, 
      skip,
    } = query;

    const defaultConditions= {
      type: type,
      situacao: situation,
      unit: unit? {id: unit} : undefined,
      brand: brand ? { id: brand } : undefined,
      updatedAt: updatedAt ? MoreThanOrEqual(updatedAt) : undefined,
    };
  
    let searchConditions;

    if(typeof search !== 'undefined') {
      searchConditions = [
        {
          model: ILike(`%${search}%`),
          ...defaultConditions
        },
        {
          tippingNumber: ILike(`%${search}%`),
          ...defaultConditions
        },
        {
          serialNumber: ILike(`%${search}%`),
          ...defaultConditions
        },
      ]
    } else if(typeof searchTipping !== 'undefined') {
      searchConditions = [
        {
          tippingNumber: ILike(`${searchTipping}%`),
        }
      ]
    } else 
      searchConditions = defaultConditions;
  
  
    const queryResult = await this.equipmentRepository.find({
      relations: {
        brand: true,
        unit: true,
        acquisition: true
      },
      order: { updatedAt: 'DESC' },
      where: searchConditions,
      take: take,
      skip: skip
    });
  
    return queryResult;
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
}
