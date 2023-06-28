import { Report } from '../../domain/entities/report'
import {
  FindReportUseCase,
  ReportNotFoundError
} from '../../useCases/find-report/find-report.use-case'
import { HttpResponse, notFound, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'

export type FindReportHttpRequest = {
  id?: number
  type?: string
  createdAt?: string
  skip?: number
  take?: number
}

export class FindReportController extends Controller {
  public constructor(private findReportUseCase: FindReportUseCase) {
    super()
  }

  public async perform(
    params: FindReportHttpRequest
  ): Promise<HttpResponse<Report[] | Error>> {
    const response = await this.findReportUseCase.execute({
      id: params.id,
      type: params.type,
      createdAt: params.createdAt,
      skip: params.skip,
      take: params.take
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else if (
      !response.isSuccess &&
      response.error instanceof ReportNotFoundError
    ) {
      return notFound(response.error)
    } else return serverError()
  }
}
