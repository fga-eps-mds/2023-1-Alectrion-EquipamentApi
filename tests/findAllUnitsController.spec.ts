import { mock } from 'jest-mock-extended'
import { Unit } from '../src/domain/entities/unit'
import { FindAllUnitsController } from '../src/presentation/controller/findAllUnitsController'
import { ok, serverError } from '../src/presentation/helpers'
import { FindAllUnitUseCase } from '../src/useCases/FindUnit/findAllUnitUseCase'

const useCaseMocked = mock<FindAllUnitUseCase>()
const findAllUnitsController = new FindAllUnitsController(useCaseMocked)

const mockedUnits: Unit[] = [
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'any_id',
    localization: 'any_localization',
    name: 'any_name'
  }
]

describe('Should test FindAllUnitsController', () => {
  it('should find units with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: mockedUnits
    })

    const response = await findAllUnitsController.perform()
    expect(response).toEqual(ok(response.data))
    expect(useCaseMocked.execute).toHaveBeenCalled()
    expect(useCaseMocked.execute).toHaveBeenCalledWith()
  })

  it('should return equipment with success', async () => {
    useCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: undefined
    })

    const response = await findAllUnitsController.perform()
    expect(response).toEqual(serverError())
    expect(useCaseMocked.execute).toHaveBeenCalled()
    expect(useCaseMocked.execute).toHaveBeenCalledWith()
  })
})
