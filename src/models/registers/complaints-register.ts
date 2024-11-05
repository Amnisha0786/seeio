import { Dayjs } from "dayjs";

export interface TComplaintsRegister {
  id: string;
  name: string;
  startDate: string;
  expiryDate: string;
  type: "document" | "folder";
  status: string;
}

export interface ComplaintsRegisterFormValues {
  reference: string;
  acknowledgementDate: Dayjs;
  complaintAbout: string;
  resolutionDate: Dayjs;
  result: string;
  complaintDate: Dayjs;
  name: string;
  email: string;
  phone: string;
  address: string;
  owner: string;
  details: string;
  proposedSolution: string;
  documentUrl?: string;
}

export type TComplaintsDocument = {
  id: string;
  name: string;
  reference: string;
  acknowledgementDate: string;
  complaintAbout: string;
  resolutionDate: string;
  result: string;
  complaintDate: string;
  email: string;
  phone: number;
  address: string;
  owner: string;
  details: string;
  proposedSolution: string;
  documentUrl: string;
};
