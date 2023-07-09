import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  EquipmentTypeUpdateError,
  UpdateDataEquipmentType,
  UpdateEquipmentTypeUseCase
} from '../src/useCases/update-equipment-type/update-equipment-type.use-case'
import { EquipmentTypeDuplicateError } from '../src/useCases/create-equipment-type/create-equipment-type.use-case'
import { EquipmentType } from '../src/db/entities/equipment-type'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const updateEquipmentBrandUseCase = new UpdateEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

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

  test('should return error for duplicate type', async () => {
    equipmentTypeRepositoryMocked.findByName.mockResolvedValue(type)

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeDuplicateError()
    })
  })

  test('should return error', async () => {
    equipmentTypeRepositoryMocked.findByName.mockResolvedValue(undefined)
    equipmentTypeRepositoryMocked.update.mockRejectedValue(type)

    const result = await updateEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeUpdateError()
    })
  })
})
