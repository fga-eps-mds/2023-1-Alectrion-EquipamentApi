import { mock } from 'jest-mock-extended'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Equipment } from '../src/domain/entities/equipment'
import { Report } from '../src/domain/entities/report'
import { ReportType } from '../src/domain/entities/reportEnum/report-type'
import {
  CreateReportController,
  CreateReportHttpRequest
} from '../src/presentation/controller/create-report.controller'
import {
  CreateDataReport,
  CreateReportUseCase,
  ReportError
} from '../src/useCases/create-report/create-report.use-case'
import { ok, serverError } from '../src/presentation/helpers'

const createReportUseCaseMocked = mock<CreateReportUseCase>()
const createReportController = new CreateReportController(
  createReportUseCaseMocked
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

const request: CreateReportHttpRequest = {
  type: 'EQUIPMENT',
  authorId: 'any_id',
  elements: [equipment]
}

const useCaseParam: CreateDataReport = {
  type: request.type,
  authorId: request.authorId,
  elements: request.elements
}

describe('Should test CreateReportController', () => {
  test('should create report with success', async () => {
    createReportUseCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: report
    })

    const response = await createReportController.perform(request)

    expect(response).toEqual(ok(response.data))
    expect(createReportUseCaseMocked.execute).toHaveBeenCalled()
    expect(createReportUseCaseMocked.execute).toHaveBeenCalledWith(useCaseParam)
  })

  test('should return serverError error if usecase returns ReportError', async () => {
    createReportUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new ReportError()
    })

    const response = await createReportController.perform(request)

    expect(response).toEqual(serverError(response.data))
    expect(createReportUseCaseMocked.execute).toHaveBeenCalled()
    expect(createReportUseCaseMocked.execute).toHaveBeenCalledWith(useCaseParam)
  })
})
