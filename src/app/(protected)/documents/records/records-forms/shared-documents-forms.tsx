import React, { forwardRef, useCallback, useEffect } from "react";
import { Checkbox, DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import styles from "./page.module.scss";
import DepartmentSelect from "@/shared/department-select"

export const REVIEW_FREQUENCY_OPTIONS = [
  {
    label: "Monthly",
    value: "Monthly",
  },
  {
    label: "Bi - Monthly",
    value: "Bi-Monthly",
  },
  {
    label: "Quarterly",
    value: "Quarterly",
  },
  {
    label: "6 monthly",
    value: "Six-Monthly",
  },
  {
    label: "Yearly",
    value: "Yearly",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const SharedDocumentsForm = forwardRef(({ formik}: { formik: any 
}, ref) => {
  const { reviewFrequency, lastReview, needReview } = formik.values?.metadata;

  const updateReviewDate = useCallback(() => {
    let reviewDate: Dayjs | undefined = undefined;

    if (needReview) {
      if (lastReview) {
        if (reviewFrequency === "Monthly") {
          reviewDate = dayjs(lastReview).add(1, "month");
        } else if (reviewFrequency === "Bi-Monthly") {
          reviewDate = dayjs(lastReview).add(2, "month");
        } else if (reviewFrequency === "Quarterly") {
          reviewDate = dayjs(lastReview).add(3, "month");
        } else if (reviewFrequency === "Six-Monthly") {
          reviewDate = dayjs(lastReview).add(6, "month");
        } else if (reviewFrequency === "Yearly") {
          reviewDate = dayjs(lastReview).add(1, "year");
        } else {
          reviewDate = dayjs();
        }
      } else {
        reviewDate = dayjs();
      }
    }

    formik.setFieldValue("metadata.reviewDate", reviewDate?.toISOString());
  }, [reviewFrequency, lastReview, needReview]);

  useEffect(() => {
    updateReviewDate();
  }, [updateReviewDate]);

  const updateNeedReview = useCallback(() => {
    if (!needReview) {
      formik.setFieldValue("metadata.reviewFrequency", undefined);
      formik.setFieldValue("metadata.lastReview", undefined);
      formik.setFieldValue("metadata.reviewDate", undefined);
    }
  }, [needReview]);

  useEffect(() => {
    updateNeedReview();
  }, [updateNeedReview]);

  return (
    <div className={styles.addFolderModal}>
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Date">
            <DatePicker
              name="metadata.date"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value) =>
                formik.setFieldValue("metadata.date", value?.toISOString())
              }
              defaultValue={dayjs(formik?.values?.metadata?.date)}
              value={
                formik?.values?.metadata?.date &&
                dayjs(formik?.values?.metadata?.date)
              }
            />
          </Field>
        </FlexBox>
        
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          {needReview && <Field
            label="Review date"
            errorMessage={formik.errors.metadata?.reviewDate}
          >
            <DatePicker
              disabled={reviewFrequency === "Other" ? false : true}
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
              value={
                formik?.values?.metadata?.reviewDate &&
                dayjs(formik?.values?.metadata?.reviewDate)
              }
              status={formik.errors.metadata?.reviewDate && "error"}
            />
          </Field>}
        </FlexBox>
      </FlexBox>
      <Space  size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label='Owner/Department' errorMessage={formik?.errors?.metadata?.owner}>
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
        <Space horizontal size={25}/>
        <FlexBox flexDirection="column" flex={1}>
          <></>
        </FlexBox>
      </FlexBox>
      <Space size={24} />
      <FlexBox>
        <FlexBox flex={1}>
          <FlexBox flexDirection="column">
            <Typography>Needs Review</Typography>
            <Space size={8} />
            <Checkbox
              name="metadata.needReview"
              onChange={formik.handleChange}
              checked={formik.values.metadata?.needReview}
            >
              Yes
            </Checkbox>
          </FlexBox>
          <Space horizontal size={70} />
          <FlexBox flexDirection="column">
            <Typography>Active</Typography>
            <Space size={8} />
            <Checkbox
              name="metadata.active"
              onChange={formik.handleChange}
              checked={formik.values.metadata?.active}
            >
              Yes
            </Checkbox>
          </FlexBox>
        </FlexBox>
        <Space horizontal size={24} />
      </FlexBox>
      <Space size={24} />
      {formik.values.metadata?.needReview && (
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Last Review">
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
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Review Frequency"
              errorMessage={formik.errors.metadata?.reviewFrequency}
            >
              <Select
                size="large"
                placeholder="Select"
                options={REVIEW_FREQUENCY_OPTIONS}
                onChange={(value) =>
                  formik.setFieldValue("metadata.reviewFrequency", value)
                }
                value={formik.values.metadata?.reviewFrequency}
                status={formik.errors.metadata?.reviewFrequency && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
      )}
    </div>
  );
});
SharedDocumentsForm.displayName = "SharedDocumentsForm";

export default SharedDocumentsForm;
