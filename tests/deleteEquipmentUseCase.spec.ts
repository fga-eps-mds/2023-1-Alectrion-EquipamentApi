import { MockProxy, mock } from 'jest-mock-extended'

import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'

import { Equipment as EquipmentDb } from '../src/db/entities/equipment'

import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'

import { CreateMovementUseCase,CreateMovementUseCaseData } from '../src/useCases/createMovement/createMovementUseCase'

import {
  DeleteEquipmentUseCase,
  DeleteEquipmentUseCaseData,
  InvalidEquipmentError,
  TimeLimitError,
  NullFieldsError,
  EquipmentMovedError
} from '../src/useCases/deleteEquipment/deleteEquipmentUseCase'

describe('Delete equipments use case', () => {

  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>

  let deleteEquipmentUseCase: DeleteEquipmentUseCase

  let createMovementUseCase : CreateMovementUseCase
  
  beforeEach(() => {

      equipmentRepository = mock()

      deleteEquipmentUseCase = new DeleteEquipmentUseCase(equipmentRepository)
    })

    test('should get a null fields error', async () => {
      const data: DeleteEquipmentUseCaseData = {
        id: ''
      }
      const result = deleteEquipmentUseCase.execute(data)
      expect((await result).isSuccess).toBe(false)
      expect((await result).error).toBeInstanceOf(NullFieldsError)

    })

    test('should get a invalid equipment error', async () => {
      const mockedResult: EquipmentDb[] = []

      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }
      equipmentRepository.genericFind
        .mockResolvedValueOnce(mockedResult)
        .mockResolvedValueOnce(mockedResult)

      const result = await deleteEquipmentUseCase.execute(data)
      expect(result).toHaveProperty('isSuccess', false)
      expect(result.error).toBeInstanceOf(InvalidEquipmentError)

    })

    test('should get an unsuccessful delete error', async () => {
      const now = Date.now()
      const mockedResult: EquipmentDb = 
      { 
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
        tippingNumber: '123123',
        serialNumber: '123',
        type: Type.Nobreak,
        situacao: Status.ACTIVE,
        estado: Estado.Novo,
        model: 'Xiaomi XT',
        description: '',
        initialUseDate: '2022-12-12',
        acquisitionDate: new Date('2022-12-12'),
        invoiceNumber: '123',
        power: '220',
        createdAt: new Date(now),
        updatedAt: new Date(now)
      }
      

      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }
      equipmentRepository.findOne
        .mockResolvedValueOnce(mockedResult)
        .mockResolvedValueOnce(mockedResult)
      equipmentRepository.deleteOne.mockReturnValueOnce(Promise.resolve(false))

      const result = await deleteEquipmentUseCase.execute(data)
      expect(result).toHaveProperty('isSuccess', false)
      expect(result.error).toBeInstanceOf(Error)
    })

    test('should delete equipment', async () => {
      const now = Date.now()
      const mockedResult: EquipmentDb = 
      {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
        tippingNumber: '123123',
        serialNumber: '123',
        type: Type.Nobreak,
        situacao: Status.ACTIVE,
        estado: Estado.Novo,
        model: 'Xiaomi XT',
        description: '',
        initialUseDate: '2022-12-12',
        acquisitionDate: new Date('2022-12-12'),
        invoiceNumber: '123',
        power: '220',
        createdAt: new Date(now),
        updatedAt: new Date(now)
      }
      

      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }

    equipmentRepository.findOne
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
    equipmentRepository.deleteOne.mockResolvedValueOnce(true)

      const result = await deleteEquipmentUseCase.execute(data)

      expect(result).toHaveProperty('isSuccess', true)
    })

    test('should not delete equipment with a movimentation associated', async () => {
      const now = Date.now()
      const mockedResult: EquipmentDb[] = [
      {
          id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
          tippingNumber: '123123',
          serialNumber: '123',
          type: Type.Nobreak,
          situacao: Status.ACTIVE,
          estado: Estado.Novo,
          model: 'Xiaomi XT',
          description: '',
          initialUseDate: '2022-12-12',
          acquisitionDate: new Date(now),
          invoiceNumber: '123',
          power: '220',
          createdAt: new Date(now),
          updatedAt: new Date(now)
      }
      ]
  
      equipmentRepository.genericFind
      .mockResolvedValueOnce(mockedResult)
      .mockResolvedValueOnce(mockedResult)
      equipmentRepository.deleteOne.mockResolvedValueOnce(true)
  
      const data: DeleteEquipmentUseCaseData = {
          id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
        }
      
      const move: CreateMovementUseCaseData = {
          userid: '7f5a508d-b6d4-4011-9553-d181e75e1b09',
          equipments: ['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'],
          type: 0,
          destination: 'f2cf114d-51f4-4ccc-9c8f-64fd97e6cfb2',
          inchargename: 'José Matheus',
          inchargerole: 'Sargento',
          chiefname: 'Matheus Texeira',
          chiefrole: 'Delegado'
        }
      
      const moveResult = await createMovementUseCase.execute(move)
  
      const result = await deleteEquipmentUseCase.execute(data)
  
      expect(moveResult).toHaveProperty('isSuccess', true)
      expect(moveResult.data).toHaveProperty('equipments',['c266c9d5-4e91-4c2e-9c38-fb8710d7e896'])
      expect(result).toHaveProperty('isSuccess', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toBeInstanceOf(EquipmentMovedError)
  })
  
    test('should not delete equipment after 10 minutes of creation', async () => {
      const now = Date.now()
      const tenMinutes =  60 * 10 * 1000

      const mockedResult: EquipmentDb = 
      {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896',
        tippingNumber: '123123',
        serialNumber: '123',
        type: Type.Nobreak,
        situacao: Status.ACTIVE,
        estado: Estado.Novo,
        model: 'Xiaomi XT',
        description: '',
        initialUseDate: '2022-12-12',
        acquisitionDate: new Date(now - tenMinutes),
        invoiceNumber: '123',
        power: '220',
        createdAt: new Date(now - tenMinutes - 1),
        updatedAt: new Date(now - tenMinutes - 1)
      }
        
      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }

      equipmentRepository.findOne
        .mockResolvedValueOnce(mockedResult)
        .mockResolvedValueOnce(mockedResult)
      equipmentRepository.deleteOne.mockResolvedValueOnce(true)

      const result = await deleteEquipmentUseCase.execute(data)

      expect(result).toHaveProperty('isSuccess', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toBeInstanceOf(TimeLimitError)
    })    
  })  

