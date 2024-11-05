import { SUPPLIER_STATUS } from "@/app/(protected)/documents/registers/register-forms/approved-supplier-form";
import { CONTRACT_STATUS_TYPES } from "@/app/(protected)/documents/registers/register-forms/contract-document-form";
import { GOVERNING_STATUS_TYPES } from "@/app/(protected)/documents/registers/register-forms/governing-document-form"
import { INSURANCE_STATUS } from "@/app/(protected)/documents/registers/register-forms/insurances-document-form";
import { POLICIES_STATUS_TYPES } from "@/app/(protected)/documents/registers/register-forms/policies-procedures-form";
import { DOCUMENT_TYPE } from "@/app/(protected)/documents/registers/registers-validation-schemas"
import { DOCUMENT_STATUS_TYPES, TStorageObject } from "@/models"

import dayjs from "dayjs"

export type StatusDetail = {
  color: string;
  label: string
}

export const getStatusDetails = (
  record: TStorageObject
): StatusDetail => {
  switch (record?.docType) {
  case DOCUMENT_TYPE.GOVERNING_DOCUMENT:
    if (record?.status) {
      if (
        record?.status === GOVERNING_STATUS_TYPES.SHAREHOLDER_APPROVAL_MISSING || 
        record?.status === GOVERNING_STATUS_TYPES.REVIEW_DUE || 
        record?.status === GOVERNING_STATUS_TYPES.PENDING_APPROVAL
      ) {
        
        return { color: "yellow", label: record?.status }
      } else if (record?.status === GOVERNING_STATUS_TYPES.STATIC_DOCUMENT || record?.status === GOVERNING_STATUS_TYPES.ARCHIVE) {
        return { color: "white", label: record?.status }
      } else if ( record?.status === GOVERNING_STATUS_TYPES.BOARD_APPROVAL_PENDING || record?.status === GOVERNING_STATUS_TYPES.REVIEW_OVERDUE) {
        return { color: "red", label: record?.status }
      } else {
        return { color: "green", label: record?.status }
      }
    }
  case DOCUMENT_TYPE.SUPPLIER_DOCUMENT:
    if (record?.status) {
      if (record?.status === SUPPLIER_STATUS.NOT_REQUIRED) {
        return { color: "white", label: record?.status }
      } else if (record?.status === SUPPLIER_STATUS.PENDING_APPROVAL || record?.status === SUPPLIER_STATUS.REVIEW_OVERDUE) {
        return { color: "red", label: record?.status }
      } else if (record?.status === SUPPLIER_STATUS.REVIEW_DUE) {
        return { color: "yellow", label: record?.status }
      } else {
        return { color: "green", label: record?.status }
      }
    }
  case DOCUMENT_TYPE.CONTRACT_DOCUMENT:
    if (record?.status) {
      if (record?.status === CONTRACT_STATUS_TYPES.TERMINATED || record?.status === CONTRACT_STATUS_TYPES.STATIC) {
        return { color: "white", label: record?.status }
      } else if (record?.status === CONTRACT_STATUS_TYPES.REVIEW_OVERDUE) {
        return { color: "red", label: record?.status }
      } else if (record?.status === CONTRACT_STATUS_TYPES.REVIEW_DUE) {
        return { color: "yellow", label: record?.status }
      } else {
        return { color: "green", label: record?.status }
      }
    }

  case DOCUMENT_TYPE.POLICIES_DOCUMENT:
    if (record?.status) {
      if (record?.status === POLICIES_STATUS_TYPES.NOT_IN_FORCE) {
        return { color: "white", label: record?.status }
      } else if (record?.status === POLICIES_STATUS_TYPES.PENDING || record?.status === POLICIES_STATUS_TYPES.REVIEW_DUE) {
        return { color: "yellow", label: record?.status }
      } else if (record?.status === POLICIES_STATUS_TYPES.REVIEW_OVERDUE) {
        return { color: "red", label: record?.status }
      } else {
        return { color: "green", label: record?.status }
      }
    }

  case DOCUMENT_TYPE.INSURANCE_DOCUMENT:
    if (record?.status) {
      if (record?.status === INSURANCE_STATUS.MISSING) {
        return { color: "red", label: record?.status }
      } else if (record?.status === INSURANCE_STATUS.PROPOSED || record?.status === INSURANCE_STATUS.ON_RISK ) {
        return { color: "green", label: record?.status }
      } else if(record?.status === INSURANCE_STATUS.RENEWAL_DUE){
        return { color: "yellow", label: record?.status }
      }
      else if(record?.status === INSURANCE_STATUS.OVER_DUE){
        return { color: "red", label: record?.status }
      } else {
        return { color: "white", label: record?.status }
      }
    }

  default:
    if (record?.statusLabel === DOCUMENT_STATUS_TYPES.REVIEW_DUE) {
      return { color: "yellow", label: record.statusLabel }
    } else if (record?.statusLabel === DOCUMENT_STATUS_TYPES.UP_TO_DATE) {
      return { color: "green", label: record.statusLabel }
    } else {
      return { color: "red", label: record.statusLabel }
    }
  }
}
