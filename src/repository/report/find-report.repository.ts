import { Report } from '../../domain/entities/report'
import { FindDataReport } from '../../useCases/find-report/find-report.use-case'

export interface FindReportRepository {
  find(data: FindDataReport): Promise<Array<Report>>
}
