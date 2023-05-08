import { MockProxy, mock } from 'jest-mock-extended'

import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'

import { Equipment as EquipmentDb } from '../src/db/entities/equipment'

import { EquipmentRepositoryProtocol } from '../src/repository/protocol/equipmentRepositoryProtocol'

import {
  DeleteEquipmentUseCase,
  DeleteEquipmentUseCaseData,
  InvalidEquipmentError,
  TimeLimitError,
  NullFieldsError
} from '../src/useCases/deleteEquipment/deleteEquipmentUseCase'

describe('Delete equipments use case', () => {

  let equipmentRepository: MockProxy<EquipmentRepositoryProtocol>

  let deleteEquipmentUseCase: DeleteEquipmentUseCase

    beforeEach(() => {
      equipmentRepository = mock()

      deleteEquipmentUseCase = new DeleteEquipmentUseCase(equipmentRepository)
    })

    test('should delete equipment', async () => {
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
              acquisitionDate: new Date('2022-12-12'),
              invoiceNumber: '123',
              power: '220',
              createdAt: new Date(now),
              updatedAt: new Date(now)
            }
      ]

      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }

      equipmentRepository.genericFind
        .mockResolvedValueOnce(mockedResult)
        .mockResolvedValueOnce(mockedResult)
      equipmentRepository.deleteOne.mockResolvedValueOnce(true)

      const result = await deleteEquipmentUseCase.execute(data)

      expect(result).toHaveProperty('isSuccess', true)
    })

    test('should not delete equipment after 10 minutes of creation', async () => {
      const now = Date.now()
      const tenMinutes =  60 * 10 * 1000

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
          acquisitionDate: new Date(now - tenMinutes),
          invoiceNumber: '123',
          power: '220',
          createdAt: new Date(now - tenMinutes - 1),
          updatedAt: new Date(now - tenMinutes - 1)
        }
      ]
      
      const data: DeleteEquipmentUseCaseData = {
        id: 'c266c9d5-4e91-4c2e-9c38-fb8710d7e896'
      }

      equipmentRepository.genericFind
        .mockResolvedValueOnce(mockedResult)
        .mockResolvedValueOnce(mockedResult)
      equipmentRepository.deleteOne.mockResolvedValueOnce(true)

      const result = await deleteEquipmentUseCase.execute(data)

      expect(result).toHaveProperty('isSuccess', false)
      expect(result).toHaveProperty('error')
      expect(result.error).toBeInstanceOf(TimeLimitError)
    })
  })  

