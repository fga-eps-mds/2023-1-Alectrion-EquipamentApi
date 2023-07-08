import { NotBrandsFound, FindAllBrandUseCase } from '../src/useCases/findBrand/findAllBrandUseCase';
import { MockProxy, mock } from 'jest-mock-extended'
import { BrandRepository } from '../src/repository/brandRepository'
import { Equipment } from '../src/db/entities/equipment'
import { datatype } from 'faker'

describe('FindOneEquipment', () => {
  let brandRepository: MockProxy<BrandRepository>
  let findAllBrandUseCase: FindAllBrandUseCase

  beforeEach(() => {
    brandRepository = mock()
    findAllBrandUseCase = new FindAllBrandUseCase(
        brandRepository
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

  test('should return brands when found', async () => {
    const expectedData = [{ 
        id: 'abc',
        name: 'samsung',
        equipment: [mockedEquipmentBase]
    }];
    brandRepository.findAll.mockResolvedValue(expectedData);

    const result = await findAllBrandUseCase.execute();

    expect(brandRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(true);
    expect(result.data).toEqual(expectedData);
  });

  test('should return NotBrandsFound when no brand is found', async () => {
    brandRepository.findAll.mockResolvedValue(null);

    const result = await findAllBrandUseCase.execute();

    expect(brandRepository.findAll).toHaveBeenCalled();
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(NotBrandsFound);
  });
});
