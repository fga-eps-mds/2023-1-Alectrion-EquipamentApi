import { ILike } from 'typeorm'
import { EquipmentBrandRepository } from '../../../repository/equipment-brand/equipment-brand.repository'
import { dataSource } from '../../config'
import { EquipmentBrand } from '../../entities/equipment-brand'

export class EquipmentBrandTypeormRepository
  implements EquipmentBrandRepository
{
  constructor(
    public readonly brandRepository = dataSource.getRepository(EquipmentBrand)
  ) {}

  public async create(brand: EquipmentBrand): Promise<EquipmentBrand> {
    return await this.brandRepository.save({
      name: brand.name
    })
  }

  public async find(search: string): Promise<EquipmentBrand[]> {
    const condition =
      typeof search !== 'undefined'
        ? [
            {
              name: ILike(`%${search}%`)
            }
          ]
        : undefined

    return await this.brandRepository.find({
      where: condition
    })
  }

  public async findByName(name: string): Promise<EquipmentBrand | undefined> {
    return await this.brandRepository.findOne({
      where: {
        name
      }
    })
  }

  public async update(brand: EquipmentBrand): Promise<void> {
    await this.brandRepository.update(brand.id, {
      name: brand.name
    })
  }

  public async delete(brandId: string): Promise<void> {
    await this.brandRepository.delete(brandId)
  }
}
