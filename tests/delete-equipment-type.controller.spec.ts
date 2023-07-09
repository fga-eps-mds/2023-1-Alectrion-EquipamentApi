import { mock } from 'jest-mock-extended'
import { ok, serverError } from '../src/presentation/helpers'
import {
  DeleteEquipmentTypeUseCase,
  EquipmentTypeDeleteError
} from '../src/useCases/delete-equipment-type/delete-equipment.type.use-case'
import { DeleteEquipmentTypeController } from '../src/presentation/controller/delete-equipment-type.controller'

const deleteEquipmentTypeUseCase = mock<DeleteEquipmentTypeUseCase>()
const deleteEquimentTypeController = new DeleteEquipmentTypeController(
  deleteEquipmentTypeUseCase
)

describe('Should test DeleteEquipmentTypeController', () => {
  test('should delete equipment type with success', async () => {
    deleteEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await deleteEquimentTypeController.perform({
      id: 2
    })

    expect(response).toEqual(ok(response.data))
    expect(deleteEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to delete', async () => {
    deleteEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentTypeDeleteError()
    })

    const response = await deleteEquimentTypeController.perform({
      id: 2
    })

    expect(response).toEqual(serverError(response.data))
    expect(deleteEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })
})
