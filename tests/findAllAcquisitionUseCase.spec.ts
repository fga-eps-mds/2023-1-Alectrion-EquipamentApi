import { NotAcquisitionsFound, FindAllAcquisitionUseCase } from '../src/useCases/findAcquisition/findAllAcquisitionUseCase';
import { MockProxy, mock } from 'jest-mock-extended'
import { AcquisitionRepository } from '../src/repository/acquisitionRepository'
import { Equipment } from '../src/db/entities/equipment'
import { datatype } from 'faker'

describe('FindOneEquipment', () => {
  let acquisitionRepository: MockProxy<AcquisitionRepository>
  let findAllAcquisitionUseCase: FindAllAcquisitionUseCase

  beforeEach(() => {
    acquisitionRepository = mock()
    findAllAcquisitionUseCase = new FindAllAcquisitionUseCase(
        acquisitionRepository
      )
  })

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

  test('should return acquisitions when found', async () => {
    const expectedData = [{ 
        id: 'abc',
        name: 'compra',
        equipment: [mockedEquipmentBase]
    }];
    acquisitionRepository.findAll.mockResolvedValue(expectedData);

    const result = await findAllAcquisitionUseCase.execute();

    expect(acquisitionRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.data).toEqual(expectedData);
  });

  test('should return NotAcquisitionsFound when no acquisition is found', async () => {
    acquisitionRepository.findAll.mockResolvedValue(null);

    const result = await findAllAcquisitionUseCase.execute();

    expect(acquisitionRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(NotAcquisitionsFound);
  });
});
