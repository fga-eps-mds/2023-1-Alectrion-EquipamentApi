import { CreateReportController } from '../../presentation/controller/create-report.controller'
import { makeCreateReportUseCase } from '../useCases/create-report'

export const makeCreateReportController = () => {
  return new CreateReportController(makeCreateReportUseCase())
}
