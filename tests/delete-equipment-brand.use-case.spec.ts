import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  DeleteDataEquipmentBrand,
  DeleteEquipmentBrandUseCase,
  EquipmentBrandDeleteError
} from '../src/useCases/delete-equipment-brand/delete-equipment-brand.use-case'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const deleteEquipmentBrandUseCase = new DeleteEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

const useCaseParam: DeleteDataEquipmentBrand = {
  id: 2
}

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Should test DeleteEquipmentBrandUSeCase', () => {
  test('should delete brand', async () => {
    equipmentBrandRepositoryMocked.delete.mockResolvedValue()

    const result = await deleteEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })

  test('should return error', async () => {
    equipmentBrandRepositoryMocked.delete.mockRejectedValue(brand)

    const result = await deleteEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentBrandDeleteError()
    })
  })
})
