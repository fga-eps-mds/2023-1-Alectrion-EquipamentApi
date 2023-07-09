import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  EquipmentBrandUpdateError,
  UpdateDataEquipmentBrand,
  UpdateEquipmentBrandUseCase
} from '../src/useCases/update-equipment-brnad/update-equipment-brand.use-case'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'
import { EquipmentBrandDuplicateError } from '../src/useCases/create-equipment-brand/create-equipment-brand.use-case'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const updateEquipmentBrandUseCase = new UpdateEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: UpdateDataEquipmentBrand = {
  id: 2,
  name: 'any'
}

describe('Should test UpdateEquipmentBrandUSeCase', () => {
  test('should update brand', async () => {
    equipmentBrandRepositoryMocked.update.mockResolvedValue()

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })

  test('should return error for duplicate brand', async () => {
    equipmentBrandRepositoryMocked.findByName.mockResolvedValue(brand)

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentBrandDuplicateError()
    })
  })

  test('should return error', async () => {
    equipmentBrandRepositoryMocked.findByName.mockResolvedValue(undefined)
    equipmentBrandRepositoryMocked.update.mockRejectedValue(brand)

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentBrandUpdateError()
    })
  })
})
