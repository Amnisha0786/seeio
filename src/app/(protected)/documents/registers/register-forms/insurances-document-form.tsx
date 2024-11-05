import React, { forwardRef, useEffect, useCallback } from "react";
import { Checkbox, DatePicker, Input } from "antd";
import dayjs, { Dayjs } from "dayjs";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import DepartmentSelect from "@/shared/department-select"

export const enum INSURANCE_STATUS {
  PROPOSED = "Proposed",
  MISSING = "Missing",
  RENEWAL_DUE = "Renewal Due",
  OVER_DUE = "Over Due",
  CANCELLLED = "Cancelled",
  ON_RISK = "On risk",
  LAPSED = "Lapsed"
}

const InsurancesDocumentForm = forwardRef(
  (
    {
      formik,
    }: { formik: any; },
    ref
  ) => {
    const {
      startDate,
      expiryDate,
      cancelled,
      notes,
      nextReview,
      status,
    } = formik.values.metadata;

    const updateNextReview = useCallback(() => {
      let nextReview = undefined;

      if (expiryDate) {
        nextReview = dayjs(expiryDate).subtract(2, "month");
      }
      formik.setFieldValue("metadata.nextReview", nextReview?.toISOString());
    }, [expiryDate]);

    useEffect(() => {
      updateNextReview();
    }, [updateNextReview]);

    const updateStatus = useCallback(() => {
      let status;
      const currentDate = dayjs();
      if (cancelled) {
        status = INSURANCE_STATUS.CANCELLLED;
      } else if ((
        !formik.values?.additionalFileNames ||
        (
          formik.values?.additionalFileNames &&
          formik.values?.additionalFileNames?.length === 0
        )) && (!formik.values?.additionalFiles || (formik.values?.additionalFiles && formik.values?.additionalFiles?.length === 0))) {
        status = INSURANCE_STATUS.MISSING
      } else if (startDate && currentDate.isBefore(dayjs(startDate))) {
        status = INSURANCE_STATUS.PROPOSED
      } else if (nextReview && currentDate.isAfter(dayjs(nextReview))) {
        if (dayjs(startDate).isAfter(dayjs(expiryDate).subtract(22, 'days'))) {
          status = INSURANCE_STATUS.OVER_DUE
        } else if (dayjs(startDate).isAfter(dayjs(expiryDate).subtract(46, 'days'))) {
          status = INSURANCE_STATUS.RENEWAL_DUE
        } else {
          status = INSURANCE_STATUS.ON_RISK
        }
      } else if (expiryDate && currentDate.isBefore(dayjs(expiryDate))) {
        status = INSURANCE_STATUS.ON_RISK
      } else {
        status = INSURANCE_STATUS.LAPSED
      }
      formik.setFieldValue("metadata.status", status);
    }, [
      expiryDate,
      startDate,
      cancelled,
      nextReview,
      formik.values?.additionalFileNames,
      formik.values?.fileBinary,
      formik?.values?.additionalFiles
    ]);

    const disableExpiryDate = (date: Dayjs) => {
      return date && date.isBefore(dayjs(startDate).endOf('day'));
    }

    useEffect(() => {
      updateStatus();
    }, [updateStatus]);

    return (
      <div>
        <Space size={24} />
        <FlexBox>
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
                value={startDate && dayjs(startDate)}
                status={formik?.errors.metadata?.startDate && "error"}
              />
            </Field>
          </FlexBox>

          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Next review"
              errorMessage={formik.errors.metadata?.nextReview}
            >
              <DatePicker
                disabled
                name="metadata.nextReview"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                status={formik?.errors.metadata?.nextReview && "error"}
                value={nextReview && dayjs(nextReview)}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Owner/Department"
              errorMessage={formik.errors.metadata?.owner}
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
            <Field
              label="Expiry/ Renewal date"
              errorMessage={formik.errors.metadata?.expiryDate}
            >
              <DatePicker
                disabledDate={disableExpiryDate}
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
                status={formik?.errors.metadata?.expiryDate && "error"}
                value={expiryDate && dayjs(expiryDate)}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <FlexBox flexDirection="column">
              <Typography>Cancelled</Typography>
              <Space size={8} />
              <FlexBox alignItems='center' fullHeight>
                <Checkbox
                  name="metadata.cancelled"
                  onChange={formik.handleChange}
                  checked={cancelled}
                >
                  Yes
                </Checkbox>
              </FlexBox>
            </FlexBox>
            <Space horizontal size={70} />
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field label="Status">
              <Input
                disabled
                name="metadata.status"
                size="large"
                onChange={formik.handleChange}
                value={status}
              />
            </Field>
          </FlexBox>
        </FlexBox>
      </div>
    );
  }
);

InsurancesDocumentForm.displayName = "InsurancesDocumentForm";

export default InsurancesDocumentForm;
