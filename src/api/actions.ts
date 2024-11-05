import decamelizeKeys from "decamelize-keys";

import { MainApi } from "./endpoint";
import { TAction } from "@/models";

type TAddActionReq = {
  companyId: string;
  name: string;
  owner: string;
  dueDate: string;
  description?: string;
  meetingId?: string;
  topicId?: string;
  agendaId?: string;
};

type TUpdateActionReq = TAddActionReq & {
  actionId: string;
};
type TUpdateActionStatusReq = {
  companyId: string;
  actionId: string;
  status?: string
};

type TGetActionsReq = {
  companyId: string;
  linkType: "user" | "company";
  meetingId?: string;
  status?: any;
  ownerId?: string;
};
type TGetActionLogs = {
  companyId?: string;
  actionId?:string;
};

export const getActions = ({
  companyId,
  ...payload
}: TGetActionsReq): Promise<TAction[]> => {
  return MainApi.get(
    `/company/${companyId}/actions/list`,
    decamelizeKeys(payload)
  );
};
export const getActionLogs = ({
  companyId,
  actionId,
}: TGetActionLogs): Promise<string[]> => {
  return MainApi.get(
    `/company/${companyId}/actions/${actionId}/logs`
  );
};

export const addAction = ({
  companyId,
  ...payload
}: TAddActionReq): Promise<{ message: string }> => {
  return MainApi.post(`/company/${companyId}/actions`, decamelizeKeys(payload));
};

export const updateAction = ({
  companyId,
  actionId,
  ...payload
}: TUpdateActionReq): Promise<{ message: string }> => {
  return MainApi.patch(
    `/company/${companyId}/actions/${actionId}`,
    decamelizeKeys(payload)
  );
};

export const updateActionstatus = ({
  companyId,
  actionId,
  ...payload
}: TUpdateActionStatusReq): Promise<{ message: string }> => {
  return MainApi.patch(
    `/company/${companyId}/actions/${actionId}`,
    decamelizeKeys(payload)
  );
};

export const deleteAction = ({
  companyId,
  actionId,
}: {
  companyId: string;
  actionId: string;
}): Promise<{ message: string }> => {
  return MainApi.delete(`/company/${companyId}/actions/${actionId}`);
};
