import { MoreThanOrEqual } from 'typeorm'
import { ReportType } from '../../../domain/entities/reportEnum/report-type'
import { FindReportRepository } from '../../../repository/report/find-report.repository'
import { FindDataReport } from '../../../useCases/find-report/find-report.use-case'
import { dataSource } from '../../config'
import { Report } from '../../entities/report'

export class FindReportTypeOrmRepository implements FindReportRepository {
  public constructor(
    public readonly reportTypeormRepository = dataSource.getRepository(Report)
  ) {}

  public async find(data: FindDataReport): Promise<Report[]> {
    return this.reportTypeormRepository.find({
      order: { createdAt: 'DESC' },
      where: {
        id: data.id !== null ? data.id : undefined,
        type:
          data.type !== '' ? (data.type as unknown as ReportType) : undefined,
        createdAt:
          data.createdAt !== ''
            ? MoreThanOrEqual(new Date(data.createdAt))
            : undefined
      },
      take: data.take,
      skip: data.skip
    })
  }
}
