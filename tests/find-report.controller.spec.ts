import { mock } from 'jest-mock-extended'
import {
  FindReportUseCase,
  ReportNotFoundError
} from '../src/useCases/find-report/find-report.use-case'
import { FindReportController } from '../src/presentation/controller/find-report.controller'
import { Report } from '../src/domain/entities/report'
import { ReportType } from '../src/domain/entities/reportEnum/report-type'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Equipment } from '../src/domain/entities/equipment'
import { notFound, ok } from '../src/presentation/helpers'

const findReportUseCaseMocked = mock<FindReportUseCase>()
const findReportController = new FindReportController(findReportUseCaseMocked)

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

describe('Should test FindReportController', () => {
  test('should find report with success', async () => {
    findReportUseCaseMocked.execute.mockResolvedValue({
      isSuccess: true,
      data: report
    })

    const response = await findReportController.perform({})

    expect(response).toEqual(ok(response.data))
    expect(findReportUseCaseMocked.execute).toHaveBeenCalled()
  })

  test('should return notFound error if usecase returns ReportNOtFoundError', async () => {
    findReportUseCaseMocked.execute.mockResolvedValue({
      isSuccess: false,
      error: new ReportNotFoundError()
    })

    const response = await findReportController.perform({})

    expect(response).toEqual(notFound(response.data))
    expect(findReportUseCaseMocked.execute).toHaveBeenCalled()
  })
})
