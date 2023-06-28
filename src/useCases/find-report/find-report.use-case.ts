import { Report } from '../../domain/entities/report'
import { FindReportRepository } from '../../repository/report/find-report.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class ReportNotFoundError extends Error {
  constructor() {
    super('Relatório não encontrado')
    this.name = 'ReportNotFoundError'
  }
}

export type FindDataReport = {
  id?: number
  type?: string
  createdAt?: string
  skip?: number
  take?: number
}

export class FindReportUseCase implements UseCase<FindDataReport, Report[]> {
  public constructor(private readonly reportRepository: FindReportRepository) {}

  public async execute(data: FindDataReport): Promise<UseCaseReponse<any>> {
    if (data.take === undefined) data.take = 0

    if (data.skip === undefined) data.skip = 0

    return this.reportRepository
      .find(data)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new ReportNotFoundError() }
      })
  }
}
