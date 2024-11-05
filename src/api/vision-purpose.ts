import decamelizeKeys from "decamelize-keys"
import { MainApi } from "./endpoint"

type Value = {
  value: string
  description: string
}

type VisionPurpose = {
  vision: string
  reviewDate: string
  mission: string
  corporateValues?: Value[]
  internalValues?: Value[]
  message?: string
}


export const getDataVision = ({ companyId }: { companyId?: string }): Promise<VisionPurpose> => {
  return MainApi.get(`/company/${companyId}/purpose`,{},(result)=>result,true)
}

export const createVision = ({ payload, companyId }: { payload: VisionPurpose, companyId?: string }): Promise<VisionPurpose> => {
  return MainApi.post(`/company/${companyId}/purpose`, decamelizeKeys(payload))
}
