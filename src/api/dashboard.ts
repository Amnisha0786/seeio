import { TGovernanceTimetable, TDashboardData, TFilterOptions, TCongif } from '@/models'
import { MainApi } from './endpoint'
import decamelizeKeys from 'decamelize-keys'


type TGovernancePayload = {
  companyId: string
  filter?: TFilterOptions
}

export const getGovernanceData = ({ companyId, ...payload }: TGovernancePayload): Promise<TGovernanceTimetable> => {
  return MainApi.get(`/company/${companyId}/governance-timetable/list`, decamelizeKeys(payload, { deep: true }))
}

export const getDashboardData = (companyId: string): Promise<TDashboardData> => {
  return MainApi.get(`/company/${companyId}/dashboard`)
}

export const getConfig = (): Promise<TCongif> => {
  return MainApi.get(`/user/config`)
}

export const updateConfig = ({ ...payload }: TCongif) => {
  return MainApi.put(`/user/config`, decamelizeKeys(payload, { deep: true }))
}
