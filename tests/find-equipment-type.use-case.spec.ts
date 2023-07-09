import { mock } from 'jest-mock-extended'
import { EquipmentTypeTypeormRepository } from '../src/db/repositories/equipment-type/equipment-type.typeorm-repository'
import {
  FindDataEquipmentType,
  FindEquipmentTypeUseCase
} from '../src/useCases/find-equipment-type/find-equipment-type.use-case'
import { EquipmentType } from '../src/db/entities/equipment-type'

const equipmentTypeRepositoryMocked = mock<EquipmentTypeTypeormRepository>()
const findEquipmentBrandUseCase = new FindEquipmentTypeUseCase(
  equipmentTypeRepositoryMocked
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

const useCaseParam: FindDataEquipmentType = {
  search: ''
}

describe('Should test CreateEquipmentTypeUSeCase', () => {
  test('should create type', async () => {
    equipmentTypeRepositoryMocked.find.mockResolvedValue([type])

    const result = await findEquipmentBrandUseCase.execute(useCaseParam)

    expect(result.data[0].id).toEqual(type.id)
    expect(result.data[0].name).toEqual(type.name)
    expect(result.data[0].createdAt).toEqual(type.createdAt)
    expect(result.data[0].updatedAt).toEqual(type.updatedAt)
    expect(equipmentTypeRepositoryMocked.find).toHaveBeenCalled()
  })
})
