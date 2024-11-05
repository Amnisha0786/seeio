import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from 'dayjs'

import CommonFieldsForm from "../register-forms/common-fields-form";
import Modal from "@/components/modal";
import Toast from "@/components/toast";
import * as API from "@/api";
import { DOCUMENT_TYPE, metadataSchemaDocTypeMap } from "../registers-validation-schemas";
import { getMetaData } from "./form-initial-values";
import { DOCUMENT_STATUS_TYPES } from "@/models";

const AddDocumentModal = forwardRef(
  (
    { onSuccess, register, highestResolutionNumber }: { onSuccess: () => void; register: any, highestResolutionNumber?: number | null },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object().shape({
      name: yup.string().when("docType", {
        is: (docType: string) =>
          docType === DOCUMENT_TYPE.RESOLUTION ||
          docType === DOCUMENT_TYPE.RESOLUTION_DOCUMENT || docType === DOCUMENT_TYPE.RESOLUTION_DOCTYPE,
        then: () => yup.string().optional(),
        otherwise: () => yup.string().required("Name is required."),
      }),
      additionalFileNames: yup.array().of(yup.string()).when("docType", {
        is: (docType: string) =>
          docType === DOCUMENT_TYPE.SUPPLIER ||
          docType === DOCUMENT_TYPE.SUPPLIER_DOCUMENT ||
          docType === DOCUMENT_TYPE.INCIDENT ||
          docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT ||
          docType === DOCUMENT_TYPE.COMPLAINT ||
          docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT,
        then: () => yup.array().of(yup.string()).optional(),
        otherwise: () => yup.array().of(yup.string()).required("File is required."),
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
      metadata: metadataSchemaDocTypeMap[register?.docType],
    });

    const [metadata, setMetadata] = useState({});

    const initialMetaData = {
      name: "",
      description: "",
      fileName: "",
      parentId: "",
      additionalFileNames: [],
      docType: register?.docType || "",
      metadata: {
        ...metadata,
      },
    };

    const formik = useFormik({
      validateOnChange: false,
      validateOnMount: false,
      initialValues: initialMetaData,
      validationSchema,
      onSubmit: async (values: any): Promise<void> => {
        setLoading(true);
        try {
          if (register && register.id && register?.companyId) {
            if (register.docType === DOCUMENT_TYPE.SUPPLIER) {
              values["docType"] = DOCUMENT_TYPE.SUPPLIER_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.COMPLAINT) {
              values["docType"] = DOCUMENT_TYPE.COMPLAINT_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.POLICIES) {
              values["docType"] = DOCUMENT_TYPE.POLICIES_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.CONTRACT) {
              values["docType"] = DOCUMENT_TYPE.CONTRACT_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.RESOLUTION) {
              values["docType"] = DOCUMENT_TYPE.RESOLUTION_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.INSURANCE) {
              values["docType"] = DOCUMENT_TYPE.INSURANCE_DOCUMENT;
            } else if (register.docType === DOCUMENT_TYPE.GOVERNING) {
              values["docType"] = DOCUMENT_TYPE.GOVERNING_DOCUMENT;
            } else {
              values["docType"] = DOCUMENT_TYPE.INCIDENT_DOCUMENT;
            }

            values["parentId"] = register.id;

            if (register.docType !== DOCUMENT_TYPE.GOVERNING && register.docType !== DOCUMENT_TYPE.RESOLUTION
              && register.docType !== DOCUMENT_TYPE.SUPPLIER && register.docType !== DOCUMENT_TYPE.CONTRACT
              && register.docType !== DOCUMENT_TYPE.POLICIES && register.docType !== DOCUMENT_TYPE.INSURANCE_DOCUMENT) {
              if (!values?.metadata?.documentDate && !values?.metadata?.date) {
                values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.MISSING;
                values.metadata.statusColor = "red";
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

            if (
              register.docType === DOCUMENT_TYPE.COMPLAINT ||
              register.docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT ||
              register.docType === DOCUMENT_TYPE.INCIDENT ||
              register.docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT
            ) {

              if (values.metadata?.updates?.length) {
                values.metadata?.updates?.forEach((update: any, index: number) => {
                  values.metadata.updates[index].fileBinary = update.fileBinary?.[0]
                  values.metadata.updates[index].fileName = update.fileName?.[0]
                })
              }
            }

            await API.createRegister(values, register.id, register.companyId);
            Toast.success("Create Document Successfully");
            onSuccess();
            formik.resetForm();
            setOpen(false);
          }
        } catch (err: any) {
          Toast.error(err.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      },
    });

    useEffect(() => {
      if (register?.docType) {
        setMetadata(getMetaData(register?.docType));
      }
    }, [register?.docType]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          formik.setValues({
            parentId: "",
            name: "",
            description: "",
            additionalFileNames: [],
            fileName: "",
            docType: register?.docType || "",
            metadata: {
              ...getMetaData(register?.docType),
            },
          });
          setOpen(true);
        },
        close: () => {
          setOpen(false);
          formik.resetForm();
        },
      }),
      [formik]
    );

    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)}>
        <CommonFieldsForm
          ref={ref}
          type={register ? register.docType : ""}
          formik={formik}
          loading={loading}
          highestResolutionNumber={highestResolutionNumber}
        />
      </Modal>
    );
  }
);

AddDocumentModal.displayName = "AddDocumentModal";

export default AddDocumentModal;
