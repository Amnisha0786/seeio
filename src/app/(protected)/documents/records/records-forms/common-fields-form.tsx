import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { Input } from "antd";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Field from "@/components/field";
import FilePicker from "@/shared/formik-file-picker";
import styles from "./page.module.scss";
import SharedDocumentsForm from "./shared-documents-forms";
import TransactionBiblesForm from "./transaction-bibles-form";
import RegulationComplianceForm from "./regulation-compliance-form";
import OtherDocumentsForm from "./other-documents-forms";
import { useSelectedAccountCompany } from "@/hooks";
import { DOCUMENT_TYPE as DOCUMENT_TYPES } from '../[recordCategoryId]/records-validation-schemas';

const DOCUMENT_TYPE = {
  REGULATION: {
    TYPE: DOCUMENT_TYPES.REGULATION,
    NAME: DOCUMENT_TYPES.REGULATION_COMPLIANCE,
    HEADING: "Regulation & Compliance Document",
  },
  TRANSACTION: {
    TYPE: DOCUMENT_TYPES.DEAL_BIBLES,
    NAME: DOCUMENT_TYPES.DEAL_BIBLES_DOCUMENT,
    HEADING: "Transaction Bibles Documents",
  },
  BUSINESS: {
    TYPE: DOCUMENT_TYPES.BUSINESS,
    NAME: DOCUMENT_TYPES.BUSINESS_PLANNING,
    HEADING: "Business Planning Document",
  },
  REAL_ESTATE: {
    TYPE: DOCUMENT_TYPES.REAL_ESTATE,
    NAME: DOCUMENT_TYPES.REAL_ESTATE_DOCUMENT,
    HEADING: "Real Estate Document",
  },
  FINANCE_DOCUMENT: {
    TYPE: DOCUMENT_TYPES.FINANCE,
    NAME: DOCUMENT_TYPES.FINANCE_DOCUMENT,
    HEADING: "Finance Document",
  },
  HR_PERSONNEL: {
    TYPE: DOCUMENT_TYPES.HR_PERSONNEL,
    NAME: DOCUMENT_TYPES.HR_PERSONNEL_DOCUMENT,
    HEADING: "HR and Personnel Document",
  },
  PRODUCT_SERVICE: {
    TYPE: DOCUMENT_TYPES.PRODUCTS,
    NAME: DOCUMENT_TYPES.PRODUCTS_DOCUMENT,
    HEADING: "Product and Service Document",
  },
  OTHER: {
    TYPE: DOCUMENT_TYPES.OTHER,
    NAME: DOCUMENT_TYPES.OTHER_DOCUMENT,
    HEADING: "Other Document"
  },
};

