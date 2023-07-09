import {
  EquipmentNotFoundError,
  FindOneEquipmentUseCase
} from '../src/useCases/findOneEquipment/find-one-equipment-usecase'
import { MockProxy, mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { ListOneEquipmentRepository } from '../src/repository/equipment/list-one-equipment'

describe('FindOneEquipment', () => {
  let listOneEquipmentRepository: MockProxy<ListOneEquipmentRepository>
  let findOneEquipmentUseCase: FindOneEquipmentUseCase

  beforeEach(() => {
    listOneEquipmentRepository = mock()
    findOneEquipmentUseCase = new FindOneEquipmentUseCase(
      listOneEquipmentRepository
    )
  })

  test('should return equipment when found', async () => {
    const expectedData = {
      id: 'id',
      acquisitionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      situacao: Status.ACTIVE,
      estado: Estado.Novo,
      tippingNumber: '12345',
      model: 'DELL G15',
      serialNumber: 'any',
      type: { id: 2, name: 'any', createdAt: new Date(), updatedAt: new Date() }
    }
    listOneEquipmentRepository.findOne.mockResolvedValue(expectedData)

    const query = { tippingNumber: '12345', id: 'id' }
    const result = await findOneEquipmentUseCase.execute(query)

    expect(listOneEquipmentRepository.findOne).toHaveBeenCalledWith(query)
    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual(expectedData)
  })

  test('should return EquipmentNotFoundError when no equipment is found', async () => {
    listOneEquipmentRepository.findOne.mockResolvedValue(null)

    const query = { tippingNumber: '543' }
    const result = await findOneEquipmentUseCase.execute(query)

    expect(listOneEquipmentRepository.findOne).toHaveBeenCalledWith(query)
    expect(result.isSuccess).toBe(false)
    expect(result.error).toBeInstanceOf(EquipmentNotFoundError)
  })
})
