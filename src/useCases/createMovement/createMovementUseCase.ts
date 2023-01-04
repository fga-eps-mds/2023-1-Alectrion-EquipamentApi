import { Equipment } from '../../domain/entities/equipment'
import { Movement, Types } from '../../domain/entities/movement'

import { UseCase, UseCaseReponse } from './../protocol/useCase'

import { EquipmentRepositoryProtocol } from '../../repository/protocol/equipmentRepositoryProtocol'
import { UnitRepositoryProcol as UnitRepositoryProtocol } from '../../repository/protocol/unitRepositoryProtocol'
import { MovementRepositoryProtocol } from '../../repository/protocol/movementRepositoryProtocol'

export type CreateMovementUseCaseData = {
    userid: string
    equipments: string[]
    type: Number
    description?: string
    source?: string
    destination?: string
}

export class NullFieldsError extends Error {
    constructor() {
        super('Um ou mais campos obrigatórios possuem valores nulos.')
        this.name = 'NullFieldsError'
    }
}

export class InvalidTypeError extends Error {
    constructor() {
        super('Tipo de movimento inválido.')
        this.name = 'InvalidTypeError'
    }
}

export class InvalidUserError extends Error {
    constructor() {
        super('Usuário inválido.')
        this.name = 'InvalidUserError'
    }
}

export class InvalidDestinationError extends Error {
    constructor() {
        super('Unidade de destino inválida.')
        this.name = 'InvalidDestinationError'
    }
}

export class InvalidSourceError extends Error {
    constructor() {
        super('Unidade de origem inválida.')
        this.name = 'InvalidSourceError'
    }
}

export class InvalidEquipmentError extends Error {
    constructor() {
        super('Um ou mais equipamentos inválidos.')
        this.name = 'InvalidEquipmentError'
    }
}

export class CreateMovementUseCase implements UseCase<CreateMovementUseCaseData, Movement> {
    constructor(
        private readonly equipmentRepository: EquipmentRepositoryProtocol,
        private readonly unitRepository: UnitRepositoryProtocol,
        private readonly movementRepository: MovementRepositoryProtocol
    ) {}

    private areFieldsNull(data: CreateMovementUseCaseData): boolean {
        if(data.userid == '' || !data.equipments.length)
            return true
        return false
    }

    private isTypeInvalid(data: CreateMovementUseCaseData): boolean {
        if(data.type < Types.Borrow || data.type > Types.Ownership)
            return true
        return false
    }

    private isUserInvalid(data: CreateMovementUseCaseData): boolean {
        return false
    }

    private isUnitValid(unit: any): boolean {
        if(!unit)
            return true
        return false
    }

    private areEquipmentsInvalid(equipments: Equipment[]): boolean {
        if(equipments.includes(null))
            return true
        return false
    }

    async execute(data: CreateMovementUseCaseData): Promise<UseCaseReponse<Movement>> {
        if(this.areFieldsNull(data))
            return {
                isSuccess: false,
                error: new NullFieldsError()
            }
        
        if(this.isTypeInvalid(data))
            return {
                isSuccess: false,
                error: new InvalidTypeError()
            }

        if(this.isUserInvalid(data))
            return {
                isSuccess: false,
                error: new InvalidUserError()
            }

        const equipments = []
        for(let equipment of data.equipments)
            equipments.push(await this.equipmentRepository.findOne(equipment))

        if(this.areEquipmentsInvalid(equipments))
            return {
                isSuccess: false,
                error: new InvalidEquipmentError()
            }

        const movement = {
            id: '-1',
            date: new Date(),
            userId: data.userid,
            equipments: equipments,
            type: data.type
        };

        let result;

        switch(data.type) {
            case Types.Borrow: {
                const destination = await this.unitRepository.findOne(data.destination)

                if(this.isUnitValid(destination))
                    return {
                        isSuccess: false,
                        error: new InvalidDestinationError()
                    }

                result = await this.movementRepository.create(movement, {
                    id: '-1',
                    movement,
                    destination
                })
                break
            }

            case Types.Dismiss: {
                result = await this.movementRepository.create(movement, {
                    id: '-1',
                    movement,
                    description: data.description
                })
                break
            }

            default: {
                const source = await this.unitRepository.findOne(data.source)
                const destination = await this.unitRepository.findOne(data.destination)

                if(this.isUnitValid(source))
                    return {
                        isSuccess: false,
                        error: new InvalidSourceError()
                    }

                if(this.isUnitValid(destination))
                    return {
                        isSuccess: false,
                        error: new InvalidDestinationError()
                    }

                result = await this.movementRepository.create(movement, {
                    id: '-1',
                    movement,
                    source,
                    destination
                })
                break
            }
        }

        return {
            isSuccess: true,
            data: result
        }
    }
}
