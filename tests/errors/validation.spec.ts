import { RequiredFieldError } from '../../src/presentation/errors/validation'

test('should create an instance of RequiredFieldError with correct message and name', () => {
  const error = new RequiredFieldError()

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(RequiredFieldError)

  expect(error.name).toBe('RequiredFieldError')
  expect(error.message).toBe('Field required')
})

test('should create an instance of RequiredFieldError with correct message and name', () => {
  const fieldName = 'field_name'
  const error = new RequiredFieldError(fieldName)

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(RequiredFieldError)

  expect(error.name).toBe('RequiredFieldError')
  expect(error.message).toBe(`The field ${fieldName} is required`)
})
