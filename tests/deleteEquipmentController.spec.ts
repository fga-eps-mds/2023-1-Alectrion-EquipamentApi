//import  request from 'supertest'

import { MockProxy, mock } from 'jest-mock-extended'
import { DeleteEquipmentController } from '../src/presentation/controller/deleteEquipmentController'

import { HttpResponse } from '../src/presentation/helpers/http'
import { ServerError, UnauthorizedError } from '../src/presentation/errors'
import {
  DeleteEquipmentUseCase,
  DeleteEquipmentUseCaseData,
  InvalidEquipmentError,
  TimeLimitError,
  NullFieldsError
} from '../src/useCases/deleteEquipment/deleteEquipmentUseCase'

describe('Delete equipment controller', () => {
  let deleteEquipmentUseCase: MockProxy<DeleteEquipmentUseCase>
  let deleteEquipmentController: DeleteEquipmentController

  beforeEach(() => {
    deleteEquipmentUseCase = mock()
    deleteEquipmentController = new DeleteEquipmentController(
      deleteEquipmentUseCase
    )
  })

  test('should get a successful response', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteEquipmentUseCase.execute.mockResolvedValue({
      isSuccess: true
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 200)
  })

  test('should get a bad request response', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteEquipmentUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new NullFieldsError()
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 400)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(NullFieldsError)
  })

  test('should get a invalid moviment error response', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteEquipmentUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new InvalidEquipmentError()
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 404)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(InvalidEquipmentError)
  })

  test('should get a time limit error response', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteEquipmentUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new TimeLimitError()
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 401)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(TimeLimitError)
  })

  test('should return server error response', async () => {
    const data: DeleteEquipmentUseCaseData = {
      id: '130265af-6afd-494d-b025-e657db264e56'
    }

    deleteEquipmentUseCase.execute.mockResolvedValue({
      isSuccess: false,
      error: new ServerError()
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(ServerError)
  })
})

