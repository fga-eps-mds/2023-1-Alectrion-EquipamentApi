import {
  NotOSFoundError,
  FindOrderService
} from '../src/useCases/find-order-service/find-order-service'
import { MockProxy, mock } from 'jest-mock-extended'
import { Equipment } from '../src/domain/entities/equipment'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Status as OSStatus } from '../src/domain/entities/serviceOrderEnum/status'
import { OrderServiceRepositoryProtocol } from '../src/repository/protocol/orderServiceRepositoryProtocol'

describe('FindOrderService', () => {
  let orderServiceRepositoryProtocol: MockProxy<OrderServiceRepositoryProtocol>
  let findOrderServiceUseCase: FindOrderService

  const equipment: Equipment = {
    id: 'id',
    acquisitionDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: 'any',
    model: 'DELL G15',
    serialNumber: 'any',
    type: { id: 2, name: 'any', createdAt: new Date(), updatedAt: new Date() }
  }

  beforeEach(() => {
    orderServiceRepositoryProtocol = mock()
    findOrderServiceUseCase = new FindOrderService(
      orderServiceRepositoryProtocol
    )
  })

  test('should return order services when they are found', async () => {
    const expectedData = [
      {
        id: 2,
        equipment,
        description: 'any_description',
        seiProcess: '123456789',
        senderPhone: '61992809831',
        senderDocument: '12345678910',
        technicianId: '123456',
        technicianName: 'Pessoa',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: OSStatus.MAINTENANCE,
        authorId: '123456789',
        senderName: 'Pessoa 2'
      }
    ]
    orderServiceRepositoryProtocol.findOrderServiceGeneric.mockResolvedValue(
      expectedData
    )

    const query = { type: 2, unit: 'unit1' }
    const result = await findOrderServiceUseCase.execute(query)

    expect(
      orderServiceRepositoryProtocol.findOrderServiceGeneric
    ).toHaveBeenCalledWith(query)
    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual(expectedData)
  })

  test('should return NotOSFoundError when no order services are found', async () => {
    orderServiceRepositoryProtocol.findOrderServiceGeneric.mockResolvedValue(
      undefined
    )

    const query = { model: 'abc' }
    const result = await findOrderServiceUseCase.execute(query)

    expect(
      orderServiceRepositoryProtocol.findOrderServiceGeneric
    ).toHaveBeenCalledWith(query)
    expect(result.isSuccess).toBe(false)
    expect(result.error).toBeInstanceOf(NotOSFoundError)
  })

  test('should set default values for "take" and "skip" if not provided in query', async () => {
    orderServiceRepositoryProtocol.findOrderServiceGeneric.mockResolvedValue([])

    const query = { model: 'abc' }
    await findOrderServiceUseCase.execute(query)

    expect(
      orderServiceRepositoryProtocol.findOrderServiceGeneric
    ).toHaveBeenCalledWith({
      type: undefined,
      unit: undefined,
      date: undefined,
      brand: undefined,
      search: undefined,
      model: 'abc',
      status: undefined,
      take: 0,
      skip: 0
    })
  })
})
