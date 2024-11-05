import { TPolicy } from '@/models'
import { MainApi } from './endpoint'

export const getPolicyData = (): Promise<TPolicy[]> => {
  return MainApi.get(`/policy-templates`)
}
export const getPolicy = (id: string): Promise<TPolicy> => {
  return MainApi.get(`/policy-templates/${id}`)
}
