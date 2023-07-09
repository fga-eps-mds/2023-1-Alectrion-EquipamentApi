import { mock } from 'jest-mock-extended'
import { EquipmentBrandTypeormRepository } from '../src/db/repositories/equipment-brand/equipment-brand.typeorm-repository'
import {
  UpdateDataEquipmentBrand,
  UpdateEquipmentBrandUseCase
} from '../src/useCases/update-equipment-brnad/update-equipment-brand.use-case'

const equipmentBrandRepositoryMocked = mock<EquipmentBrandTypeormRepository>()
const updateEquipmentBrandUseCase = new UpdateEquipmentBrandUseCase(
  equipmentBrandRepositoryMocked
)

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
})
