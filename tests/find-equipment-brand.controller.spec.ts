import { mock } from 'jest-mock-extended'
import {
  EquipmentBrandFindError,
  FindEquipmentBrandUseCase
} from '../src/useCases/find-equipment-brand/find-equipment-brand.use-case'
import { FindEquipmentBrandController } from '../src/presentation/controller/find-equipment-brand.controller'
import { ok, serverError } from '../src/presentation/helpers'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'

const findEquipmentBrandUseCase = mock<FindEquipmentBrandUseCase>()
const findEquimentBrandController = new FindEquipmentBrandController(
  findEquipmentBrandUseCase
)

const brand: EquipmentBrand = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Should test FindEquipmentBrandController', () => {
  test('should find equipment brand with success', async () => {
    findEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: [brand]
    })

    const response = await findEquimentBrandController.perform({
      search: ''
    })

    expect(response).toEqual(ok(response.data))
    expect(findEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to find', async () => {
    findEquipmentBrandUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentBrandFindError()
    })

    const response = await findEquimentBrandController.perform({
      search: ''
    })

    expect(response).toEqual(serverError(response.data))
    expect(findEquipmentBrandUseCase.execute).toHaveBeenCalled()
  })
})
