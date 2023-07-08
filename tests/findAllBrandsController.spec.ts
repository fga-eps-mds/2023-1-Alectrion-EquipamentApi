import { mock } from 'jest-mock-extended'
import { Equipment } from '../src/db/entities/equipment'
import { FindAllBrandUseCase } from '../src/useCases/findBrand/findAllBrandUseCase'
import { FindAllBrandsController } from '../src/presentation/controller/findAllBrandsController'
import { datatype } from 'faker'
import { ok } from '../src/presentation/helpers'
import { EquipmentBrand } from '../src/db/entities/equipment-brand'
import { ServerError } from '../src/presentation/errors'

const useCaseMocked = mock<FindAllBrandUseCase>()
const findAllBrandsController = new FindAllBrandsController(useCaseMocked)

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

const mockedBrand = {
    id: datatype.string(),
    name: 'samsung',
    equipment: mockedEquipmentBase
  } as unknown as EquipmentBrand

describe('Should test FindAllBrandsController', () => {
  it('should find brand with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: [mockedBrand]
    })

    const response = await findAllBrandsController.perform()
    expect(response).toEqual(ok(response.data))
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })

  it('should not find brand', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: []
    })

    const response = await findAllBrandsController.perform()
    expect(response).toEqual(ok([]))
    expect(useCaseMocked.execute).toHaveBeenCalled()
  })

  it('should return server error', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })
    
    const response = await findAllBrandsController.perform()

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})
