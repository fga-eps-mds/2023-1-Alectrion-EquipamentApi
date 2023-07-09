import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  UpdateDataEquipmentType,
  UpdateEquipmentTypeUseCase
} from '../src/useCases/update-equipment-type/update-equipment-type.use-case'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const updateEquipmentBrandUseCase = new UpdateEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const useCaseParam: UpdateDataEquipmentType = {
  id: 2,
  name: 'any'
}

describe('Should test UpdateEquipmentTypeUSeCase', () => {
  test('should update type', async () => {
    equipmentTypeRepositoryMocked.update.mockResolvedValue()

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })
})
