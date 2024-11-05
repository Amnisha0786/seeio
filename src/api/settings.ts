import mockApi from '@/utils/mock-api'
import { MainApi } from './endpoint'
import decamelizeKeys from 'decamelize-keys'

export type TUsers = {
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  accessLevel: string,
  status: string,
  userType?: string
  isDisabled?: boolean
}

export type TGetUsersResponse = {
  num_users: number,
  users: TUsers[]
}

export type TDeleteUserPayload = {
  userIds: string[]
}

export type TUpdateUserPayload = {
  userId: string;
  updateAttributes: {
    accessLevel: string;
    userType: string;
    isDisabled: boolean;
    firstName: string;
    lastName: string;
  }
}

export type TResendInvitePayload = {
  email: string,
  firstName: string,
  lastName: string,
}

export const getBillingHistory = () => {
  return mockApi({
    data: [{
      id: 1,
      date: "20/11/1995",
      description: "Lorem Ispum",
      status: "active",
    }, {
      id: 2,
      date: "20/11/1995",
      description: "Lorem Ispum",
      status: "active",
    }, {
      id: 3,
      date: "20/11/1995",
      description: "Lorem Ispum",
      status: "active",
    }]
  })
}

export const getSubscription = () => {
  return mockApi({
    data: [{
      id: 1,
      name: "Hoang",
      date: "20/11/1995",
      cost: "100$",
      status: "active",
    }, {
      id: 2,
      name: "Hoang",
      date: "20/11/1995",
      cost: "100$",
      status: "active",
    }, {
      id: 3,
      name: "Hoang",
      date: "20/11/1995",
      cost: "100$",
      status: "active",
    }]
  })
}

export const resendInvite = (companyId: string, payload: TResendInvitePayload): Promise<TGetUsersResponse> => {
  return MainApi.post(`/company/${companyId}/settings/user/resend-invite`, decamelizeKeys(payload));
}

export const getUsers = (companyId: string, status?: string): Promise<TGetUsersResponse> => {
  return MainApi.get(status ? `/company/${companyId}/settings/user/list?status=${status}` : `/company/${companyId}/settings/user/list`);
}

export const addUser = (
  companyId: string,
  email: string,
  firstName: string,
  lastName: string,
  accessLevel: string,
  userType: string,
  invitedVdrId?: string
): Promise<any> => {
  return MainApi.put(`/company/${companyId}/settings/user`, decamelizeKeys({
    email,
    firstName,
    lastName,
    accessLevel,
    userType,
    invitedVdrId
  }));
}

export const deleteUsers = (companyId: string, payload: TDeleteUserPayload): Promise<any> => {
  return MainApi.post(`/company/${companyId}/settings/user/delete`, decamelizeKeys(payload));
}

export const updateUsers = (companyId: string, payload: TUpdateUserPayload): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/settings/user`, decamelizeKeys(payload, { deep: true }));
}

export const getBillingUrl = (companyId: string) => {
  return MainApi.get(`/company/${companyId}/billing`);
}
