import { ReportType } from './reportEnum/report-type'

export type Report = {
  id: number
  type: ReportType
  elements: Object[]
  authorId: string
  createdAt?: Date
}
