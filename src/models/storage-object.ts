export type TStorageObject = {
  id: string;
  name: string;
  type: "document" | "folder" | string;
  description?: string;
  dateCreated: string;
  nextReview?: string;
  expiryDate?: string
  startDate?: string
  status: string;
  fileData: { key: string };
  docType?: string
  resolutionNumber?: string
  statusLabel: string;
  secondReferenceNumber?: string
  referenceNumber?: string
  reviewDate?: string
  registerCategoryId?: string
  recordCategoryId?: string
  circulated?: boolean
  boardApprovalDate?: string
  circulationDate?: string
  documentDate?: string
  needReview?: boolean
  lastReview?: string
  dateApproved?: string
  parentId?: string
};
