import {
  EquipmentNotFoundError,
  UnitNotFoundError,
  InvalidAuthorError,
  InvalidUnitError,
  InvalidSenderError,
  InvalidDateError,
  CreateOrderServiceError,
  UpdateOrderServiceError
} from './../../src/useCases/create-order-service/errors/index'

describe('EquipmentNotFoundError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new EquipmentNotFoundError()
    expect(error.name).toBe('EquipmentNotFoundError')
    expect(error.message).toBe('Equipment Not Found')
  })
})

describe('UnitNotFoundError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new UnitNotFoundError()
    expect(error.name).toBe('UnitNotFoundError')
    expect(error.message).toBe('Unit Not Found')
  })
})

describe('InvalidAuthorError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new InvalidAuthorError()
    expect(error.name).toBe('InvalidAuthor')
    expect(error.message).toBe('Invalid Author')
  })
})

describe('InvalidUnitError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new InvalidUnitError()
    expect(error.name).toBe('InvalidUnit')
    expect(error.message).toBe('Invalid Unit')
  })
})

describe('InvalidSenderError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new InvalidSenderError()
    expect(error.name).toBe('InvalidSender')
    expect(error.message).toBe('Invalid Sender')
  })
})

describe('InvalidDateError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new InvalidDateError()
    expect(error.name).toBe('InvalidDateError')
    expect(error.message).toBe('Invalid date error')
  })
})

describe('CreateOrderServiceError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new CreateOrderServiceError()
    expect(error.name).toBe('CreateOrderServiceError')
    expect(error.message).toBe('Create Order Service Error')
  })
})

describe('UpdateOrderServiceError', () => {
  test('should create an instance with the correct name and message', () => {
    const error = new UpdateOrderServiceError()
    expect(error.name).toBe('UpdateOrderServiceError')
    expect(error.message).toBe('Update Order Service Error')
  })
})
