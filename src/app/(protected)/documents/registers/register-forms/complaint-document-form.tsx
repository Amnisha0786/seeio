import React, { forwardRef } from "react";
import { DatePicker, Input, Select } from "antd";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import dayjs from "dayjs";
import DraftEditor from "@/components/draft-editor";
import DepartmentSelect from "@/shared/department-select"

const RESULT_TYPES = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Resolved",
    value: "Resolved",
  },
  {
    label: "Proceeding to Litigation",
    value: "Proceeding to Litigation",
  },
];

const ComplaintsDocumentForm = forwardRef(
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
            <Field
              label="Complaint Reference Number"
              errorMessage={formik.errors.metadata?.complaintReferenceNumber}
            >
              <Input
                name="metadata.complaintReferenceNumber"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.metadata.complaintReferenceNumber}
                status={
                  formik.errors.metadata?.complaintReferenceNumber && "error"
                }
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Acknowledgement Date">
              <DatePicker
                name="metadata.dateOfAcknowledgement"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.dateOfAcknowledgement",
                    value?.toISOString()
                  )
                }
                defaultValue={dayjs(
                  formik.values.metadata.dateOfAcknowledgement
                )}
                status={
                  formik.errors.metadata?.dateOfAcknowledgement && "error"
                }
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Who is complaint about?"
              errorMessage={formik.errors.metadata?.whoIsComplaintAbout}
            >
              <Input
                name="metadata.whoIsComplaintAbout"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.metadata.whoIsComplaintAbout}
                status={formik.errors.metadata?.whoIsComplaintAbout && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Date of Complaint">
              <DatePicker
                name="metadata.dateOfComplaint"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.dateOfComplaint",
                    value?.toISOString()
                  )
                }
                defaultValue={dayjs(formik.values.metadata.dateOfComplaint)}
                status={formik.errors.metadata?.dateOfComplaint && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Result" errorMessage={formik.errors.metadata?.result}>
              <Select
                size="large"
                placeholder="Select"
                options={RESULT_TYPES}
                onChange={(value) =>
                  formik.setFieldValue("metadata.result", value)
                }
                value={formik.values.metadata.result}
                status={formik.errors.metadata?.result && "error"}
              />
            </Field>
          </FlexBox>

          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            {formik.values?.metadata?.result === "Resolved" && (
              <Field label="Date of Resolution">
                <DatePicker
                  name="metadata.dateOfResolution"
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) =>
                    formik.setFieldValue(
                      "metadata.dateOfResolution",
                      value?.toISOString()
                    )
                  }
                  defaultValue={dayjs(formik.values.metadata.dateOfResolution)}
                  status={formik.errors.metadata?.dateOfResolution && "error"}
                />
              </Field>
            )}
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <Typography size="huge">Counter-party or Complainant</Typography>

        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Name"
              errorMessage={formik.errors.metadata?.complainantName}
            >
              <Input
                name="metadata.complainantName"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.metadata.complainantName}
                status={formik.errors.metadata?.complainantName && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Email Address"
              errorMessage={formik.errors.metadata?.complainantEmail}
            >
              <Input
                name="metadata.complainantEmail"
                size="large"
                placeholder="Enter here"
                type='email'
                onChange={formik.handleChange}
                value={formik.values.metadata.complainantEmail}
                status={formik.errors.metadata?.complainantEmail && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Phone number">
              <Input
                name="metadata.complainantPhone"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.metadata.complainantPhone}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field label="Address">
              <Input
                name="metadata.complainantAddress"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.metadata.complainantAddress}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Owner/Department" errorMessage={formik.errors.metadata?.owner}>
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
            <Space horizontal size={24} />
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Details of Complaint"
              errorMessage={formik.errors?.metadata?.complaintDetails}
            >
              <DraftEditor
                onChange={(value) =>
                  formik.setFieldValue("metadata.complaintDetails", value)
                }
                defaultValue={formik.values.metadata.complaintDetails}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Proposed solution">
              <DraftEditor
                onChange={(value) =>
                  formik.setFieldValue("metadata.proposedSolution", value)
                }
                defaultValue={formik.values.metadata.proposedSolution}
              />
            </Field>
          </FlexBox>
        </FlexBox>
      </div>
    );
  }
);
ComplaintsDocumentForm.displayName = "ComplaintsDocumentForm";

export default ComplaintsDocumentForm;
