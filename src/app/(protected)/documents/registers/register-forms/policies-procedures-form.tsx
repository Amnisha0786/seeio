import React, { forwardRef, useEffect, useCallback } from "react";
import { Select, DatePicker, Checkbox, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import Typography from "@/components/typography";
import { frequencyOptions } from "./contract-document-form";
import DepartmentSelect from "@/shared/department-select"

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const DATE_FORMAT = "DD/MM/YYYY";

export const POLICIES_STATUS_TYPES = {
  NOT_IN_FORCE: "Not in force",
  PENDING: "Pending",
  REVIEW_OVERDUE: "Review overdue",
  REVIEW_DUE: "Review due",
  CURRENT: "Current"
}

const PoliciesProceduresForm = forwardRef(
  (
    {
      formik,
    }: { formik: any; },
    ref
  ) => {
    const { nextReview, reviewFrequency, lastReview, startDate, noLongerRequired, initialApprovalDate }
      = formik.values.metadata

    const updateNextDate = useCallback(
      (date: any) => {
        const nextReviewDate = date?.utc();
        formik.setFieldValue(
          "metadata.nextReview",
          nextReviewDate?.toISOString()
        );
      },
      [
        startDate,
        lastReview,
        reviewFrequency,
      ]
    );

    useEffect(() => {
      const date1 = lastReview
        ? dayjs(lastReview).format(DATE_FORMAT)
        : dayjs(startDate).format(DATE_FORMAT);

      const date2 = reviewFrequency;
      const duration = "month";

      const nextDate =
        date2 &&
        (lastReview ||
          startDate) &&
        duration &&
        dayjs(date1, DATE_FORMAT).add(date2, duration);

      if (nextDate) {
        updateNextDate(nextDate);
      }
    }, [updateNextDate]);

    const updateStatus = useCallback(() => {
      let status, color;
      if (noLongerRequired) {
        status = POLICIES_STATUS_TYPES.NOT_IN_FORCE;
        color = "white"
      } else if (!initialApprovalDate) {
        status = POLICIES_STATUS_TYPES.PENDING;
        color = "yellow"
      } else if (nextReview && dayjs(nextReview).isBefore(dayjs())) {
        status = POLICIES_STATUS_TYPES.REVIEW_OVERDUE;
        color = "red"
      } else if (nextReview && (dayjs(nextReview).diff(dayjs(), 'day') < 60)) {
        status = POLICIES_STATUS_TYPES.REVIEW_DUE;
        color = "yellow"
      } else {
        status = POLICIES_STATUS_TYPES.CURRENT;
        color = "green"
      }
      formik.setFieldValue("metadata.status", status);
      formik.setFieldValue("metadata.statusColor", color);
    }, [
      nextReview,
      noLongerRequired,
      initialApprovalDate
    ]);

    useEffect(() => {
      updateStatus();
    }, [updateStatus]);

    return (
      <div>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Space horizontal size={24} />
            <Field
              label="Owner/Department"
              errorMessage={formik.errors?.metadata?.owner}
            >
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
            <Field label="Last review" sideContent={<><Space horizontal size={5} />
              <Tooltip placement='top'
                // eslint-disable-next-line max-len
                title={"This is the date that the document was last formally reviewed.  This will set the review timetable for next review. This date is automatically updated if an item is approved in a board meeting and can also be manually entered if the item is reviewed outside of a board meeting run through SEEIO."}
                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                <InfoCircleOutlined />
              </Tooltip>
            </>}>
              <DatePicker
                name="lastReview"
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
                  formik.values.metadata?.lastReview &&
                  dayjs(formik.values.metadata?.lastReview)
                }
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Space horizontal size={24} />
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
            <Field label='Initial Approval Date'>
              <DatePicker
                name='metadata.initialApprovalDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) =>
                  formik.setFieldValue(
                    "metadata.initialApprovalDate",
                    value?.toISOString()
                  )
                }
                value={
                  formik.values.metadata?.initialApprovalDate &&
                  dayjs(formik.values.metadata?.initialApprovalDate)
                }
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Next review"
              errorMessage={formik.errors.metadata?.nextReview}
            >
              <DatePicker
                name="metadata.nextReview"
                disabled
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                value={
                  formik.values.metadata?.nextReview
                    ? dayjs(formik.values.metadata?.nextReview)
                    : null
                }
                status={formik.errors.metadata?.nextReview && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Start date"
              errorMessage={formik.errors.metadata?.startDate}
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
                value={
                  formik.values.metadata?.startDate
                    ? dayjs(formik.values.metadata?.startDate)
                    : null
                }
                status={formik.errors.metadata?.startDate && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <Space size={24} />
            <FlexBox flexDirection='column'>
              <Typography>No longer required</Typography>
              <Space size={24} />
              <Checkbox
                name='metadata.noLongerRequired'
                onChange={formik.handleChange}
                checked={formik.values.metadata?.noLongerRequired}
              >
                Yes
              </Checkbox>
            </FlexBox>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <div></div>
          </FlexBox>
        </FlexBox>
        <Space size={10} />
      </div>
    );
  }
);
PoliciesProceduresForm.displayName = "PoliciesProceduresForm";

export default PoliciesProceduresForm;
