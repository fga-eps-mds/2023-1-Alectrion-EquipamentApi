import { Movement, Types } from '../../domain/entities/movement'

import { UseCase, UseCaseReponse } from './../protocol/useCase'

import { MovementRepositoryProtocol, Query } from '../../repository/protocol/movementRepositoryProtocol'

export type FindMovementsUseCaseData = {
    id?: string
    userid?: string
    equipmentid?: string
    type?: Number
    lowerdate?: Date
    higherdate?: Date
    page?: Number
    resultquantity?: Number
}

export class InvalidDateError extends Error {
    constructor() {
        super('As datas fornecidas são inválidas.')
        this.name = 'InvalidDateError'
    }
}

export class FindMovementsUseCase implements UseCase<FindMovementsUseCaseData, Movement[]> {
    constructor(
        private readonly movementRepository: MovementRepositoryProtocol
    ) {}

    private areDatesInvalid(data: FindMovementsUseCaseData): boolean {
        if(data.lowerdate || data.higherdate)
            if(!(data.lowerdate && data.higherdate) || data.higherdate < data.lowerdate)
                return true
        return false
    }

    async execute(data: FindMovementsUseCaseData): Promise<UseCaseReponse<Movement[]>> {
        if(this.areDatesInvalid(data))
            return {
                isSuccess: false,
                error: new InvalidDateError()
            }
        
        const page = data.page ? data.page : 0
        const resultQuantity = data.resultquantity ? data.resultquantity : 50

        const query : Query = {
            id: data.id,
            userId: data.userid,
            equipmentId: data.equipmentid,
            type: data.type,
            lowerDate: data.lowerdate,
            higherDate: data.higherdate,
            page,
            resultQuantity
        }

        const result = await this.movementRepository.genericFind(query)

        return {
            isSuccess: true,
            data: result
        }
    }
}
