import decamelizeKeys from 'decamelize-keys'

import { MainApi } from './endpoint'
import {
  TCash,
  TCashRevenueDocument,
  TCompany,
  TCompanyDetails,
  TDepartment,
  TInvitesData,
  TPeople,
  TRevenue,
  TXero,
  TXeroData
} from '@/models'

type UpdateCompanyMetadataParams = {
  companyTradingName?: string
  companyName: string
  companySize: string
  companyType: string
  companySummary: string
  sicCode?: string
  businessDescription: string
  officeAddress?: string
  boardCommitteeOptions: string[] | string | null
  numBoardMeetings: string
  logoFileName: string
  companyId: string
}

type TUpdateCompanyMetadataRes = {
  uploadUrl?: {
    data: string
    failed: boolean
  }
}

type TGetCompanyPeopleRes = {
  people: TPeople[]
  numPeople: number
}

type UpdateCompanyKeyDateParams = {
  confirmationReviewDate: string
  annualAccountsReviewDate: string
  companyId: string
}

type People = {
  firstName: string
  lastName: string
  departmentIds: string[] | null
  email: string
  role: string
}

type UpdateCompanyPeopleParams = {
  companyId: string
  people?: People[]
}

type UpdatePersonParams = {
  companyId: string
  personId: string
  updateAttributes: People
}

type UpdateCompanyDepartmentParams = {
  companyId: string
  departmentId?: string
  updateAttributes?: Omit<TDepartment, 'id' | 'createdAt'>
}

type CreateCompanyDepartmentParams = {
  companyId: string
  department: Omit<TDepartment, 'id' | 'createdAt'>
}

type AcceptInvitesPayload = {
  companyId: string
  response: "ACCEPT" | "REJECT"
}


export const searchCompany = ({
  companyName,
  companyNumber
}: {
  companyName?: string,
  companyNumber?: string
}): Promise<{ companies: TCompany[] }> => {
  const payload = companyName ? { company_name: companyName } : { company_number: companyNumber }

  return MainApi.get('/onboarding/search', payload, (result) => (
    result.companyNumber ? {
      companies: [{
        companyNumber: result.companyNumber,
        companyStatus: result.companyStatus,
        companyType: result.type,
        dateOfCreation: result.dateOfCreation,
        name: result.companyName,
        address: result.registeredOfficeAddress?.addressLine1,
      }]
    } : result
  ))
}

export const importCompany = ({ companyId }: { companyId: string }): Promise<any> => {
  return MainApi.put('/onboarding/import', { company_id: companyId })
}

export const getCompanyMetadata = ({ companyId }: { companyId: string }): Promise<TCompanyDetails> => {
  return MainApi.get(`/onboarding/${companyId}/metadata`)
}

export const updateCompanyMetadata = ({ companyId, ...payload }: UpdateCompanyMetadataParams): Promise<TUpdateCompanyMetadataRes> => {
  return MainApi.put(`/onboarding/${companyId}/metadata`, decamelizeKeys(payload))
}

export const getCompanyDepartments = ({ companyId }: { companyId: string }): Promise<{ departments: TDepartment[], numDepartments: number }> => {
  return MainApi.get(`/company/${companyId}/people/list`, { filter: "departments" })
}

export const getCompanyPeople = ({ companyId }: { companyId: string }): Promise<TGetCompanyPeopleRes> => {
  return MainApi.get(`/company/${companyId}/people/list`)
}

export const createCompanyPerson = async ({ companyId, ...payload }: UpdateCompanyPeopleParams): Promise<any> => {
  return MainApi.put(`/company/${companyId}/people`, decamelizeKeys({
    ...payload,
    peopleType: "person"
  }, { deep: true }));
}

export const updatePerson = async ({ companyId, personId, ...payload }: UpdatePersonParams): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/people/${personId}`, decamelizeKeys({
    ...payload,
    peopleType: "person"
  }, { deep: true }));
}

export const deleteCompanyPeople = async ({ companyId, personId }: { companyId: string, personId: string }): Promise<any> => {
  return MainApi.delete(`/company/${companyId}/people/${personId}?people_type=person`);
}

export const deleteCompanyDepartment = async ({ companyId, departmentId }: { companyId: string, departmentId: string }): Promise<any> => {
  return MainApi.delete(
    `/company/${companyId}/people/${departmentId}`,
    undefined,
    undefined,
    decamelizeKeys({ peopleType: "department" })
  );
}

export const createCompanyDepartment = async ({ companyId, ...payload }: CreateCompanyDepartmentParams): Promise<any> => {
  return MainApi.put(`/company/${companyId}/people`, decamelizeKeys({
    ...payload,
    peopleType: "department"
  }, { deep: true }));
}

export const updateCompanyDepartment = async ({ companyId, departmentId, ...payload }: UpdateCompanyDepartmentParams): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/people/${departmentId}`, decamelizeKeys({
    ...payload,
    peopleType: "department"
  }, { deep: true }));
}

