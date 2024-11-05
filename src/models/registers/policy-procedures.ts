import { Dayjs } from "dayjs";

export interface PolicyProcedure {
  id: string;
  policyName: string;
  lastEdited: string;
  circulationDate: string;
  status: string;
}

export type PoliciesFormValues = {
  name: string;
  active: boolean;
  owner: number;
  startDate: Dayjs;
  lastReview: Dayjs;
  nextReview: Dayjs;
  documentUrl?: string;
};

export type TPoliciesDocument = {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  lastReview: string;
  nextReview: string;
  documentUrl: string;
};
