import {
  EquipmentNotFoundError,
  UnitNotFoundError,
  InvalidAuthorError,
  InvalidUnitError,
  InvalidSenderError,
  InvalidDateError,
  CreateOrderServiceError,
  UpdateOrderServiceError
} from '../src/useCases/create-order-service/errors'

describe('EquipmentNotFoundError', () => {
  it('should have the correct error message and name', () => {
    const error = new EquipmentNotFoundError()
    expect(error.message).toBe('Equipment Not Found')
    expect(error.name).toBe('EquipmentNotFoundError')
  })
})

describe('UnitNotFoundError', () => {
  it('should have the correct error message and name', () => {
    const error = new UnitNotFoundError()
    expect(error.message).toBe('Unit Not Found')
    expect(error.name).toBe('UnitNotFoundError')
  })
})

describe('InvalidAuthorError', () => {
  it('should have the correct error message and name', () => {
    const error = new InvalidAuthorError()
    expect(error.message).toBe('Invalid Author')
    expect(error.name).toBe('InvalidAuthor')
  })
})

describe('InvalidUnitError', () => {
  it('should have the correct error message and name', () => {
    const error = new InvalidUnitError()
    expect(error.message).toBe('Invalid Unit')
    expect(error.name).toBe('InvalidUnit')
  })
})

describe('InvalidSenderError', () => {
  it('should have the correct error message and name', () => {
    const error = new InvalidSenderError()
    expect(error.message).toBe('Invalid Sender')
    expect(error.name).toBe('InvalidSender')
  })
})

describe('InvalidDateError', () => {
  it('should have the correct error message and name', () => {
    const error = new InvalidDateError()
    expect(error.message).toBe('Invalid date error')
    expect(error.name).toBe('InvalidDateError')
  })
})

describe('CreateOrderServiceError', () => {
  it('should have the correct error message and name', () => {
    const error = new CreateOrderServiceError()
    expect(error.message).toBe('Create Order Service Error')
    expect(error.name).toBe('CreateOrderServiceError')
  })
})

describe('UpdateOrderServiceError', () => {
  it('should have the correct error message and name', () => {
    const error = new UpdateOrderServiceError()
    expect(error.message).toBe('Update Order Service Error')
    expect(error.name).toBe('UpdateOrderServiceError')
  })
})
