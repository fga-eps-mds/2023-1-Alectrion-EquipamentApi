import {
  ForbiddenError,
  ServerError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError
} from '../../src/presentation/errors/http'

test('should create an instance of ServerError with correct message and name', () => {
  const error = new ServerError()

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(ServerError)

  expect(error.name).toBe('ServerError')
  expect(error.message).toBe('Server failed. Try again soon')

  expect(error.stack).toBeUndefined()
})

test('should create an instance of ServerError with correct message and name', () => {
  const msg = new Error('Error')
  const error = new ServerError(msg)

  expect(error.stack).toBe(error.stack)
})

test('should create an instance of Unauthorized with correct name and message', () => {
  const error = new UnauthorizedError()

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(UnauthorizedError)

  expect(error.name).toBe('UnauthorizedError')
  expect(error.message).toBe('Unauthorized')
})

test('should create an instance of ForbiddenError with correct name and message', () => {
  const error = new ForbiddenError()

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(ForbiddenError)

  expect(error.name).toBe('ForbiddenError')
  expect(error.message).toBe('Access denied')
})

test('should create an instance of NotFoundError with correct name and message', () => {
  const error = new NotFoundError()

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(NotFoundError)

  expect(error.name).toBe('NotFoundError')
  expect(error.message).toBe('Not found')
})

test('should create an instance of BadRequestError with correct name and message', () => {
  const msg = 'Invalid Request'
  const error = new BadRequestError(msg)

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(BadRequestError)

  expect(error.name).toBe('ForbiddenError')
})
