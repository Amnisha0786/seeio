import { MainApi } from './endpoint'
import { TMinuteBook, TMinuteBookDetails } from '@/models'

type TGetMinuteBookDetailsReq = { companyId: string, minuteBookId: string }

export const getMinuteBook = ({ companyId }: { companyId: string }): Promise<{ numMinutes: number, minutes: TMinuteBook[] }> => {
  return MainApi.get(`/company/${companyId}/minute-book`)
}

export const getMinuteBookDetails = ({ companyId, minuteBookId }: TGetMinuteBookDetailsReq): Promise<TMinuteBookDetails & { message: string }> => {
  return MainApi.get(`/company/${companyId}/minutes/${minuteBookId}`)
}
