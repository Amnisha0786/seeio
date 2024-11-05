import decamelizeKeys from "decamelize-keys";

import { MainApi } from './endpoint'
import { TProgressUpdate, TProgressUpdateDetails } from '@/models'

type TGetProgressUpdatesReq = {
  companyId: string,
  filter?: "person" | "company",
  personId?: string
}

type TGetProgressUpdateDetailsReq = {
  companyId: string,
  objectiveId: string,
  updateId: string
}

type TSaveProgressUpdate = {
  companyId: string,
  objectiveId: string,
  updateId: string
  progressSummary?: string
  achievements?: string
  currentWork?: string
  outlook?: string
  obstaclesPreventingProgress?: string
  specificNeeds?: string
  quantitiveMetric?: {
    valueAchieved: string
    units: string
  }
  notesToOwner?: string
  status?: string
  sendEmail?: string
}
export type payloadData = {
  objectiveId: string
  progressUpdateId: string
}

type TAbandonedProgressUpdate = {
  companyId: string
  data: payloadData[]
}

export const getProgressUpdates = ({ companyId, ...payload }: TGetProgressUpdatesReq): Promise<TProgressUpdate[]> => {
  return MainApi.get(`/company/${companyId}/progress-update/list`, decamelizeKeys(payload))
}

export const getProgressUpdateDetails = ({ companyId, objectiveId, updateId }: TGetProgressUpdateDetailsReq): Promise<TProgressUpdateDetails> => {
  return MainApi.get(`/company/${companyId}/objective/${objectiveId}/progress-update/${updateId}`)
}

export const saveProgressUpdateDetails = ({ companyId, objectiveId, updateId, ...payload }: TSaveProgressUpdate): Promise<TSaveProgressUpdate> => {
  return MainApi.patch(`/company/${companyId}/objective/${objectiveId}/progress-update/${updateId}`, decamelizeKeys(payload, { deep: true }))
}

export const abandonedProgressUpdate = ({ companyId, ...payload }: TAbandonedProgressUpdate): Promise<TSaveProgressUpdate> => {
  return MainApi.patch(`/company/${companyId}/progress-update/abandoned`, decamelizeKeys(payload, { deep: true }))
}
