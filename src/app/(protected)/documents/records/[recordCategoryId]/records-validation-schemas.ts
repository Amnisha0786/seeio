import * as yup from 'yup';

export enum DOCUMENT_TYPE {
  REGULATION = 'REGULATION_COMPLIANCE',
  REGULATION_COMPLIANCE = 'Regulation & Compliance',
  DEAL_BIBLES = 'DEAL_BIBLES',
  DEAL_BIBLES_DOCUMENT = 'Deal Bibles',
  REAL_ESTATE = 'REAL_ESTATE',
  REAL_ESTATE_DOCUMENT = 'Real Estate',
  HR_PERSONNEL = 'HR_PERSONNEL',
  HR_PERSONNEL_DOCUMENT = 'HR & Personnel',
  PRODUCTS = 'PRODUCTS_SERVICES',
  PRODUCTS_DOCUMENT = 'Products & Services',
  FINANCE = 'FINANCE_DOCUMENT',
  FINANCE_DOCUMENT = 'Finance Document',
  BUSINESS = 'BUSINESS_PLANNING',
  BUSINESS_PLANNING = 'Business Planning',
  OTHER = 'OTHER',
  OTHER_DOCUMENT = 'Other',
}
export type reviewFrequency = {
  label: string;
  value: string;
};

export const hrPersonnelSchema = yup.object({
  needReview: yup.boolean().optional(),
  reviewFrequency: yup.string().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review frequency  is required.'),
  }),
  reviewDate: yup.date().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review Date  is required.'),
  }),
  owner: yup.string().required("Owner is required."),
  active: yup.boolean().optional(),
  date: yup.date().required('Date is required'),
  lastReview: yup.date().optional(),
  notes: yup.string().optional(),
  needsReview: yup.boolean(),
});

export const sharedSchema = yup.object({
  needReview: yup.boolean().optional(),
  reviewFrequency: yup.string().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review frequency  is required.'),
  }),
  reviewDate: yup.date().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review Date  is required.'),
  }),
  active: yup.boolean().optional(),
  date: yup.date().required('Date is required'),
  lastReview: yup.date().optional(),
  notes: yup.string().optional(),
  needsReview: yup.boolean(),
});

export const businessSchema = yup.object({
  needReview: yup.boolean().optional(),
  reviewFrequency: yup.string().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review frequency  is required.'),
  }),
  reviewDate: yup.date().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review Date  is required.'),
  }),
  active: yup.boolean().optional(),
  lastReview: yup.date().optional(),
  notes: yup.string().optional(),
  needsReview: yup.boolean(),
});

export const resolutionSchema = yup.object({
  documentDate: yup.date().required('Document Date is required.'),
  reviewDate: yup.date().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review Date  is required.'),
  }),
  commencementDate: yup.date().optional(),
  expiryDate: yup.date().optional(),
  owner: yup.string().required('Owner is required.'),
  referenceNumber: yup.string().optional(),
  noLongerRequired: yup.boolean(),
  notes: yup.string().optional(),
  needReview: yup.boolean().optional(),
  lastReview: yup.date().optional(),
  reviewFrequency: yup.string(),
  secondReferenceNumber: yup.string().optional(),
});

export const biblesSchema = yup.object({
  date: yup.date().required('Date is required.'),
});

const otherSchema = yup.object({
  needReview: yup.boolean().required('Needs Review is required.'),
  reviewFrequency: yup.string().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review frequency is required.'),
  }),
  reviewDate: yup.date().when('needReview', {
    is: (needReview: boolean) => needReview === true,
    then: () => yup.string().required('Review Date is required.'),
  }),
  active: yup.boolean().required('Active field is required.'),
  documentDate: yup.date().required('Document Date is required.'),
  lastReview: yup.date().optional(),
  notes: yup.string().optional(),
});

export const metadataSchemaDocTypeMap: any = {
  [DOCUMENT_TYPE.REAL_ESTATE]: sharedSchema,
  [DOCUMENT_TYPE.REAL_ESTATE_DOCUMENT]: sharedSchema,
  [DOCUMENT_TYPE.HR_PERSONNEL]: hrPersonnelSchema,
  [DOCUMENT_TYPE.HR_PERSONNEL_DOCUMENT]: hrPersonnelSchema,
  [DOCUMENT_TYPE.PRODUCTS]: sharedSchema,
  [DOCUMENT_TYPE.PRODUCTS_DOCUMENT]: sharedSchema,
  [DOCUMENT_TYPE.BUSINESS]: businessSchema,
  [DOCUMENT_TYPE.BUSINESS_PLANNING]: businessSchema,
  [DOCUMENT_TYPE.DEAL_BIBLES]: biblesSchema,
  [DOCUMENT_TYPE.DEAL_BIBLES_DOCUMENT]: biblesSchema,
  [DOCUMENT_TYPE.OTHER]: otherSchema,
  [DOCUMENT_TYPE.OTHER_DOCUMENT]: otherSchema,
  [DOCUMENT_TYPE.FINANCE]: resolutionSchema,
  [DOCUMENT_TYPE.FINANCE_DOCUMENT]: resolutionSchema,
  [DOCUMENT_TYPE.REGULATION]: resolutionSchema,
  [DOCUMENT_TYPE.REGULATION_COMPLIANCE]: resolutionSchema,
};
