import { Report } from '../../domain/entities/report'
import { CreateReportRepository } from '../../repository/report/create-report.repository'
import { UseCase, UseCaseReponse } from '../protocol/useCase'

export class ReportError extends Error {
  constructor() {
    super('Erro ao armazenar relatório')
    this.name = 'ReportError'
  }
}

export type CreateDataReport = {
  type: string
  elements: Object[]
  authorId: string
}

// eslint-disable-next-line no-undef
export class CreateReportUseCase implements UseCase<CreateDataReport, Report> {
  public constructor(
    private readonly reportRepository: CreateReportRepository
  ) {}

  public async execute(
    data: CreateDataReport
  ): Promise<UseCaseReponse<Report>> {
    return this.reportRepository
      .create(data)
      .then((it) => {
        return { isSuccess: true, data: it }
      })
      .catch(() => {
        return { isSuccess: false, error: new ReportError() }
      })
  }
}
