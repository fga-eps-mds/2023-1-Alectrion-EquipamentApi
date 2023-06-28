import { mock } from 'jest-mock-extended'
import { CreateReportTypeOrmRepository } from '../src/db/repositories/report/create-report.typeorm-repository'
import {
  CreateDataReport,
  CreateReportUseCase
} from '../src/useCases/create-report/create-report.use-case'
import { Equipment } from '../src/db/entities/equipment'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Report } from '../src/domain/entities/report'
import { ReportType } from '../src/domain/entities/reportEnum/report-type'

const createReportRepositoryMocked = mock<CreateReportTypeOrmRepository>()
const createReportUseCase = new CreateReportUseCase(
  createReportRepositoryMocked
)

const equipment: Equipment = {
  id: 'id',
  acquisitionDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  situacao: Status.ACTIVE,
  estado: Estado.Novo,
  tippingNumber: 'any',
  model: 'DELL G15',
  serialNumber: 'any',
  type: Type.CPU
}

const report: Report = {
  id: 2,
  type: ReportType.EQUIPMENT,
  authorId: 'any_id',
  elements: [equipment],
  createdAt: new Date()
}

const useCaseParam: CreateDataReport = {
  type: 'EQUIPMENT',
  authorId: 'any_id',
  elements: [equipment]
}

describe('Should test CreateReportUseCase', () => {
  test('should create report', async () => {
    createReportRepositoryMocked.create.mockResolvedValue(report)

    const response = await createReportUseCase.execute(useCaseParam)

    expect(response.data.id).toEqual(report.id)
    expect(response.data.authorId).toEqual(report.authorId)
    expect(response.data.type).toEqual(report.type)
    expect(response.data.createdAt).toEqual(report.createdAt)
    expect(response.data.elements).toEqual(report.elements)
    expect(createReportRepositoryMocked.create).toHaveBeenCalled()
  })

  /*

  test('should return notFound error if usecase returns ReportError', async () => {
    createReportUSeCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new ReportError()
    })

    const response = await createOrderServiceController.perform(request)

    expect(response).toEqual(serverError(response.data))
    expect(createReportUSeCaseMocked.execute).toHaveBeenCalled()
    expect(createReportUSeCaseMocked.execute).toHaveBeenCalledWith(useCaseParam)
  }) */
})