const CommonFieldsForm = forwardRef(
  (
    {
      type,
      formik,
      loading,
      isEdit = false,
    }: {
      type: string;
      formik: any;
      loading: boolean;
      isEdit?: boolean;
    },
    ref
  ) => {

    let formToDisplay = null,
      heading = "";

    if (
      type === DOCUMENT_TYPE.PRODUCT_SERVICE.TYPE ||
      type === DOCUMENT_TYPE.PRODUCT_SERVICE.NAME ||
      type === DOCUMENT_TYPE.HR_PERSONNEL.TYPE ||
      type === DOCUMENT_TYPE.HR_PERSONNEL.NAME ||
      type === DOCUMENT_TYPE.REAL_ESTATE.TYPE ||
      type === DOCUMENT_TYPE.REAL_ESTATE.NAME
    ) {
      formToDisplay = <SharedDocumentsForm ref={ref} formik={formik} />;
      if (type === DOCUMENT_TYPE.PRODUCT_SERVICE.TYPE || type === DOCUMENT_TYPE.PRODUCT_SERVICE.NAME) {
        heading = DOCUMENT_TYPE.PRODUCT_SERVICE.HEADING;
      } else if (type === DOCUMENT_TYPE.HR_PERSONNEL.TYPE || type === DOCUMENT_TYPE.HR_PERSONNEL.NAME) {
        heading = DOCUMENT_TYPE.HR_PERSONNEL.HEADING;
      } else if (type === DOCUMENT_TYPE.REAL_ESTATE.TYPE || type === DOCUMENT_TYPE.REAL_ESTATE.NAME) {
        heading = DOCUMENT_TYPE.REAL_ESTATE.HEADING;
      }
    } else if (
      type === DOCUMENT_TYPE.TRANSACTION.TYPE ||
      type === DOCUMENT_TYPE.TRANSACTION.NAME
    ) {
      formToDisplay = <TransactionBiblesForm ref={ref} formik={formik} />;
      heading = DOCUMENT_TYPE.TRANSACTION.HEADING;
    } else if (
      type === DOCUMENT_TYPE.REGULATION.TYPE ||
      type === DOCUMENT_TYPE.REGULATION.NAME ||
      type === DOCUMENT_TYPE.FINANCE_DOCUMENT.TYPE ||
      type === DOCUMENT_TYPE.FINANCE_DOCUMENT.NAME
    ) {
      formToDisplay = (
        <RegulationComplianceForm
          ref={ref}
          formik={formik}
        />
      );
      if (type === DOCUMENT_TYPE.REGULATION.TYPE || type === DOCUMENT_TYPE.REGULATION.NAME) {
        heading = DOCUMENT_TYPE.REGULATION.HEADING;
      } else {
        heading = DOCUMENT_TYPE.FINANCE_DOCUMENT.HEADING;
      }
    } else if (type === DOCUMENT_TYPE.BUSINESS.TYPE || type === DOCUMENT_TYPE.BUSINESS.NAME) {
      formToDisplay = <OtherDocumentsForm  ref={ref} formik={formik} />;
      heading = DOCUMENT_TYPE.BUSINESS.HEADING;
    } else {
      formToDisplay = <OtherDocumentsForm ref={ref} formik={formik} />;
      heading = DOCUMENT_TYPE.OTHER.HEADING;
    }

    const filenameError = useMemo(() => {
      if (!formik?.values?.additionalFileNames) {
        return formik?.errors?.additionalFileNames
      } else {
        return null
      }
    }, [formik])

    return (
      <div className={styles.addFolderModal}>
        <Typography size="huge">{`${isEdit ? "Edit" : "Add"} ${heading || "Document"
        }`}</Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Title" errorMessage={formik.errors.name}>
              <Input
                name="name"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.name}
                status={formik.errors.name && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            {
              (
                type === DOCUMENT_TYPE.REGULATION.TYPE ||
                type === DOCUMENT_TYPE.REGULATION.NAME ||
                type === DOCUMENT_TYPE.FINANCE_DOCUMENT.TYPE ||
                type === DOCUMENT_TYPE.FINANCE_DOCUMENT.NAME
              ) ? (
                  <Field
                    label='Reference Number'
                  >
                    <Input
                      name='metadata.referenceNumber'
                      size='large'
                      placeholder='Enter here'
                      onChange={formik.handleChange}
                      value={formik.values.metadata?.referenceNumber}
                    />
                  </Field>
                ) : (<></>)
            }
              

          </FlexBox>
        </FlexBox>

        <Space size={24} />

        {formToDisplay}

        <Space size={24} />
        {!isEdit && (
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Document">
                <FilePicker
                  form={formik}
                  error={filenameError}
                  resetError={() => formik.setFieldError("additionalFileNames", undefined)}
                  value={formik?.values?.additionalFileNames}
                  maxFileCount={20}
                />
              </Field>
            </FlexBox>
          </FlexBox>
        )}
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Description" errorMessage={formik.errors.description}>
              <TextArea
                rows={4}
                name="description"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.description}
                status={formik.errors.description && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </FlexBox>
      </div>
    );
  }
);
CommonFieldsForm.displayName = "CommonFieldsForm";

export default CommonFieldsForm;
