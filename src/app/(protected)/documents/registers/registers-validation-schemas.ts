import * as yup from "yup";
import { BOARD_APPROVAL_REQUIRED } from "./register-forms/governing-document-form";
import { REVIEW_PROCESS_TYPES } from "./register-forms/contract-document-form";

export enum DOCUMENT_TYPE {
  RESOLUTION = "RESOLUTIONS",
  RESOLUTION_DOCUMENT = "Resolutions",
  RESOLUTION_DOCTYPE = "Resolutions Register",
  CONTRACT = "CONTRACTS",
  CONTRACT_DOCUMENT = "Contracts",
  POLICIES = "POLICIES_AND_PROCEDURES",
  POLICIES_DOCUMENT = "Policies and Procedures",
  COMPLAINT = "COMPLAINTS",
  COMPLAINT_DOCUMENT = "Complaints",
  INSURANCE = "INSURANCES",
  INSURANCE_DOCUMENT = "Insurances",
  SUPPLIER = "APPROVED_SUPPLIERS_AND_ADVISERS",
  SUPPLIER_DOCUMENT = "Approved Suppliers and Advisers",
  INCIDENT = "INCIDENTS",
  INCIDENT_DOCUMENT = "Incident",
  GOVERNING = "GOVERNING_DOCUMENTS",
  GOVERNING_DOCUMENT = "Governing Documents",
}

export enum RESOLUTION_STATUS {
  CANCELLED = "Cancelled",
  PENDING_BOARD_APPROVAL = "Pending board approval",
  PENDING = "Filing pending",
  OVERDUE = "Filing overdue",
  PASSED = "Passed",
  CIRCULATED = "Circulated",
  DEFUNCT = "Defunct",
  DRAFT = "Draft",
  APPROVED_FOR_CIRCULATION = "Approved for circulation"
}

export const resolutionSchema = yup.object({
  name: yup.string().required("Name is required."),
  approved: yup.boolean().optional(),
  circulated: yup.boolean().optional(),
  companiesHouse: yup.mixed().oneOf(['Not required', 'Filed', 'Pending']).required('Company House Status is required.'),
  dateApproved: yup.date().when("approved", {
    is: (approved: boolean) => approved,
    then: () =>
      yup
        .date()
        .required("Passed Date is required.")
  }),
  approvalDeadline: yup.date().when("circulated", {
    is: (circulated: boolean) => circulated,
    then: () =>
      yup
        .date()
        .required("Approval Deadline Date is required.")
  }),
  dateFiled: yup.string().when("companiesHouse", {
    is: (companiesHouse: string) => companiesHouse == 'Filed',
    then: () =>
      yup
        .date()
        .required("Company House Filing Date is required.")
  }),
  boardApprovalDate: yup.date().when("circulated", {
    is: (circulated: boolean) => circulated,
    then: () =>
      yup
        .date()
        .required("Board Approval Date is required.")
  }),
  circulationDate: yup.date().optional(),
  resolutionNumber: yup.string().required("Resolution Number is required."),
  typeOfResolution: yup.string().required("Type of Resolution is required."),
});

export const governingSchema = yup.object({
  needReview: yup.boolean().optional(),
  lastReview: yup.date().optional(),
  reviewDate: yup.date().optional(),
  reviewFrequency: yup.string().when("needsReview", {
    is: (needReview: boolean) => needReview === true,
    then: () =>
      yup
        .number()
        .required("Review frequency  is required.")
  }),
  documentDate: yup.string().when("requireBoardApproval", {
    is: (requireBoardApproval: string) => requireBoardApproval === BOARD_APPROVAL_REQUIRED.NO,
    then: () =>
      yup
        .string()
        .required("Document Date is required.")
  })
});

