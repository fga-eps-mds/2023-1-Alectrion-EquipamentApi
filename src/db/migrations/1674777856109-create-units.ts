import { MigrationInterface, QueryRunner } from 'typeorm'

const units = [
  {
    name: 'Assessoria Contábil',
    localization: 'Goiânia'
  },
  {
    name: 'Conselho Superior da Polícia Civil',
    localization: 'Goiânia'
  },
  {
    name: 'Delegacia-Geral Adjunta',
    localization: 'Goiânia'
  },
  {
    name: 'Divisão de Suporte Técnico em Informática',
    localization: 'Goiânia'
  },
  {
    name: 'Escola Superior da Polícia Civil',
    localization: 'Goiânia'
  },
  {
    name: 'Gerência de Correições e Disciplina da Polícia Civil',
    localization: 'Goiânia'
  },
  {
    name: 'Gerência de Gestão e Finanças',
    localization: 'Goiânia'
  },
  {
    name: 'Gerência de Identificação',
    localization: 'Goiânia'
  },
  {
    name: 'Gerência de Operações de Inteligência da Polícia Civil',
    localization: 'Goiânia'
  },
  {
    name: 'Superintendência de Polícia Judiciária',
    localization: 'Goiânia'
  }
]

export class createUnits1674777856109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    units.forEach(async (units) => {
      await queryRunner.query(
        `INSERT INTO \"unit\"(name, localization) VALUES('${units.name}', '${units.localization}')`
      )
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
