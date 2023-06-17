import { GetEquipmentUseCase } from '../src/useCases/getEquipment/getEquipmentUseCase'
import { mock } from 'jest-mock-extended'
import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'
import { Equipment } from '../src/db/entities/equipment'
import { datatype } from 'faker'

const equipmentRepository = mock<EquipmentRepositoryProtocol>()
const getEquipmentUseCase = new GetEquipmentUseCase(equipmentRepository)

const makeMockedEquipment = (): Equipment => {
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
  return mockedEquipmentBase
}

describe('Should test get equipment', () => {
  it('should find specific equipment with success', async () => {
    const queryRequest = {
      tippingNumber: String(datatype.number())
    }

    const mockedEquipment = Object.assign({}, makeMockedEquipment(), {
      tippingNumber: queryRequest.tippingNumber
    })

    equipmentRepository.findByTippingNumberOrSerialNumber.mockResolvedValue(
      mockedEquipment
    )
    const response = await getEquipmentUseCase.execute(queryRequest)
    expect(response).toEqual({ isSuccess: true, data: [mockedEquipment] })
    expect(equipmentRepository.findByTippingNumberOrSerialNumber).toBeCalled()
    expect(
      equipmentRepository.findByTippingNumberOrSerialNumber
    ).toBeCalledWith(queryRequest.tippingNumber)
  })

  it('should not find  equipment', async () => {
    const queryRequest = {
      tippingNumber: String(datatype.number())
    }
    equipmentRepository.findByTippingNumberOrSerialNumber.mockResolvedValue(
      null
    )
    const response = await getEquipmentUseCase.execute(queryRequest)
    expect(response).toEqual({ isSuccess: true, data: [] })
    expect(equipmentRepository.findByTippingNumberOrSerialNumber).toBeCalled()
    expect(
      equipmentRepository.findByTippingNumberOrSerialNumber
    ).toBeCalledWith(queryRequest.tippingNumber)
  })

  it('should find equipmentswith genetic attributes', async () => {
    const queryRequest = {
      type: 'CPU',
      ram_size: datatype.number().toString(),
      processor: 'i7'
    }

    const mockedEquipments = [
      Object.assign({}, makeMockedEquipment(), { ...queryRequest }),
      Object.assign({}, makeMockedEquipment(), { ...queryRequest })
    ]
    equipmentRepository.genericFind.mockResolvedValue(mockedEquipments)
    const response = await getEquipmentUseCase.execute(queryRequest)

    expect(response).toEqual({ isSuccess: true, data: mockedEquipments })
    expect(equipmentRepository.genericFind).toBeCalled()
    expect(equipmentRepository.genericFind).toBeCalledWith(queryRequest)
  })

  it('should not find equipment with generic attributes', async () => {
    const queryRequest = {
      type: datatype.string(),
      ram_size: datatype.number().toString(),
      processor: datatype.string()
    }
    equipmentRepository.genericFind.mockResolvedValue([])
    const response = await getEquipmentUseCase.execute(queryRequest)
    expect(response).toEqual({ isSuccess: true, data: [] })
    expect(equipmentRepository.genericFind).toBeCalled()
    expect(equipmentRepository.genericFind).toBeCalledWith(queryRequest)
  })
})
