import { mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import {
  CreateEquipmentController,
  CreateEquipmentHttpRequest
} from '../src/presentation/controller/createEquipmentController'
import {
  ok,
  badRequest,
  notFound,
  serverError
} from '../src/presentation/helpers'
import {
  CreateEquipmentUseCase,
  NullFields,
  InvalidTippingNumber,
  NotFoundUnit,
  EquipmentTypeError
} from '../src/useCases/createEquipment/createEquipmentUseCase'

const useCaseMocked = mock<CreateEquipmentUseCase>()
const createEquipmentController = new CreateEquipmentController(useCaseMocked)

const mockedEquipment: Equipment = {
  id: 'id',
  acquisitionDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  situacao: Status.ACTIVE,
  estado: Estado.Novo,
  tippingNumber: 'any',
  model: 'DELL G15',
  serialNumber: 'any',
  type: Type.CPU
}

const request: CreateEquipmentHttpRequest = {
  acquisitionDate: new Date(),
  acquisitionName: 'any_acquisition',
  brandName: 'any_brand_name',
  model: 'any_model',
  serialNumber: '12345678',
  situacao: Status.ACTIVE,
  estado: Estado.Novo,
  tippingNumber: '123123123123',
  type: Type.CPU,
  unitId: 'any_unit_id'
}

describe('Should test CreateEquipmentController', () => {
  it('should create equipment with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: mockedEquipment
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(ok(response.data))
    expect(useCaseMocked.execute).toHaveBeenCalledWith(request)
  })

  it('should return bad request if usecase returns NullFields', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      error: new NullFields()
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(badRequest(new NullFields()))
  })

  it('should return bad request if usecase returns InvalidTippingNumber', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      error: new InvalidTippingNumber()
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(badRequest(new InvalidTippingNumber()))
  })

  it('should not found request if usecase returns NotFoundUnit', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      error: new NotFoundUnit()
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(notFound(new NotFoundUnit()))
  })

  it('should return not found if usecase returns EquipmentTypeError', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      error: new EquipmentTypeError()
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(notFound(new EquipmentTypeError()))
  })

  it('should server error if success without data', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true
    })

    const response = await createEquipmentController.perform(request)

    expect(response).toEqual(serverError())
  })
})
