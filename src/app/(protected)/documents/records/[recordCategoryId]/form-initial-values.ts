import { DOCUMENT_TYPE } from './records-validation-schemas';

export const getMetaData = (docType?: string, data?: any) => {
  let metadata;
  switch (docType) {
  case DOCUMENT_TYPE.REGULATION:
  case DOCUMENT_TYPE.REGULATION_COMPLIANCE:
  case DOCUMENT_TYPE.FINANCE:
  case DOCUMENT_TYPE.FINANCE_DOCUMENT:
    metadata = {
      documentDate: data?.documentDate
        && data?.documentDate,
      reviewDate: data?.reviewDate
        && data?.reviewDate,
      commencementDate: data?.commencementDate
        && data?.commencementDate,
      expiryDate: data?.expiryDate
        && data?.expiryDate,
      owner: data?.owner?.id || "",
      referenceNumber: data?.referenceNumber || "",
      referenceNumberLabel: data?.referenceNumberLabel || "",
      noLongerRequired: data?.noLongerRequired || false,
      notes: data?.notes || "",
      lastReview: data?.lastReview,
      reviewFrequency: data?.reviewFrequency,
      secondReferenceNumber: data?.secondReferenceNumber || "",
      secondReferenceNumberLabel: data?.secondReferenceNumberLabel || "",
      needReview: data?.needReview || false,
    };
    break;
  case DOCUMENT_TYPE.DEAL_BIBLES:
  case DOCUMENT_TYPE.DEAL_BIBLES_DOCUMENT:
    metadata = {
      date: data?.date ? data?.date : "",
      reviewFrequency: data?.reviewFrequency,
    };
    break;
  case DOCUMENT_TYPE.PRODUCTS:
  case DOCUMENT_TYPE.PRODUCTS_DOCUMENT:
  case DOCUMENT_TYPE.HR_PERSONNEL:
  case DOCUMENT_TYPE.HR_PERSONNEL_DOCUMENT:
  case DOCUMENT_TYPE.REAL_ESTATE:
  case DOCUMENT_TYPE.REAL_ESTATE_DOCUMENT:
    metadata = {
      date: data?.date ? data?.date : new Date().toISOString(),
      lastReview: data?.lastReview
        && data?.lastReview,
      needReview: data?.needReview || false,
      reviewFrequency: data?.reviewFrequency,
      reviewDate: data?.reviewDate
        && data?.reviewDate,
      active: data?.active || false,
      owner: data?.owner?.id || "",
    };
    break;

  default:
    metadata = {
      documentDate: data?.documentDate
        ? data?.documentDate
        : new Date().toISOString(),
      lastReview: data?.lastReview
        && data?.lastReview,
      needReview: data?.needReview || false,
      reviewFrequency: data?.reviewFrequency && data?.reviewFrequency,
      reviewDate: data?.reviewDate
        && data?.reviewDate,
      active: data?.active || false,
      owner: data?.owner?.id || "",
    };
    break;
  }

  return metadata;
};