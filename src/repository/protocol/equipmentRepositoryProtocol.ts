import { Equipment } from '../../db/entities/equipment'

export interface EquipmentRepositoryProtocol {
  create(equipment: Equipment): Promise<Equipment>
  deleteOne(equipmentId: string): Promise<boolean>
  updateOne(equipmentData: any): Promise<boolean>
  findOne(equipmentId: string): Promise<Equipment | null>
  genericFind(query: any): Promise<Equipment[]>
  findByTippingNumberOrSerialNumber(id: string): Promise<Equipment | null>
  findByTippingNumber(tippingNumber: string): Promise<Equipment | null>
}
