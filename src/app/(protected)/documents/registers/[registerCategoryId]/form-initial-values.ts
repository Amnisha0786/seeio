import { DRAFT_EDITOR_DEFAULT_TEXT } from "@/constants";

import { DOCUMENT_TYPE } from "../registers-validation-schemas";
import { BOARD_APPROVAL_REQUIRED } from "../register-forms/governing-document-form";

export const getMetaData = (docType: string, data?: any) => {
  let metadata;
  switch (docType) {
  case DOCUMENT_TYPE.GOVERNING:
  case DOCUMENT_TYPE.GOVERNING_DOCUMENT:
    metadata = {
      needReview: data?.needReview || false,
      active: data?.active || false,
      lastReview: data?.lastReview && data?.lastReview,
      notes: data?.notes || "",
      reviewFrequency: data?.reviewFrequency && data.reviewFrequency,
      reviewDate: data?.reviewDate && data?.reviewDate,
      frequencyDuration: data?.frequencyDuration,
      documentDate: data?.documentDate,
      requireBoardApproval: data ? data?.requireBoardApproval : BOARD_APPROVAL_REQUIRED.YES,
      boardApprovalDate: data?.boardApprovalDate,
      requireShareholderApproval: data?.requireShareholderApproval,
      resolutionsRegister: data?.resolutionsRegister
    };
    break;

  case DOCUMENT_TYPE.SUPPLIER:
  case DOCUMENT_TYPE.SUPPLIER_DOCUMENT:
    metadata = {
      supplierType: data?.supplierType || "",
      accountManager: data?.accountManager || "",
      contractRenewalDate:
          data?.contractRenewalDate && data?.contractRenewalDate,
      dateFirstApproved: data?.dateFirstApproved && data?.dateFirstApproved,
      dateLastReviewed: data?.dateLastReviewed && data?.dateLastReviewed,
      reviewDate: data?.reviewDate && data?.reviewDate,
      noticePeriod: data?.noticePeriod && data.noticePeriod,
      reviewProcess: data?.reviewProcess && data.reviewProcess,
      notes: data?.notes || "",
      status: data?.status || "",
      statusColor: data?.statusColor,
      other: data?.other && data?.other,
      owner: data?.owner?.id || "",
      paymentTerms: data?.paymentTerms,
      specificReviewCheckbox: data?.specificReviewCheckbox,
      reviewMonth: data?.reviewMonth && data?.reviewMonth,
      currentlyRequired: data?.currentlyRequired && data?.currentlyRequired,
      reviewFrequency: data?.reviewFrequency && data?.reviewFrequency,
      frequencyDuration: data?.frequencyDuration && data?.frequencyDuration
    };
    break;

  case DOCUMENT_TYPE.INSURANCE:
  case DOCUMENT_TYPE.INSURANCE_DOCUMENT:
    metadata = {
      startDate: data?.startDate && data?.startDate,
      expiryDate: data?.expiryDate && data.expiryDate,
      lastReview: data?.lastReview && data.lastReview,
      nextReview: data?.nextReview && data.nextReview,
      owner: data?.owner?.id || "",
      cancelled: data?.cancelled || false,
      status: data?.status && data?.status,
      statusColor: data?.statusColor
    };
    break;
  case DOCUMENT_TYPE.CONTRACT:
  case DOCUMENT_TYPE.CONTRACT_DOCUMENT:
    metadata = {
      startDate: data?.startDate && data?.startDate,
      expiryDate: data?.expiryDate && data?.expiryDate,
      lastReview: data?.lastReview && data?.lastReview,
      owner: data?.owner?.id || "",
      status: data?.status || "",
      statusColor: data?.statusColor,
      parties: data?.parties || "",
      term: data?.term && data.term,
      periodDuration: data?.periodDuration || "",
      noticePeriod: data?.noticePeriod && data.noticePeriod,
      reviewFrequency: data?.reviewFrequency && data?.reviewFrequency,
      termDuration: data?.termDuration && data?.termDuration,
      lastRenewalDate: data?.lastRenewalDate && data.lastRenewalDate,
      reviewDate: data?.reviewDate && data.reviewDate,
      reviewProcess: data?.reviewProcess
    };
    break;
  case DOCUMENT_TYPE.COMPLAINT:
  case DOCUMENT_TYPE.COMPLAINT_DOCUMENT:
    metadata = {
      complaintReferenceNumber: data?.complaintReferenceNumber || "",
      whoIsComplaintAbout: data?.whoIsComplaintAbout || "",
      result: data?.result || "",
      dateOfAcknowledgement: data?.dateOfAcknowledgement
        ? data?.dateOfAcknowledgement
        : new Date().toISOString(),
      dateOfResolution: data?.dateOfAcknowledgement
        ? data?.dateOfAcknowledgement
        : new Date().toISOString(),
      dateOfComplaint: data?.dateOfComplaint
        ? data?.dateOfComplaint
        : new Date().toISOString(),
      lastUpdate: data?.lastUpdate
        ? data?.lastUpdate
        : new Date().toISOString(),
      complainantName: data?.complainantName || "",
      complainantEmail: data?.complainantEmail || "",
      complainantPhone: data?.complainantPhone || "",
      complainantAddress: data?.complainantAddress || "",
      complaintDetails: data?.complaintDetails || "",
      proposedSolution: data?.proposedSolution || "",
      owner: data?.owner?.id || "",
      updates: data?.complaintUpdates || [],
    };

    break;

  case DOCUMENT_TYPE.POLICIES:
  case DOCUMENT_TYPE.POLICIES_DOCUMENT:
    metadata = {
      owner: data?.owner?.id || "",
      startDate: data?.startDate ? data?.startDate : "",
      lastReview: data?.lastReview && data?.lastReview,
      nextReview: data?.nextReview ? data?.nextReview : "",
      reviewFrequency: data?.reviewFrequency ? data?.reviewFrequency : "",
      initialApprovalDate: data?.initialApprovalDate,
      status: data?.status || "",
      statusColor: data?.statusColor,
      noLongerRequired: data?.noLongerRequired,
    };
    break;
  case DOCUMENT_TYPE.INCIDENT:
  case DOCUMENT_TYPE.INCIDENT_DOCUMENT:
    metadata = {
      owner: data?.owner?.id || "",
      startDate: data?.startDate ? data?.startDate : new Date().toISOString(),
      expiryDate: data?.expiryDate
        ? data?.expiryDate
        : new Date().toISOString(),
      incidentCancelled: data?.incidentCancelled || null,
      stakeholders: data?.stakeholders || "",
      stakeholderManagementPlan:
          data?.stakeholderManagementPlan || DRAFT_EDITOR_DEFAULT_TEXT,
      causeOfIncident: data?.causeOfIncident || DRAFT_EDITOR_DEFAULT_TEXT,
      lessonsLearned: data?.lessonsLearned || DRAFT_EDITOR_DEFAULT_TEXT,
      updates: data?.complaintUpdates || [],
    };
    break;
  case DOCUMENT_TYPE.RESOLUTION:
  case DOCUMENT_TYPE.RESOLUTION_DOCUMENT:
  case DOCUMENT_TYPE.RESOLUTION_DOCTYPE:
  default:
    metadata = {
      name: data?.name,
      status: data?.status || "",
      statusColor: data?.statusColor,
      circulated: data?.circulated || false,
      cancelled: data?.cancelled || false,
      approved: data?.approved,
      circulationDate: data?.circulationDate
          && data?.circulationDate,
      dateApproved: data?.dateApproved
          && data?.dateApproved,
      resolutionNumber: data?.resolutionNumber || "001",
      additionalResolutionNumbers: data?.additionalResolutionNumbers,
      typeOfResolution: data?.typeOfResolution || "",
      companiesActReference: data?.companiesActReference,
      boardApprovalDate: data?.boardApprovalDate,
      notes: data?.notes,
      approvalDeadline: data?.approvalDeadline
          && data?.approvalDeadline,
      dateFiled: data?.dateFiled && data?.dateFiled,
      companiesHouse: data?.companiesHouse || "Not required",
    };
    break;
  }

  return metadata;
};
