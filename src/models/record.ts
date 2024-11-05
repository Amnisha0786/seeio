export type TRecord = {
  id: string;
  name: string;
  numFiles: number;
  status: string;
  statusText: string;
};

export type TRecords = {
  id: string;
  name: string;
  docType: string;
  description: string;
  statusText: string;
  responsibleDepartment: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

export type TRecordDocument = {
  id?: string;
  recordCategoryId?: string;
  companyId: string;
  name: string;
  lastReview?: string;
  date: string;
  type: string;
  needReview?: boolean;
  active?: boolean;
  noLongerRequired: boolean;
  review: string;
  description: string;
  notes?: string;
  fileType: string;
  fileUrl: string;
  fileName?: string;
  docType: string;
  reviewDate?: string;
  documentDate?: string;
  commencementDate?: string;
  expiryDate?: string;
  commencement?: string;
  expiry?: string;
  referenceNumber?: string;
  secondReferenceNumber?: string;
  referenceNumberLabel?: string;
  secondReferenceNumberLabel?: string;
  reviewFrequency?: string;
  owner?: Owner;
  uploadUrl?: any;
  fileBinary?: any;
  additionalFileNames?: string[]
  additionalFiles?: any[]
  status?: string
};

export interface OwnerOption {
  label: string;
  value: string;
  status?: string;
}

export interface Owner {
  id: string
  name: string
  description: string
  created_at: string
}

export type TItems = {
  id: string;
  registerCategoryId: string;
  parentId: string;
  needReview?: boolean;
  active?: boolean;
  date?: Date;
  reviewDate?: Date;
  lastReview?: Date;
  notes?: string;
  documentDate?: Date;
  commencementDate?: Date;
  expiryDate?: Date;
  owner?: string;
  referenceNumber?: string;
  noLongerRequired?: boolean;
  additionalResolutionNumbers?: string[]
  resolutionNumber?: string
};

export type TRecordDocumentDetails = {
  numDocuments: number;
  name?: string;
  items: TItems[];
};

export type TAddToDataRoom = {
  parentId: string
  docType: string
  name: string
  fileType: string
  categoryId: string
  documentId: string
}

export type TDocumentRecord = {
  name: string;
  companyId: string;
  createdAt: Date;
  description: string;
  docType: string;
  id: string;
  responsibleDepartment: string;
  updatedAt: Date;
};
