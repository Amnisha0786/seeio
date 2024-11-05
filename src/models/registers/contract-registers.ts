import { Dayjs } from "dayjs";

export interface TContractRegister {
  id: string;
  name: string;
  startDate: string;
  expiryDate: string;
  autoRenewal: string;
  type: "document" | "folder";
  terms: number;
  status: string;
}

export interface ContractformValues {
  name: string;
  description: string;
  terms: string;
  startDate: Dayjs;
  expiryDate: Dayjs;
  lastReviewDate: Dayjs;
  nextReviewDate: Dayjs;
  autoRenewal: boolean;
  parties: string;
  owner: string;
  paymentTerms: string;
  status: string;
  terminated: boolean;
  documentUrl?: string;
}
export type TContractsDocument = {
  id: string;
  name: string;
  description: string;
  terms: string;
  startDate: string;
  expiryDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  autoRenewal: boolean;
  parties: string;
  owner: string;
  paymentTerms: string;
  terminated: boolean;
  status: string;
  documentUrl: string;
};