export const contractSchema = yup.object({
  reviewProcess: yup.string().required("Review Process is required"),
  startDate: yup.date().required("Start Date is required"),
  lastReview: yup.date().optional(),
  owner: yup.string().required("Owner is required"),
  status: yup.string(),
  parties: yup.string().required("Parties is required"),
  term: yup
    .number()
    .min(1, "Term must be more than 0"),
  termDuration: yup.string().when("term", {
    is: (term: number) => term > 0,
    then: () => yup.string().required("Term Duration is required."),
  }),
  noticePeriod: yup
    .number()
    .min(1, "Notice Period must be more than 0")
  ,
  periodDuration: yup.string().when("noticePeriod", {
    is: (noticePeriod: number) => noticePeriod > 0,
    then: () => yup.string().required("Period Duration is required."),
  }),
  reviewFrequency: yup.number().when("reviewProcess", {
    is: (reviewProcess: string) => reviewProcess && reviewProcess === REVIEW_PROCESS_TYPES.NEEDS_REVIEW,
    then: () =>
      yup
        .number()
        .min(1, "Review Frequency must be more than 0")
        .required("Review Frequency is required."),
  }),
});
export const policiesSchema = yup.object({
  owner: yup.string().required("Owner is required"),
  startDate: yup.date().required("Start Date is required"),
  lastReview: yup.date().optional(),
  reviewFrequency: yup
    .number()
    .required("Review Frequency is required")
});
export const complaintSchema = yup.object({
  complaintReferenceNumber: yup
    .string()
    .required("Complaint Reference Number is required"),
  whoIsComplaintAbout: yup
    .string()
    .required("Who Is Complaint About is required"),
  result: yup.string().required("Result is required"),
  dateOfAcknowledgement: yup
    .date()
    .required("Date Of Acknowledgement is required"),
  dateOfResolution: yup.date(),
  dateOfComplaint: yup.date().required("Date Of Complaint is required"),
  complainantName: yup.string().required("Complainant Name is required"),
  complainantEmail: yup.string().required("Complainant Email is required"),
  complainantPhone: yup.string().optional(),
  complainantAddress: yup.string().optional(),
  owner: yup.string().required("Owner is required"),
  complaintDetails: yup.string().required("Complaint Details is required"),
  proposedSolution: yup.string().optional(),
});

export const insuranceSchema = yup.object({
  startDate: yup.date().required("Start Date is required"),
  expiryDate: yup.date().required("Expiry Date is required"),
  lastReview: yup.date().optional(),
  nextReview: yup.date().required("Next Review is required"),
  owner: yup.string().required("Owner is required"),
  cancelled: yup.boolean().required("Cancelled is required"),
});
export const supplierSchema = yup.object({
  supplierType: yup.string().required("Supplier Type is required"),
  reviewProcess: yup.string().required("Review Process is required"),
  noticePeriod: yup.number().when("reviewProcess", {
    is: (reviewProcess: string) => reviewProcess === "subject to contract",
    then: () => yup.number()
      .min(1, "Notice Period must be more than 0").required("Notice Period is required."),
  }),
  contractRenewalDate: yup.string().when("reviewProcess", {
    is: (reviewProcess: string) => reviewProcess === "subject to contract",
    then: () => yup.string().required("Contract Renewal Date is required."),
  }),
  proposedSolution: yup.string().optional(),
  owner: yup.string().required("Owner is required."),
  other: yup.string().when("supplierType", {
    is: (supplierType: string) => supplierType === "Other",
    then: () => yup.string().required("Other field is required."),
  }),
  reviewMonth: yup.string().when("specificReviewCheckbox", {
    is: (specificReviewCheckbox: boolean) => specificReviewCheckbox,
    then: () => yup.string().required("Review Month is required."),
  }),
  paymentTerms: yup
    .number()
    .min(1, "Payment Terms must be more than 0")
});

export const incidentSchema = yup.object({
  owner: yup.string().required("Owner is required"),
  startDate: yup.date().required("Start Date is required"),
  expiryDate: yup.date().required("Expiry Date is required"),
  incidentCancelled: yup
    .mixed()
    .oneOf(["Resolved", "Ongoing"])
    .required("Incident Cancelled is required"),
  stakeholders: yup.string().required("Stakeholders is required"),
  stakeholderManagementPlan: yup
    .string()
    .required("Stakeholder Management Plan is required"),
  causeOfIncident: yup.string().required("Cause Of Incident is required"),
  lessonsLearned: yup.string().required("Lessons Learned is required"),
});

export const metadataSchemaDocTypeMap: any = {
  [DOCUMENT_TYPE.RESOLUTION]: resolutionSchema,
  [DOCUMENT_TYPE.CONTRACT]: contractSchema,
  [DOCUMENT_TYPE.POLICIES]: policiesSchema,
  [DOCUMENT_TYPE.COMPLAINT]: complaintSchema,
  [DOCUMENT_TYPE.INSURANCE]: insuranceSchema,
  [DOCUMENT_TYPE.SUPPLIER]: supplierSchema,
  [DOCUMENT_TYPE.INCIDENT]: incidentSchema,
  [DOCUMENT_TYPE.GOVERNING]: governingSchema,
};
