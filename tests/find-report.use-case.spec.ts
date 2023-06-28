import { mock } from 'jest-mock-extended'
import { FindReportTypeOrmRepository } from '../src/db/repositories/report/find-report.typeorm-repository'
import { FindReportUseCase } from '../src/useCases/find-report/find-report.use-case'
import { Equipment } from '../src/db/entities/equipment'
import { Status } from '../src/domain/entities/equipamentEnum/status'
import { Estado } from '../src/domain/entities/equipamentEnum/estado'
import { Type } from '../src/domain/entities/equipamentEnum/type'
import { ReportType } from '../src/domain/entities/reportEnum/report-type'
import { Report } from '../src/domain/entities/report'

const findReportRepositoryMocked = mock<FindReportTypeOrmRepository>()
const findReportUseCase = new FindReportUseCase(findReportRepositoryMocked)

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

describe('Should test FindReportUseCase', () => {
  test('should find report', async () => {
    findReportRepositoryMocked.find.mockResolvedValue([report])

    const result = await findReportUseCase.execute({})

    expect(result.data[0].id).toEqual(report.id)
    expect(result.data[0].authorId).toEqual(report.authorId)
    expect(result.data[0].type).toEqual(report.type)
    expect(result.data[0].createdAt).toEqual(report.createdAt)
    expect(result.data[0].elements).toEqual(report.elements)
    expect(findReportRepositoryMocked.find).toHaveBeenCalled()
  })
})
