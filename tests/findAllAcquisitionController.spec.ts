import { mock } from 'jest-mock-extended'
import { Equipment } from '../src/db/entities/equipment'
import { FindAllAcquisitionUseCase } from '../src/useCases/findAcquisition/findAllAcquisitionUseCase'
import { FindAllAcquisitionsController } from '../src/presentation/controller/findAllAcquisitionsController'
import { datatype } from 'faker'
import { ok } from '../src/presentation/helpers'
import { EquipmentAcquisition } from '../src/db/entities/equipment-acquisition'
import { ServerError } from '../src/presentation/errors'

const useCaseMocked = mock<FindAllAcquisitionUseCase>()
const findAllAcquisitionsController = new FindAllAcquisitionsController(useCaseMocked)

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

const mockedAcquisition = {
    id: datatype.string(),
    name: 'compra',
    equipment: mockedEquipmentBase
  } as unknown as EquipmentAcquisition

describe('Should test FindAllAcquisitionsController', () => {
  it('should find equipment with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: [mockedAcquisition]
    })

    const response = await findAllAcquisitionsController.perform()
    expect(response).toEqual(ok(response.data))
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })

  it('should not find acquisition', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: []
    })

    const response = await findAllAcquisitionsController.perform()
    expect(response).toEqual(ok([]))
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })

  it('should return server error', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })
    
    const response = await findAllAcquisitionsController.perform()

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})
