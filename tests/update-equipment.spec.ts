import { MockProxy, mock } from 'jest-mock-extended'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { StorageType } from '../src/domain/entities/equipamentEnum/storageType'
import { ScreenType } from '../src/domain/entities/equipamentEnum/screenType'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import AcquisitionRepositoryProtocol from '../src/repository/protocol/acquisitionRepositoryProtocol'
import { BrandRepositoryProtocol } from '../src/repository/protocol/brandRepositoryProtocol'
import {
  UpdateEquipmentUseCase,
  UpdateEquipmentUseCaseData,
  UpdateEquipmentError
} from '../src/useCases/updateEquipment/updateEquipment'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { ListOneEquipmentRepository } from '../src/repository/equipment/list-one-equipment'
import { UpdateEquipmentRepository } from '../src/repository/equipment/update-equipment'
import { Equipment as EquipmentDb } from '../src/db/entities/equipment'

describe('Test create order use case', () => {
  let equipmentRepository: MockProxy<ListOneEquipmentRepository>
  let brandRepository: MockProxy<BrandRepositoryProtocol>
  let acquisitionRepository: MockProxy<AcquisitionRepositoryProtocol>
  let updateEquipmentRepository: MockProxy<UpdateEquipmentRepository>
  let updateEquipmentUseCase: UpdateEquipmentUseCase

  const updateEquipmentInterface: UpdateEquipmentUseCaseData = {
    id: '92b3d93a-b860-4658-b165-ced74a3c72eb',
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: 'any',
    model: 'DELL G15',
    serialNumber: 'any',
    type: Type.CPU,
    acquisitionDate: new Date('2023-01-20'),
    unitId: 'any_id',
    acquisitionName: 'any_name',
    brandName: 'brand_name',
    description: '',
    ram_size: '16',
    storageAmount: '512',
    storageType: 'SSD',
    processor: 'i7',
    screenSize: '3',
    power: 'power',
    screenType: ScreenType.LCD
    // createdAt: null,
    // updatedAt: null
  }

  const equipment: Equipment = {
    id: '92b3d93a-b860-4658-b165-ced74a3c72eb',
    acquisition: {
      id: '',
      name: ''
    },
    acquisitionDate: updateEquipmentInterface.acquisitionDate,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20'),
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: updateEquipmentInterface.tippingNumber,
    model: updateEquipmentInterface.model,
    serialNumber: updateEquipmentInterface.serialNumber,
    type: updateEquipmentInterface.type as Type,
    ram_size: '16',
    storageAmount: '256',
    storageType: 'SSD' as StorageType,
    screenType: ScreenType.LCD,
    screenSize: '3',
    description: '',
    power: 'power',
    processor: 'i7',
    brand: {
      id: '',
      name: 'brand'
    }
  }

  beforeEach(() => {
    equipmentRepository = mock()
    brandRepository = mock()
    brandRepository = mock<BrandRepositoryProtocol>()
    acquisitionRepository = mock()
    updateEquipmentRepository = mock()
    updateEquipmentUseCase = new UpdateEquipmentUseCase(
      equipmentRepository,
      updateEquipmentRepository,
      brandRepository,
      acquisitionRepository
    )

    brandRepository.findOneByName.mockResolvedValue({
      id: '',
      name: 'brand'
    })

    brandRepository.create.mockResolvedValue({
      id: '',
      name: 'brand'
    })

    acquisitionRepository.findOneByName.mockResolvedValue({
      id: '',
      name: ''
    })

    acquisitionRepository.create.mockResolvedValue({
      id: '',
      name: ''
    })
  })

  test('should update equipment', async () => {
    equipmentRepository.listOne.mockResolvedValue(equipment)

    const result = await updateEquipmentUseCase.execute(
      updateEquipmentInterface
    )

    const equipmentDB = new EquipmentDb()
    equipmentDB.acquisition = {
      id: '',
      name: ''
    }
    equipmentDB.acquisitionDate = equipment.acquisitionDate
    equipmentDB.brand = {
      id: '',
      name: 'brand'
    }
    equipmentDB.description = ''
    equipmentDB.type = equipment.type
    equipmentDB.processor = equipment.processor
    equipmentDB.storageType = equipment.storageType
    equipmentDB.storageAmount = equipment.storageAmount
    equipmentDB.model = equipment.model
    equipmentDB.ram_size = equipment.ram_size
    equipmentDB.serialNumber = equipment.serialNumber
    equipmentDB.situacao = equipment.situacao
    equipmentDB.estado = equipment.estado
    equipmentDB.tippingNumber = equipment.tippingNumber
    equipmentDB.power = equipment.power
    equipmentDB.screenSize = equipment.screenSize
    equipmentDB.screenType = equipment.screenType
    equipmentDB.id = equipment.id
    equipmentDB.updatedAt = equipment.updatedAt
    equipmentDB.createdAt = equipment.createdAt

    expect(result).toEqual({
      isSuccess: true,
      data: equipmentDB
    })
  })

  describe('UpdateEquipmentError', () => {
    it('should create an instance of UpdateEquipmentError', () => {
      const error = new UpdateEquipmentError()
      expect(error).toBeInstanceOf(UpdateEquipmentError)
      expect(error.message).toBe('Não foi possivel atualizar o equipamento.')
      expect(error.name).toBe('UpdateEquipmentError')
    })
  })

  test('should create a new brand', async () => {
    const createdBrand = await brandRepository.create({
      name: equipment.brand.name
    })

    console.log(createdBrand)

    const foundBrand = await brandRepository.findOneByName(equipment.brand.name)

    // Verificar se a marca encontrada corresponde à marca esperada
    expect(foundBrand).toBeDefined()
    expect(foundBrand.name).toEqual(createdBrand.name)
    // expect(response).toEqual(equipment.brand)
  })

  test('should call brandRepository with correct params', async () => {
    await updateEquipmentUseCase.execute(updateEquipmentInterface)

    expect(brandRepository.findOneByName).toBeCalledWith(
      updateEquipmentInterface.brandName
    )
  })

  test('should create a new brand', async () => {
    const createdBrand = await acquisitionRepository.create({
      name: equipment.acquisition.name,
      id: equipment.acquisition.id
    })

    console.log(createdBrand)

    const foundBrand = await acquisitionRepository.findOneByName(
      equipment.acquisition.name
    )

    expect(foundBrand).toBeDefined()
    expect(foundBrand.name).toEqual(createdBrand.name)
  })
})
