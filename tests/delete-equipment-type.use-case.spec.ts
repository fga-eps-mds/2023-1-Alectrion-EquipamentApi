import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  DeleteDataEquipmentType,
  DeleteEquipmentTypeUseCase
} from '../src/useCases/delete-equipment-type/delete-equipment.type.use-case'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const deleteEquipmentTypeUseCase = new DeleteEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const useCaseParam: DeleteDataEquipmentType = {
  id: 2
}

describe('Should test CreateEquipmentTypeUSeCase', () => {
  test('should delete type', async () => {
    equipmentTypeRepositoryMocked.delete.mockResolvedValue()

    const result = await deleteEquipmentTypeUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })
})
