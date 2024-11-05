import { Dayjs } from "dayjs";

export interface TResolutionRegister {
  id: string;
  name: string;
  lastEdited: string;
  circulationDate: string;
  type: "document" | "folder";
  dateApproved: string;
  status: string;
  description: string;
  resolutionNumber: string;
  companiesActReference: string;
  activity: string;
}

interface ResolutionMetadata {
  circulationDate: string;
  review?: Dayjs;
  notes?: string;
  status: string;
  resolutionNumber: string;
  companiesActReference: string;
  activity: string;
  documentUrl?: string;
  typeOfResolution: string
}

export interface AddResolutionValues {
  name: string;
  fileName?: string;
  fileBinary?: string;
  description: string;
  metadata: ResolutionMetadata;
}

export type TResolutionsDocument = {
  id: string;
  circulationDate?: string;
  dateCreated?: string;
  name: string;
  status: string;
  lastEdited: string;
  fileUrl?: string;
  description: string;
  activity: string;
  resolutionNumber: string;
  companiesActReference: string;
  review: string;
  notes: string;
  documentUrl: string;
  typeOfResolution?: string
  type?: string;
};

export type TResolutionRegisterOptions = {
  name: string;
  resolutionNumber: string;
  boardApprovalDate: string;
  status?: string;
}
