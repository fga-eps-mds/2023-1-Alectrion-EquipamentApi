import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  FindDataEquipmentBrand,
  FindEquipmentBrandUseCase
} from '../src/useCases/find-equipment-brand/find-equipment-brand.use-case'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const findEquipmentBrandUseCase = new FindEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: FindDataEquipmentBrand = {
  search: ''
}

describe('Should test FindEquipmentBrandUSeCase', () => {
  test('should find brand', async () => {
    equipmentBrandRepositoryMocked.find.mockResolvedValue([brand])

    const result = await findEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.data[0].id).toEqual(brand.id)
    expect(result.data[0].name).toEqual(brand.name)
    expect(result.data[0].createdAt).toEqual(brand.createdAt)
    expect(result.data[0].updatedAt).toEqual(brand.updatedAt)
    expect(equipmentBrandRepositoryMocked.find).toHaveBeenCalled()
  })
})
