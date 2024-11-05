import { forwardRef, useCallback, useEffect } from "react";
import { Checkbox, DatePicker, Input, Radio, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"
import dayjs from "dayjs";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import { OwnerOption } from "@/models";
import { RESOLUTION_STATUS } from "../registers-validation-schemas";
import { frequencyOptions } from "./contract-document-form";

export const GOVERNING_STATUS_TYPES = {
  STATIC_DOCUMENT: "Static Document",
  ARCHIVE: "Archive",
  BOARD_APPROVAL_PENDING: "Board Approval Pending",
  APPROVED: "Approved",
  REVIEW_OVERDUE: "Review Overdue",
  REVIEW_DUE: "Review Due",
  PENDING_APPROVAL: "Pending Approval",
  SHAREHOLDER_APPROVAL_MISSING: "Shareholder Approval Missing",
  CURRENT: "Current"
}

export const BOARD_APPROVAL_REQUIRED = {
  NO: "No",
  YES: "Yes",
  NO_LONGER_REQUIRED: "No longer required",
}

const GoverningDocumentForm = forwardRef(({ formik, resolutionOptions }: { formik: any, resolutionOptions: OwnerOption[] }) => {

  const {
    reviewDate,
    requireShareholderApproval,
    needReview,
    reviewFrequency,
    lastReview,
    boardApprovalDate,
    requireBoardApproval,
    resolutionsRegister
  } = formik.values.metadata

  const reviewDateCalculation = useCallback(() => {
    let reviewDateCal;
    if (needReview && reviewFrequency  && lastReview) {
      reviewDateCal = dayjs(lastReview).add(reviewFrequency, "month");
    }
    formik.setFieldValue("metadata.reviewDate", reviewDateCal?.toISOString());
  }, [needReview, reviewFrequency, lastReview])

  const updateStatus = useCallback(() => {
    let status, color;
    if (requireBoardApproval === BOARD_APPROVAL_REQUIRED.NO) {
      status = GOVERNING_STATUS_TYPES.STATIC_DOCUMENT;
      color = "white"
    } else if (requireBoardApproval === BOARD_APPROVAL_REQUIRED.NO_LONGER_REQUIRED) {
      status = GOVERNING_STATUS_TYPES.ARCHIVE;
      color = "white"
    } else if (requireBoardApproval === BOARD_APPROVAL_REQUIRED.YES &&
      (!boardApprovalDate)) {
      status = GOVERNING_STATUS_TYPES.BOARD_APPROVAL_PENDING;
      color = "red"
    } else if (boardApprovalDate && dayjs(boardApprovalDate).isBefore(dayjs()) && needReview && reviewDate &&
      (Math.abs(dayjs(reviewDate).diff(dayjs(), 'day')) > 60)
      && requireShareholderApproval &&
      resolutionsRegister &&
      resolutionOptions?.find((item) => item.value === resolutionsRegister?.resolutionNumber)?.status === RESOLUTION_STATUS.PASSED) {
      status = GOVERNING_STATUS_TYPES.APPROVED;
      color = "green"
    } else if (needReview && reviewDate && dayjs(reviewDate).isBefore(dayjs())) {
      status = GOVERNING_STATUS_TYPES.REVIEW_OVERDUE;
      color = "red"
    } else if (reviewDate && (Math.abs(dayjs(reviewDate).diff(dayjs(), 'day')) < 30)) {
      status = GOVERNING_STATUS_TYPES.REVIEW_DUE;
      color = "yellow"
    } else if (resolutionsRegister &&
      resolutionOptions?.find((item) => item.value === resolutionsRegister?.resolutionNumber)?.status === RESOLUTION_STATUS.DEFUNCT) {
      status = GOVERNING_STATUS_TYPES.SHAREHOLDER_APPROVAL_MISSING;
      color = "red"
    } else if (resolutionsRegister &&
      resolutionOptions?.find((item) => item.value === resolutionsRegister?.resolutionNumber)?.status !== RESOLUTION_STATUS.PASSED) {
      status = GOVERNING_STATUS_TYPES.PENDING_APPROVAL;
      color = "yellow"
    } else {
      status = GOVERNING_STATUS_TYPES.CURRENT;
      color = "green"
    }
    formik.setFieldValue("metadata.status", status);
    formik.setFieldValue("metadata.statusColor", color);
  }, [
    needReview,
    boardApprovalDate,
    reviewDate,
    requireBoardApproval,
    requireShareholderApproval,
    resolutionsRegister
  ]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);


  useEffect(() => {
    reviewDateCalculation();
  }, [reviewDateCalculation]);

  useEffect(() => {
    if (requireBoardApproval === BOARD_APPROVAL_REQUIRED.NO) {
      formik.setFieldValue("metadata.needReview", false);
    }
  }, [requireBoardApproval]);


  return (
    <>
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field
            label='Name'
            errorMessage={formik.errors.name}
          >
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
        <FlexBox flexDirection='column' flex={1}>
          {requireBoardApproval !== BOARD_APPROVAL_REQUIRED.NO_LONGER_REQUIRED &&
            <Field label="Document Date" errorMessage={formik.errors?.metadata?.documentDate}>
              <DatePicker
                name="metadata.documentDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.documentDate",
                    value?.toISOString()
                  )
                }
                value={
                  formik?.values?.metadata?.documentDate &&
                  dayjs(formik?.values?.metadata?.documentDate)
                }
                status={formik.errors?.metadata?.documentDate && "error"}

              />
            </Field>}
        </FlexBox>
      </FlexBox>
      <Space size={24} />
      <FlexBox>
        <FlexBox flex={1}>
          <FlexBox flexDirection="column">
            <Field label="Active" sideContent={<><Space horizontal size={5} />
              <Tooltip placement='top'
                // eslint-disable-next-line max-len
                title={"Uncheck this if the document is no longer active and simply an archive record.  Removes from governance timetable and sets status flag as “Archived”."}
                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                <InfoCircleOutlined />
              </Tooltip>
            </>}>
              <Space size={16} />
              <Checkbox
                name="metadata.active"
                onChange={formik.handleChange}
                checked={formik.values.metadata?.active}
              >
                Yes
              </Checkbox>
            </Field>
          </FlexBox>
          <Space horizontal size={70} />
          {requireBoardApproval !== BOARD_APPROVAL_REQUIRED.NO && <FlexBox flexDirection="column">
            <Field label="Needs Review" sideContent={<><Space horizontal size={5} />
              <Tooltip placement='top'
                // eslint-disable-next-line max-len
                title={"Check this box is the document needs a regular review.  This will bring up the review frequency and last review fields and will add the document to the governance timetable.  It is good practice to review all document which can be changed on at least an annual basis.  Documents which are static such as VAT registration certficiate etc. can be left with needs review unchecked."}
                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                <InfoCircleOutlined />
              </Tooltip>
            </>}>

              <Space size={16} />
              <Checkbox
                name="metadata.needReview"
                onChange={formik.handleChange}
                checked={formik.values.metadata?.needReview}
              >
                Yes
              </Checkbox>
            </Field>
          </FlexBox>}

        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          {formik.values.metadata?.needReview && requireBoardApproval !== BOARD_APPROVAL_REQUIRED.NO && (
            <Field label="Last Review" errorMessage={formik.errors.metadata?.lastReview} sideContent={<><Space horizontal size={5} />
              <Tooltip placement='top'
                // eslint-disable-next-line max-len
                title={"This is the date that the document was last formally reviewed.  This will set the review timetable for next review. This date is automatically updated if an item is approved in a board meeting and can also be manually entered if the item is reviewed outside of a board meeting run through SEEIO."}
                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                <InfoCircleOutlined />
              </Tooltip>
            </>}>
              <DatePicker
                name="metadata.lastReview"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.lastReview",
                    value?.toISOString()
                  )
                }
                value={
                  formik?.values?.metadata?.lastReview &&
                  dayjs(formik?.values?.metadata?.lastReview)
                }
                status={formik.errors.metadata?.lastReview && "error"}
              />
            </Field>
          )}
        </FlexBox>
      </FlexBox>
      {formik.values.metadata?.needReview && (
        <>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Review Frequency"
                errorMessage={formik.errors.metadata?.reviewFrequency}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={frequencyOptions}
                  onChange={(value) =>
                    formik.setFieldValue("metadata.reviewFrequency", value)
                  }
                  value={formik.values.metadata.reviewFrequency}
                  status={formik.errors?.metadata?.reviewFrequency && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              {requireBoardApproval !== BOARD_APPROVAL_REQUIRED.NO && (
                <Field label="Review Date">
                  <DatePicker
                    name="metadata.reviewDate"
                    size="large"
                    placeholder="__/__/____"
                    format="DD/MM/YYYY"
                    onChange={(value) =>
                      formik.setFieldValue(
                        "metadata.reviewDate",
                        value?.toISOString()
                      )
                    }
                    disabled
                    value={
                      formik?.values?.metadata?.reviewDate &&
                      dayjs(formik?.values?.metadata?.reviewDate)
                    }
                  />
                </Field>
              )}
            </FlexBox>
          </FlexBox>

        </>
      )}
      <Space size={24} />
      <FlexBox>
        <FlexBox flex={1}>
          <FlexBox flexDirection="column">
            <Field label="Board Approval Required" sideContent={<><Space horizontal size={5} />
              <Tooltip placement='top'
                // eslint-disable-next-line max-len
                title={"The majority of documents will require board approval other than the original memorandum of incorporation.  If the document is now archived, select no longer required.  If you are in doubt about whether a document requires approval then you should take legal advice."}
                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                <InfoCircleOutlined />
              </Tooltip>
            </>}>
              <Space size={10} />
              <Radio.Group
                name='metadata.requireBoardApproval'
                onChange={formik.handleChange}
                value={requireBoardApproval}
              >
                <Radio value={BOARD_APPROVAL_REQUIRED.YES}>Yes</Radio>
                <Radio value={BOARD_APPROVAL_REQUIRED.NO}>No</Radio>
                <Radio value={BOARD_APPROVAL_REQUIRED.NO_LONGER_REQUIRED}>No longer required</Radio>
              </Radio.Group>
            </Field>
          </FlexBox>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          {requireBoardApproval === BOARD_APPROVAL_REQUIRED.YES && <Field label="Board Approval Date">
            <DatePicker
              name="metadata.boardApprovalDate"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value) =>
                formik.setFieldValue(
                  "metadata.boardApprovalDate",
                  value?.toISOString()
                )
              }
              value={
                formik?.values?.metadata?.boardApprovalDate &&
                dayjs(formik?.values?.metadata?.boardApprovalDate)
              }
            />
          </Field>}
        </FlexBox>
      </FlexBox >
      {
        requireBoardApproval === BOARD_APPROVAL_REQUIRED.YES &&
        <>
          <Space size={24} />
          <FlexBox>
            <FlexBox flex={1}>
              <FlexBox flexDirection="column">
                <Field label="Shareholder approval required" sideContent={<><Space horizontal size={5} />
                  <Tooltip placement='top'
                    // eslint-disable-next-line max-len
                    title={"Some documents such as Articles of association require shareholder approval. If you are unsure of whether you require shareholder approval for a document you should take legal advice.  If a document does require shareholder approval, you will need to upload the relevant resolution to the resolutions register and select it from the field “Resolutions register”."}
                    color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </>}>
                  <Space size={10} />
                  <Radio.Group
                    name='metadata.requireShareholderApproval'
                    onChange={formik.handleChange}
                    value={requireShareholderApproval}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Field>
              </FlexBox>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              {requireShareholderApproval && <Field
                label="Resolutions register"
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={resolutionOptions}
                  onChange={(value) =>
                    formik.setFieldValue("metadata.resolutionsRegister.resolutionNumber", value)
                  }
                  value={formik?.values?.metadata?.resolutionsRegister?.resolutionNumber}
                />
              </Field>}
            </FlexBox>
          </FlexBox>
        </>
      }

    </>
  );
});
GoverningDocumentForm.displayName = "GoverningDocumentForm";

export default GoverningDocumentForm;
