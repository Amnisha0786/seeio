import { ContentState } from 'draft-js';

export interface TRegister {
  name: string;
  id: string;
  docType: string;
  description: string;
}

export interface TAddRegisterModal {
  onSuccess?: () => void;
  handleDocumentUpdate?: (data: any, calback: () => void) => void;
  load?: boolean;
  edit: boolean;
}

export interface Update {
  id?: string
  dateOfAcknowledgement: string
  fileBinary?: string
  fileName: string
  fileUrl?: string
  notes: string
}

export type RegistersMetadata = {
  status?: string;
  circulationDate?: string;
  resolutionNumber?: string;
  companiesActReference?: string;
  typeOfResolution?: string;
  activity?: string;

  startDate?: string;
  expirystring?: string;
  lastReview?: string;
  nextReview?: string;
  owner?: string;
  terminated?: boolean;
  autoRenewal?: boolean;
  parties?: string;
  paymentTerms?: string;

  complaintReferenceNumber?: string;
  whoIsComplaintAbout?: string;
  result?: string;
  dateOfAcknowledgement?: string;
  dateOfResolution?: string;
  dateOfComplaint?: string;
  complainantName?: string;
  complainantEmail?: string;
  complainantPhone?: string;
  complainantAddress?: string;
  complaintDetails?: string | ContentState;
  proposedSolution?: string | ContentState;
  updates?: Update[];
  lastUpdate?: string;

  supplierType?: string;
  accountManager?: string;
  contractRenewalDate?: string;
  dateFirstApproved?: string;
  dateLastReviewed?: string;

  expiryDate?: string;
  incidentCancelled?: string;
  stakeholders?: string;
  stakeholderManagementPlan?: string;
  causeOfIncident?: string;
  lessonsLearned?: string;
};

export type TRegisterItem = {
  parentId: string;
  name: string;
  description: string | ContentState;
  fileName?: string;
  additionalFileNames?: string[]
  fileBinary?: any;
  fileType?: string;
  docType: string;
  additionalFiles?: any[]

  metadata: RegistersMetadata;
};

export type TRegisterDocumentDetails = {
  numDocuments: number;
  name?: string;
  items: TRegisterItem[];
};

export type TDocumentRegister = {
  name: string;
  companyId: string;
  createdAt: Date;
  description: string;
  docType: string;
  id: string;
  responsibleDepartment: string;
  updatedAt: Date;
};
