import { ILike } from 'typeorm'
import { EquipmentTypeRepository } from '../../../repository/equipment-type/equipment-type.repository'
import { dataSource } from '../../config'
import { EquipmentType } from '../../entities/equipment-type'

export class EquipmentTypeTypeormRepository implements EquipmentTypeRepository {
  constructor(
    public readonly typeRepository = dataSource.getRepository(EquipmentType)
  ) {}

  public async create(type: EquipmentType): Promise<EquipmentType> {
    return await this.typeRepository.save({
      name: type.name
    })
  }

  public async find(search: string): Promise<EquipmentType[]> {
    const condition =
      typeof search !== 'undefined'
        ? [
            {
              name: ILike(`%${search}%`)
            }
          ]
        : undefined

    return await this.typeRepository.find({
      where: condition
    })
  }

  public async findByName(name: string): Promise<EquipmentType | undefined> {
    return await this.typeRepository.findOne({
      where: {
        name
      }
    })
  }

  public async update(type: EquipmentType): Promise<void> {
    await this.typeRepository.update(type.id, {
      name: type.name
    })
  }

  public async delete(typeId: number): Promise<void> {
    await this.typeRepository.delete(typeId)
  }
}
