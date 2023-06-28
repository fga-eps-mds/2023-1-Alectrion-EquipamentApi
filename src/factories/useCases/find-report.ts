import { FindReportTypeOrmRepository } from '../../db/repositories/report/find-report.typeorm-repository'
import { FindReportUseCase } from '../../useCases/find-report/find-report.use-case'

export const makeFindReportUseCase = () => {
  const reportRepository = new FindReportTypeOrmRepository()
  return new FindReportUseCase(reportRepository)
}
