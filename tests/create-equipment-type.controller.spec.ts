import { mock } from 'jest-mock-extended'
import { CreateEquipmentTypeUseCase } from '../src/useCases/create-equipment-type/create-equipment-type.use-case'
import { CreateEquipmentTypeController } from '../src/presentation/controller/create-equipment-type.controller'
import { EquipmentType } from '../src/db/entities/equipment-type'
import { ok, serverError } from '../src/presentation/helpers'
import { EquipmentTypeError } from '../src/useCases/createEquipment/createEquipmentUseCase'

const createEquipmentTypeUseCase = mock<CreateEquipmentTypeUseCase>()
const createEquimentTypeController = new CreateEquipmentTypeController(
  createEquipmentTypeUseCase
)

const type: EquipmentType = {
  id: 2,
  name: 'any',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Should test CreateEquipmentTypeController', () => {
  test('should create equipment type with success', async () => {
    createEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: true,
      data: type
    })

    const response = await createEquimentTypeController.perform({
      name: 'any'
    })

    expect(response).toEqual(ok(response.data))
    expect(createEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })

  test('should return error when try to save', async () => {
    createEquipmentTypeUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new EquipmentTypeError()
    })

    const response = await createEquimentTypeController.perform({
      name: 'any'
    })

    expect(response).toEqual(serverError(response.data))
    expect(createEquipmentTypeUseCase.execute).toHaveBeenCalled()
  })
})
