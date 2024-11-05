/* eslint-disable max-len */
import { forwardRef } from "react";
import { Input, DatePicker, Radio } from "antd";
import dayjs from "dayjs";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import DraftEditor from "@/components/draft-editor";
import DepartmentSelect from "@/shared/department-select"

const IncidentDocumentForm = forwardRef(
  (
    {
      formik,
      
    }: { formik: any; },
    ref
  ) => {
    return (
      <div>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Owner/Department" errorMessage={formik.errors?.metadata?.owner}>
              <DepartmentSelect
                addNewOption="Department"
                size='large'
                allowClear
                placeholder='Select'
                onChange={(value) => formik.setFieldValue('metadata.owner', value)}
                value={formik.values.metadata.owner}
                status={formik?.errors?.metadata?.owner && 'error'}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Start Date"
              errorMessage={formik.errors?.metadata?.startDate}
            >
              <DatePicker
                name="metadata.startDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.startDate",
                    value?.toISOString()
                  )
                }
                defaultValue={dayjs(formik.values.metadata.startDate)}
                status={formik.errors?.metadata?.startDate && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <FlexBox flexDirection="column">
              <Typography>Status</Typography>
              <Space size={8} />
              <FlexBox>
                <Radio.Group
                  name="metadata.incidentCancelled"
                  onChange={formik.handleChange}
                  value={formik.values.metadata.incidentCancelled}
                  defaultValue={"Resolved"}
                >
                  <Radio value={"Resolved"}>Resolved</Radio>
                  <Radio value={"Ongoing"}>Ongoing</Radio>
                </Radio.Group>
              </FlexBox>
              {formik.errors?.metadata?.incidentCancelled && (
                <>
                  <Space size={5} />
                  <Typography red size="small">
                    {formik.errors?.metadata?.incidentCancelled}
                  </Typography>
                </>
              )}
            </FlexBox>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Expiry Date"
              errorMessage={formik.errors?.metadata?.expiryDate}
            >
              <DatePicker
                name="metadata.expiryDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.expiryDate",
                    value?.toISOString()
                  )
                }
                defaultValue={dayjs(formik.values.metadata.expiryDate)}
                status={formik.errors?.metadata?.expiryDate && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label="Stakeholders"
            errorMessage={formik?.errors?.metadata?.stakeholders}
          >
            <Input
              name="metadata.stakeholders"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.metadata.stakeholders}
              status={formik.errors?.metadata?.stakeholders && "error"}
            />
          </Field>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label="Stakeholder Management Plan"
            errorMessage={formik?.errors?.metadata?.stakeholderManagementPlan}
          >
            <DraftEditor
              onChange={(value) =>
                formik.setFieldValue(
                  "metadata.stakeholderManagementPlan",
                  value
                )
              }
              defaultValue={formik.values.metadata.stakeholderManagementPlan}
            />
          </Field>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label="Cause of incident (Root Cause Analysis)"
            errorMessage={formik?.errors?.metadata?.causeOfIncident}
          >
            <DraftEditor
              onChange={(value) =>
                formik.setFieldValue("metadata.causeOfIncident", value)
              }
              defaultValue={formik?.values?.metadata?.causeOfIncident}
            />
          </Field>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label="Lessons Learned"
            errorMessage={formik?.errors?.metadata?.lessonsLearned}
          >
            <DraftEditor
              onChange={(value) =>
                formik.setFieldValue("metadata.lessonsLearned", value)
              }
              defaultValue={formik?.values?.metadata?.lessonsLearned}
            />
          </Field>
        </FlexBox>
      </div>
    );
  }
);

IncidentDocumentForm.displayName = "IncidentDocumentForm";

export default IncidentDocumentForm;