export const getCompanyKeyDates = ({ companyId }: { companyId: string }): Promise<any> => {
  return MainApi.get(`/onboarding/${companyId}/dates`)
}

export const updateCompanyKeyDates = async ({ companyId, ...payload }: UpdateCompanyKeyDateParams): Promise<any> => {
  return MainApi.put(
    `/onboarding/${companyId}/dates`,
    {
      confirmation_review_date: payload.confirmationReviewDate,
      annual_accounts_review_date: payload.annualAccountsReviewDate,
    }
  );
}

export const acceptCompanyInvitation = async ({
  ...payload
}: AcceptInvitesPayload): Promise<TInvitesData[]> => {
  return MainApi.patch(`/user/invite`, decamelizeKeys(payload))
}

export const xeroIntegration = ({
  companyId,
  ...payload
}: { companyId?: string, companyName?: string }): Promise<TXero> => {
  return MainApi.post(`/company/${companyId}/accounting/invite`, decamelizeKeys(payload));
};

export const getXeroIntegration = ({
  companyId,
}: { companyId?: string }): Promise<{
  failed?: boolean,
  data?: TXeroData
}> => {
  return MainApi.get(`/company/${companyId}/accounting/metadata`);
};

export const xeroLinkIntegration = ({
  companyId,
  inviteLinkId,
}: {
  companyId?: string,
  inviteLinkId?: string
}): Promise<{
  inviteLink: string
}> => {
  return MainApi.get(`/company/${companyId}/accounting/invite/${inviteLinkId}`);
};

export const refreshData = ({
  companyId,
  rootiFyId,
}: {
  companyId?: string,
  rootiFyId?: string
}) => {
  return MainApi.post(`/company/${companyId}/accounting/${rootiFyId}/refresh`, {});
};

export const getXeroIntegrationData = ({
  companyId,
  rootiFyId
}: { companyId?: string, rootiFyId?: number }): Promise<TXeroData> => {
  return MainApi.get(`/company/${companyId}/accounting/calculator?rootfi_company_id=${rootiFyId}&n=3`);
};
export const updateCash = ({
  companyId,
  rootiFyId,
  ...payload
}: {
  companyId?: string,
  rootiFyId?: number,
  payload?: TCash
}): Promise<TXeroData> => {
  return MainApi.patch(`/company/${companyId}/accounting/${rootiFyId}/cash`, decamelizeKeys(payload));
};
export const updateRevenue = ({
  companyId,
  rootiFyId,
  ...payload
}: {
  companyId?: string,
  rootiFyId?: number,
  payload?: TRevenue
}): Promise<TXeroData> => {
  return MainApi.patch(`/company/${companyId}/accounting/${rootiFyId}/revenue`, decamelizeKeys(payload));
};
export const addException = ({
  companyId,
  ...payload
}: {
  companyId?: string,
  payload?: {
    rootfiCompanyId?: string
  }
}): Promise<TXeroData> => {
  return MainApi.post(`/company/${companyId}/accounting/exceptional-items`, decamelizeKeys(payload));
};

export const editException = ({
  companyId,
  ...payload
}: {
  companyId?: string,
  payload?: { rootfiCompanyId?: string }
}): Promise<TXeroData> => {
  return MainApi.patch(`/company/${companyId}/accounting/exceptional-items`, decamelizeKeys(payload));
};

export const addNewCashRevenueDocument = ({
  companyId,
  rootiFyId,
  ...payload
}: {
  companyId?: string,
  rootiFyId?: number,
  payload?: TCashRevenueDocument
}): Promise<TCashRevenueDocument> => {
  return MainApi.post(`/company/${companyId}/accounting/${rootiFyId}/cash`, decamelizeKeys(payload));
};

export const getCorporateDirectors = ({
  companyId,
}: { companyId?: string }) => {
  return MainApi.get(`/company/${companyId}/corporate-directors`);
};
