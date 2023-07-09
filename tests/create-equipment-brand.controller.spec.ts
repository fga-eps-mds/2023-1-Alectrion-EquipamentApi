import { mock } from 'jest-mock-extended'
import { CreateEquipmentBrandController } from '../src/presentation/controller/create-equipment-brand.controller'
import {
  CreateEquipmentBrandUseCase,
  EquipmentBrandError
} from '../src/useCases/create-equipment-brand/create-equipment-brand.use-case'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'
import { ok, serverError } from '../src/presentation/helpers'

const createEquipmentBrandUseCase = mock<CreateEquipmentBrandUseCase>()
const createEquimentBrandController = new CreateEquipmentBrandController(
  createEquipmentBrandUseCase
)

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Should test CreateEquipmentBrandController', () => {
  test('should create equipment brand with success', async () => {
    createEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: brand
    })

    const response = await createEquimentBrandController.perform({
      name: 'any'
    })

    expect(response).toEqual(ok(response.data))
    expect(createEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to save', async () => {
    createEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentBrandError()
    })

    const response = await createEquimentBrandController.perform({
      name: 'any'
    })

    expect(response).toEqual(serverError(response.data))
    expect(createEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })
})
