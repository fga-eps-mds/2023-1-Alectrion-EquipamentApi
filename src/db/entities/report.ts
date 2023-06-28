import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ReportType } from '../../domain/entities/reportEnum/report-type'

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: ReportType
  })
  type: ReportType

  @Column({
    name: 'author_id'
  })
  authorId: string

  @Column({
    array: true,
    default: []
  })
  elements: Object[]

  @Column({ type: 'timestamptz' })
  @CreateDateColumn()
  createdAt?: Date
}
