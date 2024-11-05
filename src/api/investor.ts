import { MainApi } from './endpoint'

export const getInvestors = (companyId?: string, personId?: string) => {
  if (companyId) {
    return MainApi.get(`/investor/dashboard?owner_id=${personId}&company_id=${companyId}`)
  } else {
    return MainApi.get(`/investor/dashboard?owner_id=${personId}`)
  }
}
export const getInvestorsDashboard = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/dashboard`)
}

export const getDescriptionData = (companyId: string) => {
  return MainApi.get(`/investor/${companyId}/confidential-notes`)
}
export const submitdescripton = (companyId: string, data: { subject: string, decription?: string }) => {
  return MainApi.put(`/investor/${companyId}/confidential-notes`, data)
}
