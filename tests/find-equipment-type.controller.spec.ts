import { mock } from 'jest-mock-extended'
import {
  EquipmentTypeFindError,
  FindEquipmentTypeUseCase
} from '../src/useCases/find-equipment-type/find-equipment-type.use-case'
import { FindEquipmentTypeController } from '../src/presentation/controller/find-equipment-type.controller'
import { EquipmentType } from '../src/db/entities/equipment-type'
import { ok, serverError } from '../src/presentation/helpers'

const findEquipmentTypeUseCase = mock<FindEquipmentTypeUseCase>()
const createEquimentTypeController = new FindEquipmentTypeController(
  findEquipmentTypeUseCase
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Should test FindEquipmentTypeController', () => {
  test('should find equipment type with success', async () => {
    findEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: [type]
    })

    const response = await createEquimentTypeController.perform({
      search: ''
    })

    expect(response).toEqual(ok(response.data))
    expect(findEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to find', async () => {
    findEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentTypeFindError()
    })

    const response = await createEquimentTypeController.perform({
      search: ''
    })

    expect(response).toEqual(serverError(response.data))
    expect(findEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })
})
