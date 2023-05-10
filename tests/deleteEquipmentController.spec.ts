import  request from 'supertest'

import { MockProxy, mock } from 'jest-mock-extended'
import { NullFields } from '../src/useCases/createEquipment/createEquipmentUseCase'
import { DeleteEquipmentController } from '../src/presentation/controller/deleteEquipmentController'

import { HttpResponse } from '../src/presentation/helpers/http'
import { ServerError, UnauthorizedError } from '../src/presentation/errors'
import {
  DeleteEquipmentUseCase,
  DeleteEquipmentUseCaseData,
  InvalidEquipmentError,
  TimeLimitError
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
      error: new NullFields()
    })

    const response: HttpResponse = await deleteEquipmentController.perform(data)

    expect(response).toHaveProperty('statusCode', 500)
    expect(response).toHaveProperty('data')
    expect(response.data).toBeInstanceOf(NullFields)
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
    expect(response.data).toBeInstanceOf(UnauthorizedError)
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

describe('admin request tests', () => {
  const equipApp = 'http://localhost:4002/equipment'
  const userApp = 'http://localhost:4001/user'

  let equipId = ''

  beforeAll( async () => {
    const equipment = {
      "tippingNumber": "teste9",
      "serialNumber": "12345",
      "type": "CPU",
      "situacao": "Ativo",
      "model": "positivo",
      "description": "",
      "initialUseDate": "ola",
      "acquisitionDate": "2023-01-10",
      "screenSize": "string",
      "invoiceNumber": "12453366",
      "power": "string",
      "screenType": "string",
      "processor": "string",
      "storageType": "HD",
      "storageAmount": "string",
      "brandName": "positivo",
      "acquisitionName": "ola",
      "unitId": null,
      "ram_size": "string",
      "estado": "Novo"
    } 
    
    const response = await request('localhost:4002/equipment')
    .post('/createEquipment')
    .send(equipment)
    
    equipId = response.body.id
  })
  
  
  test('Not admin should not delete equipment', async () => {
    let loginResponse = await request(userApp)
    .post('/login')
    .send({username: 'p21', password: '1234'})
    let notAdminToken = loginResponse.body.token
    
    const response = await request(equipApp)
    .delete('/deleteEquipment')
    .set('Authorization', `Bearer ${notAdminToken}`)
    .send({id: equipId})
    
    expect(response).toHaveProperty('statusCode', 403)
    expect(response.body).toHaveProperty('message', 'Acesso negado. Você não é um administrador.')
  })

  test('Admin should delete equipment', async () => {
    let loginResponse = await request(userApp)
    .post('/login')
    .send({username: 'admin', password: 'admin1234'})
    let adminToken = loginResponse.body.token
    
    const response = await request(equipApp)
    .delete('/deleteEquipment')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({id: equipId})
    
    expect(response.body).toHaveProperty('result')
    expect(response.body.result).toBe(true)
  })
  
})

