import {
  CreateReportUseCase,
  ReportError
} from '../../useCases/create-report/create-report.use-case'
import { HttpResponse, notFound, ok, serverError } from '../helpers'
import { Controller } from '../protocols/controller'
import { Report } from '../../domain/entities/report'

export type CreateReportHttpRequest = {
  type: string
  elements: Object[]
  authorId: string
}

export class CreateReportController extends Controller {
  public constructor(private createReportUseCase: CreateReportUseCase) {
    super()
  }

  public async perform(
    body: CreateReportHttpRequest
  ): Promise<HttpResponse<Report | Error>> {
    const response = await this.createReportUseCase.execute({
      type: body.type,
      elements: body.elements,
      authorId: body.authorId
    })

    if (response.isSuccess && response.data) {
      return ok(response.data)
    } else if (!response.isSuccess && response.error instanceof ReportError) {
      return notFound(response.error)
    } else return serverError()
  }
}
