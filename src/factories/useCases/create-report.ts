import { CreateReportTypeOrmRepository } from '../../db/repositories/report/create-report.typeorm-repository'
import { CreateReportUseCase } from '../../useCases/create-report/create-report.use-case'

export const makeCreateReportUseCase = () => {
  const reportRepository = new CreateReportTypeOrmRepository()
  return new CreateReportUseCase(reportRepository)
}
