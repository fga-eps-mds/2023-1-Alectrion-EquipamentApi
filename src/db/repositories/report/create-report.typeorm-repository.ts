import { ReportType } from '../../../domain/entities/reportEnum/report-type'
import { CreateReportRepository } from '../../../repository/report/create-report.repository'
import { CreateDataReport } from '../../../useCases/create-report/create-report.use-case'
import { dataSource } from '../../config'
import { Report } from '../../entities/report'

export class CreateReportTypeOrmRepository implements CreateReportRepository {
  public constructor(
    public readonly reportTypeormRepository = dataSource.getRepository(Report)
  ) {}

  public async create(data: CreateDataReport): Promise<Report> {
    return this.reportTypeormRepository.save({
      authorId: data.authorId,
      type: data.type as unknown as ReportType,
      elements: data.elements
    })
  }
}
