import { MockProxy, mock } from 'jest-mock-extended'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { StorageType } from '../src/domain/entities/equipamentEnum/storageType'
import { ScreenType } from '../src/domain/entities/equipamentEnum/screenType'
import { Equipment } from '../src/domain/entities/equipment'
import AcquisitionRepositoryProtocol from '../src/repository/protocol/acquisitionRepositoryProtocol'
import {
  UpdateEquipmentUseCase,
  UpdateEquipmentUseCaseData,
  UpdateEquipmentError
} from '../src/useCases/updateEquipment/updateEquipment'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { ListOneEquipmentRepository } from '../src/repository/equipment/list-one-equipment'
import { UpdateEquipmentRepository } from '../src/repository/equipment/update-equipment'
import { Equipment as EquipmentDb } from '../src/db/entities/equipment'
import { EquipmentBrandRepository } from '../src/repository/equipment-brand/equipment-brand.repository'
import { EquipmentTypeRepository } from '../src/repository/equipment-type/equipment-type.repository'

describe('Test create order use case', () => {
  let equipmentRepository: MockProxy<ListOneEquipmentRepository>
  let brandRepository: MockProxy<EquipmentBrandRepository>
  let acquisitionRepository: MockProxy<AcquisitionRepositoryProtocol>
  let updateEquipmentRepository: MockProxy<UpdateEquipmentRepository>
  let updateEquipmentUseCase: UpdateEquipmentUseCase
  let typeRepository: MockProxy<EquipmentTypeRepository>

  const updateEquipmentInterface: UpdateEquipmentUseCaseData = {
    id: '92b3d93a-b860-4658-b165-ced74a3c72eb',
    situacao: Status.ACTIVE,
    estado: Estado.Novo,
    tippingNumber: 'any',
    model: 'DELL G15',
    serialNumber: 'any',
    type: 'any',
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
    type: { id: 2, name: 'any', createdAt: new Date(), updatedAt: new Date() },
    ram_size: '16',
    storageAmount: '256',
    storageType: 'SSD' as StorageType,
    screenType: ScreenType.LCD,
    screenSize: '3',
    description: '',
    power: 'power',
    processor: 'i7',
    brand: {
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  beforeEach(() => {
    equipmentRepository = mock()
    brandRepository = mock()
    brandRepository = mock<EquipmentBrandRepository>()
    acquisitionRepository = mock()
    updateEquipmentRepository = mock()
    typeRepository = mock()
    updateEquipmentUseCase = new UpdateEquipmentUseCase(
      equipmentRepository,
      updateEquipmentRepository,
      brandRepository,
      acquisitionRepository,
      typeRepository
    )

    brandRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    brandRepository.create.mockResolvedValue({
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
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
    const data = new Date()
    typeRepository.findByName.mockResolvedValue({
      id: 2,
      name: 'Monitor',
      createdAt: data,
      updatedAt: data
    })
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
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    equipmentDB.description = ''
    equipmentDB.type = {
      id: 2,
      name: 'any',
      createdAt: new Date(),
      updatedAt: new Date()
    }
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

    expect(result.isSuccess).toEqual(true)
  })

  describe('UpdateEquipmentError', () => {
    it('should create an instance of UpdateEquipmentError', () => {
      const error = new UpdateEquipmentError()
      expect(error).toBeInstanceOf(UpdateEquipmentError)
      expect(error.message).toBe('Não foi possivel atualizar o equipamento.')
      expect(error.name).toBe('UpdateEquipmentError')
    })
  })

  test('should call brandRepository with correct params', async () => {
    await updateEquipmentUseCase.execute(updateEquipmentInterface)

    expect(brandRepository.findByName).toBeCalledWith(
      updateEquipmentInterface.brandName
    )
  })

  test('should create a new brand', async () => {
    const createdBrand = await acquisitionRepository.create({
      name: equipment.acquisition.name,
      id: equipment.acquisition.id
    })

    const foundBrand = await acquisitionRepository.findOneByName(
      equipment.acquisition.name
    )

    expect(foundBrand).toBeDefined()
    expect(foundBrand.name).toEqual(createdBrand.name)
  })
})
