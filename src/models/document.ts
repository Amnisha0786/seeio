export type TDocument = {
  id: string;
  name: string;
  lastEdited: string;
  review: string;
  notes: string;
  documentUrl: string;
};

export enum DOCUMENT_STATUS_TYPES {
  MISSING = 'Missing',
  OVERDUE = 'Overdue',
  REVIEW_DUE = 'Review due',
  UP_TO_DATE = 'Up to date'
}
export enum FOLDER_STATUS_TYPES {
  ATTENTION = 'Needs attention',
  UPCOMING_REVIEW = 'Upcoming review',
  UP_TO_DATE = 'Up to date'
}

export enum REGULATION_COMPLIANCE_STATUS_TYPE {
  STATIC = 'Archive',
  OVERDUE = 'Overdue',
  REVIEW_DUE = 'Review due',
  CURRENT = 'Current'
}

export type TPolicy = {
  id?: string,
  createdAt?: string,
  title: string,
  fileData?: {
    dateUploaded?: string,
    fileSize?: number,
    fileType?: string,
    key?: string,
  },
  fileUrl?: string,
  fileName?: string,
  fileType?: string,
  fileSize?: string,
  updatedAt?: string,
  type?: string,
  subscriptionLevel?: string,
  description: string,
  status?: string,
}
