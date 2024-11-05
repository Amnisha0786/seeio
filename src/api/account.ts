import { TCompanyUserAccess, TInvitesData, TUserCompany } from '@/models'
import { MainApi } from './endpoint'

type TGetAccountInfoResponse = {
  num_companies: number
  companies: TUserCompany[]
  invites?: TInvitesData[]
}


export const getAccountInfo = (filter?: string): Promise<TGetAccountInfoResponse> => {
  return MainApi.get(`/company/list?filter=${filter ? filter : "all"}`);
}

export const getAccountAccess = (companyId: string): Promise<TCompanyUserAccess> => {
  return MainApi.get(`/company/${companyId}/settings/user/access`);
};
