import { mock } from 'jest-mock-extended'
import { UpdateEquipmentBrandController } from '../src/presentation/controller/update-equipment-brand.controller'
import {
  EquipmentBrandUpdateError,
  UpdateEquipmentBrandUseCase
} from '../src/useCases/update-equipment-brnad/update-equipment-brand.use-case'
import { ok, serverError } from '../src/presentation/helpers'

const updateEquipmentBrandUseCase = mock<UpdateEquipmentBrandUseCase>()
const updateEquimentBrandController = new UpdateEquipmentBrandController(
  updateEquipmentBrandUseCase
)

describe('Should test UpdateEquipmentBrandController', () => {
  test('should update equipment brand with success', async () => {
    updateEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await updateEquimentBrandController.perform({
      id: 2,
      name: 'any'
    })

    expect(response).toEqual(ok(response.data))
    expect(updateEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to update', async () => {
    updateEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentBrandUpdateError()
    })

    const response = await updateEquimentBrandController.perform({
      id: 2,
      name: 'any'
    })

    expect(response).toEqual(serverError(response.data))
    expect(updateEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })
})
