import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from 'dayjs'

import Modal from "@/components/modal";
import CommonFieldsForm from "../../../register-forms/common-fields-form";
import { getMetaData } from "../../form-initial-values";
import { TRegisterItem } from "@/models/registers/register";
import {
  DOCUMENT_TYPE,
  metadataSchemaDocTypeMap,
} from "../../../registers-validation-schemas";
import { DOCUMENT_STATUS_TYPES } from "@/models";

interface IProps {
  handleDocumentUpdate: (data: any, callback: () => void) => void;
  loading: boolean;
  registerCategoryId: string;
  docType: string;
}

const EditDocumentModal = forwardRef(
  (
    { handleDocumentUpdate, loading, registerCategoryId, docType }: IProps,
    ref
  ) => {
    let DocumentType = "";
    if (docType === DOCUMENT_TYPE.SUPPLIER_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.SUPPLIER;
    } else if (docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.COMPLAINT;
    } else if (docType === DOCUMENT_TYPE.POLICIES_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.POLICIES;
    } else if (docType === DOCUMENT_TYPE.CONTRACT_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.CONTRACT;
    } else if (docType === DOCUMENT_TYPE.RESOLUTION_DOCUMENT || docType === DOCUMENT_TYPE.RESOLUTION_DOCTYPE) {
      DocumentType = DOCUMENT_TYPE.RESOLUTION;
    } else if (docType === DOCUMENT_TYPE.GOVERNING_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.GOVERNING;
    } else if (docType === DOCUMENT_TYPE.INSURANCE_DOCUMENT) {
      DocumentType = DOCUMENT_TYPE.INSURANCE;
    } else {
      DocumentType = DOCUMENT_TYPE.INCIDENT;
    }

    const validationSchema = yup.object().shape({
      name: yup.string().when("docType", {
        is: (docType: string) =>
          docType === DOCUMENT_TYPE.RESOLUTION ||
          docType === DOCUMENT_TYPE.RESOLUTION_DOCUMENT || docType === DOCUMENT_TYPE.RESOLUTION_DOCTYPE,
        then: () => yup.string().optional(),
        otherwise: () => yup.string().required("Name is required."),
      }),
      description: yup.string().when("docType", {
        is: (docType: string) =>
          docType === DOCUMENT_TYPE.INCIDENT ||
          docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT ||
          docType === DOCUMENT_TYPE.COMPLAINT ||
          docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT,
        then: () => yup
          .string()
          .test(
            "has text",
            "Description is required",
            (value: any) => !value || !value.includes(`"text":""`)
          )
          .required("Description is required"),
        otherwise: () => yup.string().optional(),
      }),

      metadata: metadataSchemaDocTypeMap[DocumentType],
    });

    const [open, setOpen] = useState(false);

    const initialMetaData = {
      id: "",
      registerCategoryId: registerCategoryId || "",
      parentId: registerCategoryId || "",
      name: "",
      description: "",
      fileName: "",
      additionalFiles: [],
      docType: docType || "",
      metadata: {},
    };

    const formik = useFormik<TRegisterItem>({
      validateOnChange: false,
      initialValues: initialMetaData,
      validationSchema,
      onSubmit: async (values: any): Promise<void> => {
        if (docType !== DOCUMENT_TYPE.GOVERNING_DOCUMENT
          && docType !== DOCUMENT_TYPE.RESOLUTION_DOCTYPE && docType !== DOCUMENT_TYPE.RESOLUTION_DOCUMENT
          && docType !== DOCUMENT_TYPE.SUPPLIER_DOCUMENT && docType !== DOCUMENT_TYPE.CONTRACT_DOCUMENT
          && docType !== DOCUMENT_TYPE.POLICIES_DOCUMENT && docType !== DOCUMENT_TYPE.INSURANCE_DOCUMENT) {
          if (!values?.metadata?.documentDate && !values?.metadata?.date) {
            values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.MISSING;
            values.metadata.statusColor = "red";
          } else if (values?.metadata?.reviewDate && dayjs(values?.metadata?.reviewDate).isBefore(dayjs())) {
            values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.OVERDUE
            values.metadata.statusColor = "red";
          } else if (values?.metadata?.reviewDate && (dayjs(values?.metadata?.reviewDate).diff(dayjs(), 'days') <= 30)) {
            values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.REVIEW_DUE
            values.metadata.statusColor = "yellow";
          } else {
            values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.UP_TO_DATE
            values.metadata.statusColor = "green";
          }
        }


        if (
          docType === DOCUMENT_TYPE.COMPLAINT ||
          docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT ||
          docType === DOCUMENT_TYPE.INCIDENT ||
          docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT
        ) {

          if (values.metadata?.updates?.length) {
            values.metadata?.updates?.forEach((update: any, index: number) => {
              if (Array.isArray(values.metadata.updates[index].fileName)) {
                values.metadata.updates[index].fileBinary = update.fileBinary?.[0]
                values.metadata.updates[index].fileName = update.fileName?.[0]
              }
            })
          }
        }

        handleDocumentUpdate(values, () => setOpen(false));
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        open: (data: TRegisterItem) => {
          formik.setValues({
            name: data?.name || "",
            description: data?.description || "",
            fileName: data?.fileName || "",
            additionalFiles: data?.additionalFiles,
            fileType: data?.fileType || "",
            docType: data?.docType || "",
            parentId: registerCategoryId || "",
            metadata: {
              ...getMetaData(data?.docType, data),
            },
          });
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );

    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)}>
        <CommonFieldsForm
          ref={ref}
          type={docType || ""}
          formik={formik}
          loading={loading}
          isEdit={true}
        />
      </Modal>
    );
  }
);

EditDocumentModal.displayName = "EditDocumentModal";

export default EditDocumentModal;
