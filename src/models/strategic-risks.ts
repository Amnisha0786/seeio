import { Dayjs } from "dayjs";

export type TMitigation = {
  name: string;
  newProbability: string;
  newImpact: string;
  notes: string;
  description?: string;
  status?: string;
  other?: string;
  objectiveId?: string;
};

export type TKeyData = {
  name: string;
  description: string;
  riskCategory: string;
  riskType: string;
  nextReview: string;
  owner: Dayjs;
  impact: string;
  probability: string;
};

export type Risk = {
  id: string;
  name: string;
  riskType: string;
  reviewDate: string;
  status: string;
};

export type TRisksFormValues = {
  id?: string;
  companyId?: string;
  name: string;
  description: string;
  riskType: string;
  nextReview: string;
  lastReview?: string;
  dateCreated?: string;
  owner?: string | { id: string, name: string };
  impact: number;
  other?: string;
  probability: number;
  reviewFrequency?: number;
  mitigations?: TMitigation[];
};

export type TStrategicRisksPreview = {
  formData: TRisksFormValues;
  setShowPreview: (data: any) => void;
  setOpen: (data: any) => void;
  fetchData: () => void;
  companyId?: string
};
