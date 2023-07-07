import { EquipmentType } from '../../db/entities/equipment-type'

export interface EquipmentTypeRepository {
  create(type: EquipmentType): Promise<EquipmentType>
  find(search: string): Promise<EquipmentType[]>
  findByName(name: string): Promise<EquipmentType | undefined>
  update(type: EquipmentType): Promise<void>
  delete(typeId: string): Promise<void>
}
