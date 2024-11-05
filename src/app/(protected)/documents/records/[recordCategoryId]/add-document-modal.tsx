import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from 'dayjs'

import Modal from "@/components/modal";
import Toast from "@/components/toast";
import * as API from "@/api";
import CommonFieldsForm from "../records-forms/common-fields-form";
import { DOCUMENT_STATUS_TYPES, REGULATION_COMPLIANCE_STATUS_TYPE, TDocumentRecord } from "@/models";
import { getMetaData } from "./form-initial-values";
import { metadataSchemaDocTypeMap, DOCUMENT_TYPE } from "./records-validation-schemas";

type TForm = {
  name: string;
  fileName?: string;
  parentId: string;
  description: string;
  docType: string;
  recordCategoryId: string;
  metadata: {
    needReview?: boolean;
    active?: boolean;
    date?: string | Date;
    reviewDate?: string | Date;
    lastReview?: string | Date;
    notes?: string;
    documentDate?: string | Date;
    commencementDate?: string;
    expiryDate?: string | Date;
    owner?: string;
    referenceNumber?: string;
    referenceNumberLabel?: string;
    statusLabel?: string;
    statusColor?: string;
    noLongerRequired?: boolean
  };
};

const AddDocumentModal = forwardRef(
  (
    {
      onSuccess,
      record,
    }: { onSuccess: () => void; record: TDocumentRecord | null },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState({});

    const validationSchema = yup.object().shape({
      name: yup.string().required('Name is required.'),
      additionalFileNames: yup.array().of(yup.string()).when("docType", {
        is: (docType: string) =>
          docType === DOCUMENT_TYPE.REGULATION ||
          docType === DOCUMENT_TYPE.REGULATION_COMPLIANCE ||
          docType === DOCUMENT_TYPE.FINANCE ||
          docType === DOCUMENT_TYPE.FINANCE_DOCUMENT,
        then: () => yup.array().of(yup.string()).optional(),
        otherwise: () => yup.array().of(yup.string()).required("File is required."),
      }),
      metadata: record?.docType && metadataSchemaDocTypeMap[record?.docType],
    });

    const initialMetaData = {
      name: "",
      fileName: "",
      parentId: record ? record.id : "",
      description: "",
      docType: record ? record.docType : "",
      recordCategoryId: record ? record.id : "",
      metadata: {
        ...metadata,
      },
    };

    const formik = useFormik<TForm>({
      validateOnChange: false,
      initialValues: initialMetaData,
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        setLoading(true);

        try {
          if (record && record.id && record?.companyId) {
            if (record.docType === DOCUMENT_TYPE.REGULATION) {
              values["docType"] = DOCUMENT_TYPE.REGULATION_COMPLIANCE;
              values.metadata.referenceNumberLabel = values.name 
            } else if (record.docType === DOCUMENT_TYPE.DEAL_BIBLES) {
              values["docType"] = DOCUMENT_TYPE.DEAL_BIBLES_DOCUMENT;
            } else if (record.docType === DOCUMENT_TYPE.REAL_ESTATE) {
              values["docType"] = DOCUMENT_TYPE.REAL_ESTATE_DOCUMENT;
            } else if (record.docType === DOCUMENT_TYPE.HR_PERSONNEL) {
              values["docType"] = DOCUMENT_TYPE.HR_PERSONNEL_DOCUMENT;
            } else if (record.docType === DOCUMENT_TYPE.PRODUCTS) {
              values["docType"] = DOCUMENT_TYPE.PRODUCTS_DOCUMENT;
            } else if (record.docType === DOCUMENT_TYPE.FINANCE) {
              values["docType"] = DOCUMENT_TYPE.FINANCE_DOCUMENT;
              values.metadata.referenceNumberLabel = values.name 
            } else if (record.docType === DOCUMENT_TYPE.BUSINESS) {
              values["docType"] = DOCUMENT_TYPE.BUSINESS_PLANNING;
            } else {
              values["docType"] = DOCUMENT_TYPE.OTHER_DOCUMENT;
            }

            values["parentId"] = record.id;

            if (values?.fileName === "") delete values?.fileName
            if (record.docType === DOCUMENT_TYPE.REGULATION) {
              if (values?.metadata?.noLongerRequired) {
                values.metadata.statusLabel = REGULATION_COMPLIANCE_STATUS_TYPE.STATIC;
                values.metadata.statusColor = "white"
              } else if (values?.metadata?.reviewDate && dayjs(values?.metadata?.reviewDate).isBefore(dayjs())) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.OVERDUE
                values.metadata.statusColor = "red"
              } else if (values?.metadata?.needReview && values?.metadata?.reviewDate
                && (Math.abs(dayjs(values?.metadata?.reviewDate).diff(dayjs(), 'day')) <= 60)) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.REVIEW_DUE
                values.metadata.statusColor = "yellow"
              } else {
                values.metadata.statusLabel = REGULATION_COMPLIANCE_STATUS_TYPE.CURRENT
                values.metadata.statusColor = "green"
              }
            } else {
              if (!values?.metadata?.documentDate && !values?.metadata?.date) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.MISSING;
                values.metadata.statusColor = "red"
              } else if (values?.metadata?.reviewDate && dayjs(values?.metadata?.reviewDate).isBefore(dayjs())) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.OVERDUE
                values.metadata.statusColor = "red"
              } else if (values?.metadata?.reviewDate && (dayjs(values?.metadata?.reviewDate).diff(dayjs(), 'days') <= 30)) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.REVIEW_DUE
                values.metadata.statusColor = "yellow"
              } else {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.UP_TO_DATE
                values.metadata.statusColor = "green"
              }
            }

            await API.addRecordDocument(record.companyId, record.id, values);
            Toast.success("Create Document Successfully");
            onSuccess();
            setOpen(false);
          }
        } catch (err: any) {
          Toast.error(err?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
    });

    useEffect(() => {
      if (record?.docType) {
        setMetadata(getMetaData(record?.docType));
      }
    }, [record?.docType]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          formik.setValues({
            name: "",
            fileName: "",
            parentId: record?.id || "",
            description: "",
            docType: record ? record.docType : "",
            recordCategoryId: record ? record?.id : "",
            metadata: {
              ...getMetaData(record?.docType),
            },
          });
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );

    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)} className="add_document">
        <CommonFieldsForm
          ref={ref}
          type={record ? record.docType : ""}
          formik={formik}
          loading={loading}
        />
      </Modal>
    );
  }
);

AddDocumentModal.displayName = "AddDocumentModal";

export default AddDocumentModal;
