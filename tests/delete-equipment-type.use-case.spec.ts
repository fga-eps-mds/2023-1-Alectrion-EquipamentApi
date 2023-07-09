import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  DeleteDataEquipmentType,
  DeleteEquipmentTypeUseCase,
  EquipmentTypeDeleteError
} from '../src/useCases/delete-equipment-type/delete-equipment.type.use-case'
import { EquipmentType } from '../src/db/entities/equipment-type'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const deleteEquipmentTypeUseCase = new DeleteEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: DeleteDataEquipmentType = {
  id: 2
}

describe('Should test CreateEquipmentTypeUSeCase', () => {
  test('should delete type', async () => {
    equipmentTypeRepositoryMocked.delete.mockResolvedValue()

    const result = await deleteEquipmentTypeUseCase.execute(useCaseParam)

    expect(result.isSuccess).toEqual(true)
  })

  test('should return error', async () => {
    equipmentTypeRepositoryMocked.delete.mockRejectedValue(type)

    const result = await deleteEquipmentTypeUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeDeleteError()
    })
  })
})
