import { EquipmentBrand } from '../../db/entities/equipment-brand'

export interface EquipmentBrandRepository {
  create(brand: EquipmentBrand): Promise<EquipmentBrand>
  find(search: string): Promise<EquipmentBrand[]>
  findByName(name: string): Promise<EquipmentBrand | undefined>
  update(brand: EquipmentBrand): Promise<void>
  delete(brandId: number): Promise<void>
}
