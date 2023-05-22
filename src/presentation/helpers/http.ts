import {
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError
} from '../errors'

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const ok = <T = any>(data?: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  statusCode: 401,
  data: error
})

export const forbidden = (): HttpResponse<Error> => ({
  statusCode: 403,
  data: new ForbiddenError()
})

export const notFound = (error?: any): HttpResponse<Error> => ({
  statusCode: 404,
  data: error instanceof Error ? error : new NotFoundError()
})

export const serverError = (error?: any): HttpResponse<Error> => ({
  statusCode: 500,
  data: error instanceof Error ? error : new ServerError()
})
