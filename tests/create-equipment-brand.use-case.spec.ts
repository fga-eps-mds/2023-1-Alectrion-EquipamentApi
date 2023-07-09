import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  CreateDataEquipmentBrand,
  CreateEquipmentBrandUseCase
} from '../src/useCases/create-equipment-brand/create-equipment-brand.use-case'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const createEquipmentBrandUseCase = new CreateEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: CreateDataEquipmentBrand = {
  name: 'any'
}

describe('Should test CreateEquipmentBrandUSeCase', () => {
  test('should create brand', async () => {
    equipmentBrandRepositoryMocked.create.mockResolvedValue(brand)

    const result = await createEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.data.id).toEqual(brand.id)
    expect(result.data.name).toEqual(brand.name)
    expect(result.data.createdAt).toEqual(brand.createdAt)
    expect(result.data.updatedAt).toEqual(brand.updatedAt)
    expect(equipmentBrandRepositoryMocked.create).toHaveBeenCalled()
  })
})
