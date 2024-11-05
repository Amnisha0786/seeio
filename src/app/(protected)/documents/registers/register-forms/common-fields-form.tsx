import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Col, DatePicker, Input, Row, Select } from "antd";
import Image from "next/image";
import dayjs from "dayjs";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Field from "@/components/field";
import FilePicker from "@/shared/formik-file-picker";
import styles from "./page.module.scss";
import * as API from "@/api";
import ApprovedSupplierForm from "./approved-supplier-form";
import ComplaintsDocumentForm from "./complaint-document-form";
import AddButton from "@/components/add-button";
import ContractDocumentForm from "./contract-document-form";
import IncidentDocumentForm from "./incident-document-form";
import PoliciesProceduresForm from "./policies-procedures-form";
import InsurancesDocumentForm from "./insurances-document-form";
import ResolutionsDocumentForm from "./resolutions-document-form";
import Clickable from "@/components/clickable";
import { useSelectedAccountCompany } from "@/hooks";
import Toast from "@/components/toast";
import { Update } from "@/models/registers/register";
import {  OwnerOption } from "@/models";
import DraftEditor from "@/components/draft-editor";
import GoverningDocumentForm from "./governing-document-form";
import { DOCUMENT_TYPE } from "../registers-validation-schemas";
import { TResolutionRegisterOptions } from '@/models/registers/resolution-register';

