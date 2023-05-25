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

import { Request, Response } from 'express'
import { sign} from 'jsonwebtoken'
import { checkAdminAccessToken } from '../src/middlewares/admin-auth-middleware'

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

describe('Middleware - checkAdminAccessToken', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: jest.Mock

  beforeEach(() => {
    mockRequest = {
      headers: {}
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockNext = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return 401 if no token is given', () => {
    checkAdminAccessToken(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(401)

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Token não informado',
    })
  })

  test('should authenticate only admin', () => {
    const payload = {userId: "admin", role: "administrador"}
    const secret = "" + process.env.SECRET_JWT
    const options = { expiresIn: 60 }

    const token = sign(payload, secret, options)

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    }

    checkAdminAccessToken(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

  test('should not authenticate non-admin user', () => {
    const payload = {userId: "non-admin", role: "gerente"}
    const secret = "" + process.env.SECRET_JWT
    const options = { expiresIn: 60 }
    
    const token = sign(payload, secret, options)

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    }

    checkAdminAccessToken(mockRequest as Request, mockResponse as Response, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(403)

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Acesso negado. Você não é um administrador.',
    })

    expect(mockNext).not.toHaveBeenCalled()
  })
})
