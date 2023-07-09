import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  DeleteDataEquipmentBrand,
  DeleteEquipmentBrandUseCase
} from '../src/useCases/delete-equipment-brand/delete-equipment-brand.use-case'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const deleteEquipmentBrandUseCase = new DeleteEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

const useCaseParam: DeleteDataEquipmentBrand = {
  id: 2
}

describe('Should test DeleteEquipmentBrandUSeCase', () => {
  test('should delete brand', async () => {
    equipmentBrandRepositoryMocked.delete.mockResolvedValue()

    const result = await deleteEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })
})
