import { FindReportController } from '../../presentation/controller/find-report.controller'
import { makeFindReportUseCase } from '../useCases/find-report'

export const makeFindReportController = () => {
  return new FindReportController(makeFindReportUseCase())
}
