import { mock } from 'jest-mock-extended'
import {
  DeleteEquipmentBrandUseCase,
  EquipmentBrandDeleteError
} from '../src/useCases/delete-equipment-brand/delete-equipment-brand.use-case'
import { DeleteEquipmentBrandController } from '../src/presentation/controller/delete-equipment-brand.controller'
import { ok, serverError } from '../src/presentation/helpers'

const deleteEquipmentBrandUseCase = mock<DeleteEquipmentBrandUseCase>()
const deleteEquimentBrandController = new DeleteEquipmentBrandController(
  deleteEquipmentBrandUseCase
)

describe('Should test DeleteEquipmentBrandController', () => {
  test('should delete equipment brand with success', async () => {
    deleteEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await deleteEquimentBrandController.perform({
      id: 2
    })

    expect(response).toEqual(ok(response.data))
    expect(deleteEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to delete', async () => {
    deleteEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentBrandDeleteError()
    })

    const response = await deleteEquimentBrandController.perform({
      id: 2
    })

    expect(response).toEqual(serverError(response.data))
    expect(deleteEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })
})
