import { MockProxy, mock } from 'jest-mock-extended'

import { NullFieldsError } from '../src/useCases/createMovement/createMovementUseCase'
import { DeleteMovementController } from '../src/presentation/controller/deleteMovementController'

import { HttpResponse } from '../src/presentation/helpers/http'
import { ServerError, UnauthorizedError } from '../src/presentation/errors'
import {
  DeleteMovementUseCase,
  DeleteMovementUseCaseData,
  InvalidMovementError,
  TimeLimitError
} from '../src/useCases/deleteMovement/deleteMovementUseCase'

describe('Delete movement controller', () => {
  let deleteMovementUseCase: MockProxy<DeleteMovementUseCase>
  let deleteMovementController: DeleteMovementController

  beforeEach(() => {
    deleteMovementUseCase = mock()
    deleteMovementController = new DeleteMovementController(
      deleteMovementUseCase
    )
  })

  test('should get a successful response', async () => {
    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteMovementUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response: HttpResponse = await deleteMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 200)
  })

  test('should get a bad request response', async () => {
    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new NullFieldsError()
    })

    const response: HttpResponse = await deleteMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(NullFieldsError)
  })

  test('should get a invalid moviment error response', async () => {
    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidMovementError()
    })

    const response: HttpResponse = await deleteMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 404)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(InvalidMovementError)
  })

  test('should get a time limit error response', async () => {
    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new TimeLimitError()
    })

    const response: HttpResponse = await deleteMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 401)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(TimeLimitError)
  })

  test('should return server error response', async () => {
    const data: DeleteMovementUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteMovementUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })

    const response: HttpResponse = await deleteMovementController.perform(data)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})
