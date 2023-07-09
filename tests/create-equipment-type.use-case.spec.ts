import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  CreateDataEquipmentType,
  CreateEquipmentTypeUseCase,
  EquipmentTypeDuplicateError,
  EquipmentTypeError
} from '../src/useCases/create-equipment-type/create-equipment-type.use-case'
import { EquipmentType } from '../src/db/entities/equipment-type'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const createEquipmentBrandUseCase = new CreateEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: CreateDataEquipmentType = {
  name: 'any'
}

describe('Should test CreateEquipmentTypeUSeCase', () => {
  test('should create type', async () => {
    equipmentTypeRepositoryMocked.create.mockResolvedValue(type)

    const result = await createEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.data.id).toEqual(type.id)
    expect(result.data.name).toEqual(type.name)
    expect(result.data.createdAt).toEqual(type.createdAt)
    expect(result.data.updatedAt).toEqual(type.updatedAt)
    expect(equipmentTypeRepositoryMocked.create).toHaveBeenCalled()
  })

  test('should return error for duplicate type', async () => {
    equipmentTypeRepositoryMocked.findByName.mockResolvedValue(type)

    const result = await createEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeDuplicateError()
    })
  })

  test('should return error', async () => {
    equipmentTypeRepositoryMocked.findByName.mockResolvedValue(undefined)
    equipmentTypeRepositoryMocked.create.mockRejectedValue(type)

    const result = await createEquipmentBrandUseCase.execute(useCaseParam)

    expect(result).toEqual({
      isSuccess: false,
      error: new EquipmentTypeError()
    })
  })
})
