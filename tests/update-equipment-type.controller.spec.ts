import { mock } from 'jest-mock-extended'
import { ok, serverError } from '../src/presentation/helpers'
import {
  EquipmentTypeUpdateError,
  UpdateEquipmentTypeUseCase
} from '../src/useCases/update-equipment-type/update-equipment-type.use-case'
import { UpdateEquipmentTypeController } from '../src/presentation/controller/update-equipment-type.controller'

const updateEquipmentTypeUseCase = mock<UpdateEquipmentTypeUseCase>()
const updateEquimentTypeController = new UpdateEquipmentTypeController(
  updateEquipmentTypeUseCase
)

describe('Should test UpdateEquipmentTypeController', () => {
  test('should update equipment type with success', async () => {
    updateEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await updateEquimentTypeController.perform({
      id: 2,
      name: 'any'
    })

    expect(response).toEqual(ok(response.data))
    expect(updateEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to update', async () => {
    updateEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentTypeUpdateError()
    })

    const response = await updateEquimentTypeController.perform({
      id: 2,
      name: 'any'
    })

    expect(response).toEqual(serverError(response.data))
    expect(updateEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })
})
