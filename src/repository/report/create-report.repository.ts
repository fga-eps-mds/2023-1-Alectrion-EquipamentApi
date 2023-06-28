import { Report } from '../../domain/entities/report'
import { CreateDataReport } from '../../useCases/create-report/create-report.use-case'

export interface CreateReportRepository {
  create(data: CreateDataReport): Promise<Report>
}
