import { mock } from 'jest-mock-extended'
import { Equipment } from '../src/db/entities/equipment'
import { FindOneEquipmentUseCase } from '../src/useCases/findOneEquipment/find-one-equipment-usecase'
import { FindOneEquipmentController } from '../src/presentation/controller/find-one-equipment-controller'
import { datatype } from 'faker'
import { ok, serverError } from '../src/presentation/helpers'

const useCaseMocked = mock<FindOneEquipmentUseCase>()
const findOneEquipmentController = new FindOneEquipmentController(useCaseMocked)

const mockedEquipmentBase = {
  id: datatype.string(),
  tippingNumber: datatype.string(),
  serialNumber: datatype.string(),
  type: 'CPU',
  status: 'ACTIVE',
  model: datatype.string(),
  description: datatype.string(),
  screenSize: null,
  power: null,
  screenType: null,
  processor: datatype.string(),
  storageType: datatype.string(),
  storageAmount: datatype.number().toString(),
  ram_size: datatype.number().toString(),
  createdAt: datatype.datetime(),
  updatedAt: datatype.datetime()
} as unknown as Equipment

describe('Should test FindOneEquipmentController', () => {
  it('should find equipment with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: mockedEquipmentBase
    })
    const query = { equipmentId: mockedEquipmentBase.id, tippingNumber: mockedEquipmentBase.tippingNumber }
    const response = await findOneEquipmentController.perform(query)
    expect(response).toEqual(ok(response.data))
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })

  it('should not find equipment', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: undefined
    })
    const query = { equipmentId: datatype.string(), tippingNumber: datatype.string() }
    const response = await findOneEquipmentController.perform(query)
    expect(response).toEqual(serverError())
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })
})
