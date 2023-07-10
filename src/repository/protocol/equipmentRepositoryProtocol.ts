import { Equipment } from '../../db/entities/equipment'

export type Query = {
  userId?: string
  id?: string
  tippingNumber?: string
  serialNumber?: string
  acquisition?: string
  type?: number
  unit?: string
  situation?: string
  updatedAt?: Date
  brand?: number
  search?: string
  model?: string
  searchTipping?: string
  screenSize?: string
  power?: string
  screenType?: string
  processador?: string
  storageType?: string
  ram_size?: string
  storageAmount?: string
  createdAt?: Date
  initialDate?: Date
  finalDate?: Date
  take?: number
  skip?: number
  acquisitionYear?: string
}

export interface EquipmentRepositoryProtocol {
  create(equipment: Equipment): Promise<Equipment>
  updateOne(equipmentData: any): Promise<boolean>
  findOne(equipmentId: string): Promise<Equipment | null>
  genericFind(query: Query): Promise<Equipment[]>
  findByTippingNumberOrSerialNumber(id: string): Promise<Equipment | null>
  findByTippingNumber(tippingNumber: string): Promise<Equipment | null>
  deleteOne(id: string): Promise<boolean>
}
