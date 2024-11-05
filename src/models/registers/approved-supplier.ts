import { Dayjs } from "dayjs";

export type KeyIndicator = {
  indicator: string;
  owner: string;
  indicatorType: string;
  frequency: string;
  status: string;
  descriptionOfKey: string;
};

export type SupplierDetails = {
  category: string;
  detail: string;
  status: string;
  frequency: string;
  createdDate: Dayjs;
  lastReviewDate: Dayjs;
  nextReviewDate: Dayjs;
  keyIndicators: KeyIndicator[];
};

export type ApprovedSuppliers = {
  id: string;
  account_manager: string;
  contractRenewalDate: string;
  created_by: string;
  dateCreated: string;
  dateFirstApproved: string;
  dateLastReviewed: string;
  description: string;
  docType: string;
  name: string;
  ownedBy: string;
  parentId: string;
  proposedSolution: string;
  registerCategory_id: string;
  reviewDate?: string;
  status: string;
  supplierType: string | number;
  type?:string
};

export interface ApprovedSuppliersMetadata {
  supplierType: string;
  accountManager: string;
  status: string;
  contractRenewalDate: string;
  dateFirstApproved: string;
  dateLastReviewed: string;
  reviewDate: string;
  proposedSolution: string;
  type?: string;
}

export type ApprovedSuppliersFormValues = {
  name: string;
  fileName?: string;
  fileBinary?: string;
  description: string;
  parentId?: string;
  docType?: string;
  metadata: ApprovedSuppliersMetadata;
};

export type TSuppliersDocument = {
  id: string;
  name: string;
  contractRenewalDate: string;
  dateFirstApproved: string;
  dateLastReviewed: string;
  accountManager: string;
  status: string;
  active: boolean;
  type: number;
  reviewDate: string;
  notes: string;
  documentUrl: string;
  purposedSolution: string;
};
