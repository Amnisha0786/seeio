import decamelizeKeys from 'decamelize-keys'

import { MainApi } from './endpoint'
import { ActionDetails } from '@/models/corporate-objective';

export const getCorporateObjectives = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/objective/list`, {}, (result) => result, true)
}
export const getCorporateObjective = (companyId: string, objectiveId?: string) => {
  return MainApi.get(`/company/${companyId}/objective/${objectiveId}`)
}

export const createCorporateObjectiveActions = (details: ActionDetails, companyId: string | undefined) => {
  return MainApi.post(`/company/${companyId}/objective`, decamelizeKeys(details))
}

export const editCorporateObjective = (details: ActionDetails, companyId: string | undefined, objectiveId: string | undefined,) => {
  return MainApi.patch(`/company/${companyId}/objective/${objectiveId}`, decamelizeKeys(details))
}

export const deleteCorporateObjective = (companyId: string | undefined, objectiveId: string | undefined,) => {
  return MainApi.delete(`/company/${companyId}/objective`, {
    objective_ids: [objectiveId],
    company_id: companyId
  })
}

export const getDownloadRiskUrl = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/risk/download`)
}