const POLICY_TYPES = [
  {
    label: "Accountant",
    value: "Accountant",
  },
  {
    label: "Bankers",
    value: "Bankers",
  },
  {
    label: "Auditor",
    value: "Auditor",
  },
  {
    label: "Insurance broker",
    value: "Insurance broker",
  },
  {
    label: "Corporate Finance Advisor",
    value: "Corporate Finance Advisor",
  },
  {
    label: "Legal advisers",
    value: "Legal advisers",
  },
  {
    label: "Compliance Consultants",
    value: "Compliance Consultants",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const DOCUMENT_TYPES = {
  GOVERNING: {
    TYPE: DOCUMENT_TYPE.GOVERNING,
    NAME: DOCUMENT_TYPE.GOVERNING_DOCUMENT,
    HEADING: "Governing Document",
  },
  APPROVED: {
    TYPE: DOCUMENT_TYPE.SUPPLIER,
    NAME: DOCUMENT_TYPE.SUPPLIER_DOCUMENT,
    HEADING: "Suppliers",
  },
  CONTRACTS: {
    TYPE: DOCUMENT_TYPE.CONTRACT,
    NAME: DOCUMENT_TYPE.CONTRACT_DOCUMENT,
    HEADING: "Contracts",
  },
  COMPLAINTS: {
    TYPE: DOCUMENT_TYPE.COMPLAINT,
    NAME: DOCUMENT_TYPE.COMPLAINT_DOCUMENT,
    HEADING: "Complaints",
  },
  RESOLUTIONS: {
    TYPE: DOCUMENT_TYPE.RESOLUTION,
    NAME: DOCUMENT_TYPE.RESOLUTION_DOCUMENT,
    HEADING: "Resolution",
  },
  POLICIES: {
    TYPE: DOCUMENT_TYPE.POLICIES,
    HEADING: "Policy",
    NAME: DOCUMENT_TYPE.POLICIES_DOCUMENT,
  },
  INCIDENTS: { TYPE: DOCUMENT_TYPE.INCIDENT, HEADING: "Incident", NAME: DOCUMENT_TYPE.INCIDENT_DOCUMENT },
  INSURANCES: {
    TYPE: DOCUMENT_TYPE.INSURANCE,
    HEADING: "Insurance",
    NAME: DOCUMENT_TYPE.INSURANCE_DOCUMENT,
  },
};

const CommonFieldsForm = forwardRef(
  (
    {
      type,
      formik,
      loading,
      isEdit = false,
      highestResolutionNumber,
    }: {
      type: string;
      formik: any;
      loading: boolean;
      isEdit?: boolean;
      highestResolutionNumber?: number | null;
    },
    ref
  ) => {
    const [resolutionsList , setResolutionsList] = useState<OwnerOption[]>([])
   

    let formToDisplay = <></>,
      heading = "";
    if (
      type === DOCUMENT_TYPES.CONTRACTS.TYPE ||
      type === DOCUMENT_TYPES.CONTRACTS.NAME
    ) {
      formToDisplay = (
        <ContractDocumentForm
          ref={ref}
          formik={formik}
        />
      );
      heading = DOCUMENT_TYPES.CONTRACTS.HEADING;
    } else if (
      type === DOCUMENT_TYPES.APPROVED.TYPE ||
      type === DOCUMENT_TYPES.APPROVED.NAME
    ) {
      formToDisplay = <ApprovedSupplierForm ref={ref} formik={formik} />;
      heading = DOCUMENT_TYPES.APPROVED.HEADING;
    } else if (
      type === DOCUMENT_TYPES.COMPLAINTS.TYPE ||
      type === DOCUMENT_TYPES.COMPLAINTS.NAME
    ) {
      formToDisplay = (
        <ComplaintsDocumentForm
          ref={ref}
          formik={formik}
        />
      );
      heading = DOCUMENT_TYPES.COMPLAINTS.HEADING;
    } else if (
      type === DOCUMENT_TYPES.RESOLUTIONS.TYPE ||
      type === DOCUMENT_TYPES.RESOLUTIONS.NAME ||
      type === DOCUMENT_TYPE.RESOLUTION_DOCTYPE
    ) {
      formToDisplay = <ResolutionsDocumentForm ref={ref} formik={formik} 
        isEdit={isEdit} highestResolutionNumber={!isEdit && highestResolutionNumber || 0} />;
      heading = DOCUMENT_TYPES.RESOLUTIONS.HEADING;
    } else if (
      type === DOCUMENT_TYPES.POLICIES.TYPE ||
      type === DOCUMENT_TYPES.POLICIES.NAME
    ) {
      formToDisplay = (
        <PoliciesProceduresForm
          ref={ref}
          formik={formik}
        />
      );
      heading = DOCUMENT_TYPES.POLICIES.HEADING;
    } else if (
      type === DOCUMENT_TYPES.GOVERNING.TYPE ||
      type === DOCUMENT_TYPES.GOVERNING.NAME
    ) {
      formToDisplay = <GoverningDocumentForm ref={ref} formik={formik} resolutionOptions = {resolutionsList} />;
      heading = DOCUMENT_TYPES.GOVERNING.HEADING;
    } else if (
      type === DOCUMENT_TYPES.INCIDENTS.TYPE ||
      type === DOCUMENT_TYPES.INCIDENTS.NAME
    ) {
      formToDisplay = (
        <IncidentDocumentForm
          ref={ref}
          formik={formik}
        />
      );
      heading = DOCUMENT_TYPES.INCIDENTS.HEADING;
    } else if (
      type === DOCUMENT_TYPES.INSURANCES.TYPE ||
      type === DOCUMENT_TYPES.INSURANCES.NAME
    ) {
      formToDisplay = (
        <InsurancesDocumentForm
          ref={ref}
          formik={formik}
        />
      );
      heading = DOCUMENT_TYPES.INSURANCES.HEADING;
    }

    const companyId = useSelectedAccountCompany()?.companyId;

 

    const fetchResolutions = useCallback(async () => {
      try {
        if (!companyId) return;
        const result = await API.getAllResolutions(companyId);

        if (result?.resolutionRegisters && result?.resolutionRegisters?.length > 0) {
          const options = result.resolutionRegisters?.map((resolution: TResolutionRegisterOptions) => ({
            label: `${resolution?.name || ""} - ${resolution?.resolutionNumber || ""} - ${resolution?.boardApprovalDate
               && dayjs(resolution?.boardApprovalDate).format("DD/MM/YYYY")}`,
            value:resolution?.resolutionNumber,
            status: resolution?.status
          }));

          setResolutionsList(options);
        }
        
      } catch (err: any) {
        Toast.error(err?.message || "Something went wrong.");
      }
    }, [companyId]);

    useEffect(() => {
      if(type === DOCUMENT_TYPES.GOVERNING.TYPE ||
        type === DOCUMENT_TYPES.GOVERNING.NAME){
        fetchResolutions();
      }
      // eslint-disable-next-line
    }, [companyId]);

    const onClickDelete = (index: number) => {
      if (formik.values?.metadata?.updates) {
        const updates = [...formik.values?.metadata?.updates];
        updates.splice(index, 1);
        formik.setFieldValue("metadata.updates", updates);
      }
    };
    const filenameError = useMemo(() => {
      if (!formik?.values?.additionalFileNames) {
        return formik?.errors?.additionalFileNames
      } else if (!formik?.values?.fileName) {
        return formik?.errors?.fileName
      } else {
        return null
      }
    }, [formik])

    return (
      <div className={styles.addFolderModal}>
        <Typography size="huge">{`${isEdit ? "Edit" : "Add"} ${heading || "Document"
        }`}</Typography>
        {type === DOCUMENT_TYPES.COMPLAINTS.TYPE && (
          <Typography size="large" red>
            ⓘ If you leave the complaint reference number empty, a reference
            number will be automatically generated for you upon save.
          </Typography>
        )}
        {type !== DOCUMENT_TYPES.RESOLUTIONS.TYPE &&
          type !== DOCUMENT_TYPES.RESOLUTIONS.NAME && <Space size={24} />}
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            {type !== DOCUMENT_TYPES.RESOLUTIONS.TYPE &&
              type !== DOCUMENT_TYPES.RESOLUTIONS.NAME &&
              type !== DOCUMENT_TYPE.RESOLUTION_DOCUMENT &&
              type !== DOCUMENT_TYPES.GOVERNING.TYPE &&
              type !== DOCUMENT_TYPES.GOVERNING.NAME &&
            <Field label="Name" errorMessage={formik.errors.name}>
              <Input
                name="name"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.name}
                status={formik.errors.name && "error"}
              />
            </Field>}
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            {(type === DOCUMENT_TYPE.SUPPLIER || type === DOCUMENT_TYPE.SUPPLIER_DOCUMENT)  && <Field
              label='Supplier Type'
              errorMessage={formik.errors.metadata?.supplierType}
            >
              <Select
                size='large'
                placeholder='Select'
                options={POLICY_TYPES}
                onChange={(value) =>
                  formik.setFieldValue("metadata.supplierType", value)
                }
                value={formik.values.metadata.supplierType}
                status={formik.errors.metadata?.supplierType && "error"}
              />
            </Field>
            }
            {isEdit &&
              (type === DOCUMENT_TYPES.COMPLAINTS.TYPE ||
                type === DOCUMENT_TYPES.COMPLAINTS.NAME) && (
              <Field label="Last Updated">
                <DatePicker
                  name={``}
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  defaultValue={dayjs(formik.values?.metadata?.lastUpdate)}
                  disabled
                />
              </Field>
            )}
          </FlexBox>
        </FlexBox>

        {formToDisplay}

        {!isEdit && (
          <>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Document">
                  <FilePicker
                    form={formik}
                    error={
                      filenameError
                    }
                    resetError={() => formik.setFieldError("additionalFileNames", null)}
                    value={formik?.values?.additionalFileNames}
                    maxFileCount={20}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
          </>
        )}

        {(type === DOCUMENT_TYPE.RESOLUTION ||
          type === DOCUMENT_TYPE.RESOLUTION_DOCTYPE ||
          type === DOCUMENT_TYPE.RESOLUTION_DOCUMENT) && (
          <>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Notes' >
                  <DraftEditor
                    onChange={(value) => formik.setFieldValue('notes', value)}
                    defaultValue={formik.values.notes}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
          </>
        )}

        <Space size={24} />
        {type !== DOCUMENT_TYPES.RESOLUTIONS.TYPE &&
          type !== DOCUMENT_TYPES.RESOLUTIONS.NAME &&
          type !== DOCUMENT_TYPE.RESOLUTION_DOCUMENT && (
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Description" errorMessage={formik.errors.description}>
                <DraftEditor
                  onChange={(value) => formik.setFieldValue("description", value)}
                  defaultValue={formik.values.description}
                />
              </Field>
            </FlexBox>
          </FlexBox>
        )}

        {(type === DOCUMENT_TYPES.COMPLAINTS.TYPE ||
          type === DOCUMENT_TYPES.COMPLAINTS.NAME || type === DOCUMENT_TYPES.INCIDENTS.TYPE ||
          type === DOCUMENT_TYPES.INCIDENTS.NAME) && (
          <>
            {formik.values.metadata?.updates?.length > 0 ? (
              <>
                <Space size={24} />
                {formik.values.metadata?.updates?.map(
                  (update: Update, index: number) => (
                    <React.Fragment key={index}>
                      <FlexBox justifyContent="space-between">
                        <Typography size="enormous">
                          Update {index + 1}
                        </Typography>
                        {!isEdit && (
                          <Clickable onClick={() => onClickDelete(index)}>
                            <Image
                              src="/icons/delete-icon.svg"
                              alt="delete icon"
                              width={24}
                              height={24}
                            />
                          </Clickable>
                        )}
                      </FlexBox>
                      <FlexBox className={styles.card} flexDirection="column">
                        <Space size={15} />
                        <Row gutter={[30, 0]}>
                          <Col span={24}>
                            <FlexBox flexDirection="column">
                              <Row gutter={[30, 0]}>
                                <Col span={12}>
                                  <Field label="Date">
                                    <DatePicker
                                      name={`metadata.updates.${index}.dateOfAcknowledgement`}
                                      size="large"
                                      placeholder="__/__/____"
                                      format="DD/MM/YYYY"
                                      onChange={(value) =>
                                        formik.setFieldValue(
                                          `metadata.updates.${index}.dateOfAcknowledgement`,
                                          value?.toISOString()
                                        )
                                      }
                                      defaultValue={dayjs(
                                        formik.values.metadata?.updates?.[index]
                                          ?.dateOfAcknowledgement
                                      )}
                                      status={
                                        formik.errors.metadata?.updates?.[index]
                                          ?.dateOfAcknowledgement && "error"
                                      }
                                    />
                                  </Field>
                                </Col>
                              </Row>
                              <Space size={15} />
                              <Row gutter={[30, 0]}>
                                <Col span={24}>
                                  <Field label="Notes">
                                    <Input
                                      name={`metadata.updates.${index}.notes`}
                                      size="large"
                                      placeholder="Enter here"
                                      onChange={formik.handleChange}
                                      value={
                                        formik.values.metadata?.updates?.[index]
                                          ?.notes
                                      }
                                    />
                                  </Field>
                                </Col>
                              </Row>
                              <Space size={15} />
                              {!update?.id && (
                                <Row gutter={[30, 0]}>
                                  <Col span={24}>
                                    <Field label="Document">
                                      <FilePicker
                                        fileBinaryKeyName={`metadata.updates.${index}.fileBinary`}
                                        fileKeyName={`metadata.updates.${index}.fileName`}
                                        form={formik}
                                        error={
                                          formik.errors.metadata?.updates?.[
                                            index
                                          ]?.fileName
                                        }
                                        resetError={() =>
                                          formik.setFieldError(
                                            `metadata.updates.${index}.fileName`,
                                            undefined
                                          )
                                        }
                                      />
                                    </Field>
                                  </Col>
                                </Row>
                              )}

                              <Space size={15} />
                            </FlexBox>
                          </Col>
                        </Row>
                      </FlexBox>
                    </React.Fragment>
                  )
                )}
              </>
            ) : (
              <></>
            )}
            <Space size={24} />
            <Card>
              <FlexBox justifyContent="space-between">
                <Typography size="huge">
                  Add Update{" "}
                  {formik.values.metadata?.updates?.length > 0 &&
                    formik.values.metadata?.updates?.length + 1}
                </Typography>
                <AddButton
                  onClick={() =>
                    formik.setFieldValue("metadata.updates", [
                      ...(formik.values?.metadata.updates || []),
                      {
                        dateOfAcknowledgement: new Date().toISOString(),
                        notes: "",
                        fileName: "",
                      },
                    ])
                  }
                />
              </FlexBox>
            </Card>
          </>
        )}

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
