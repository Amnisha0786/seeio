import { Dayjs } from "dayjs";

export interface TInsuranceRegister {
  id: string;
  name: string;
  startDate: string;
  expiryDate: string;
  autoRenewal: string;
  type: "document" | "folder";
  terms: number;
  status: string;
}

export interface InsuranceRegisterFormValues {
  name: string;
  startDate: Dayjs;
  owner: string;
  notes: string;
  expiryDate: Dayjs;
  lastReview: Dayjs;
  nextReview: Dayjs;
  cancelled: boolean;
}

export type TInsurancesDocument = {
  id: string;
  name: string;
  startDate: string;
  owner: string;
  expiryDate: string;
  lastReview: string;
  nextReview: string;
  cancelled: boolean;
  notes: string;
};
