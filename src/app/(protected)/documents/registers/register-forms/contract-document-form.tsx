import React, { forwardRef, useCallback, useEffect } from "react";
import { DatePicker, Input, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"
import dayjs, { Dayjs } from "dayjs";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import DepartmentSelect from "@/shared/department-select"

export const durationOptions = [
  { value: "day", label: "Days" },
  { value: "month", label: "Months" },
  { value: "year", label: "Years" },
];

export const frequencyOptions = [
  { value: 1, label: "Monthly" },
  { value: 3, label: "Quarterly" },
  { value: 6, label: "6 Monthly" },
  { value: 12, label: "Annually" },
];

export const reviewProcessOptions = [
  { value: "Terminated", label: "Terminated" },
  { value: "Auto renews", label: "Auto renews" },
  { value: "Needs review", label: "Needs review" },
  { value: "No review required", label: "No review required" }
];

export const enum REVIEW_PROCESS_TYPES {
  NEEDS_REVIEW = "Needs review",
  TERMINATED = "Terminated",
  AUTO_RENEWS = "Auto renews",
  NO_REVIEW_REQUIRED = "No review required"
}


export const enum CONTRACT_STATUS_TYPES {
  STATIC = "Static",
  TERMINATED = "Terminated",
  REVIEW_OVERDUE = "Review overdue",
  REVIEW_DUE = "Review due",
  CURRENT = "Current"
}

const ContractDocumentForm = forwardRef(
  (
    {
      formik,
    }: { formik: any; },
    ref
  ) => {
    const {
      startDate,
      noticePeriod,
      expiryDate,
      periodDuration,
      lastReview,
      reviewFrequency,
      term,
      termDuration,
      lastRenewalDate,
      parties,
      owner,
      status,
      reviewDate,
      reviewProcess
    } = formik.values.metadata;

    const updateExpiryDate = useCallback(() => {
      let expiryDateUpdate;
      if (reviewProcess === REVIEW_PROCESS_TYPES.AUTO_RENEWS && startDate) {
        if (term && termDuration) {
          expiryDateUpdate = dayjs(startDate).add(term, termDuration);
        } else {
          expiryDateUpdate = dayjs(startDate);
        }
        formik.setFieldValue("metadata.expiryDate", expiryDateUpdate?.toISOString());
        updateLastRenewalDate(expiryDateUpdate?.toISOString(), term, termDuration)
      }
    }, [term, termDuration, startDate, reviewProcess]);

    const updateLastRenewalDate = useCallback(
      (renewalDate: string,
        terms: number,
        duration: "day" | "month" | "year",
      ) => {
        let lastRenewalDateUpdate;
        if (renewalDate && (dayjs().isAfter(dayjs(renewalDate)) || dayjs(renewalDate).isSame(dayjs(), 'day'))) {
          lastRenewalDateUpdate = dayjs(renewalDate);
          formik.setFieldValue(
            "metadata.lastRenewalDate",
            lastRenewalDateUpdate?.toISOString()
          );
          if (terms && duration) {
            formik.setFieldValue(
              "metadata.expiryDate",
              dayjs(lastRenewalDateUpdate).add(terms, duration)?.toISOString()
            );
          } else {
            formik.setFieldValue(
              "metadata.expiryDate",
              dayjs(lastRenewalDateUpdate)?.toISOString()
            );
          }
        }
      },
      []
    );

    useEffect(() => {
      updateExpiryDate();
    }, [updateExpiryDate]);

    const updateReviewDate = useCallback(() => {
      let reviewDate = undefined;
      if (reviewProcess === REVIEW_PROCESS_TYPES.TERMINATED || reviewProcess === REVIEW_PROCESS_TYPES.NO_REVIEW_REQUIRED) {
        reviewDate = undefined;
      } else if (reviewProcess === REVIEW_PROCESS_TYPES.AUTO_RENEWS && expiryDate) {
        if (noticePeriod && periodDuration) {
          reviewDate = dayjs(expiryDate).subtract(noticePeriod, periodDuration).subtract(60, 'day')
        } else {
          reviewDate = dayjs(expiryDate).subtract(60, 'day')

        }
      } else if (reviewProcess === REVIEW_PROCESS_TYPES.NEEDS_REVIEW) {
        if (lastReview) {
          if (reviewFrequency) {
            reviewDate = dayjs(lastReview).add(+reviewFrequency, "month")
          } else {
            reviewDate = dayjs(lastReview)
          }
        } else if (!lastReview && startDate) {
          if (reviewFrequency) {
            reviewDate = dayjs(startDate).add(+reviewFrequency, "month")
          } else {
            reviewDate = dayjs(startDate)
          }
        }
      }
      formik.setFieldValue('metadata.reviewDate', reviewDate?.toISOString());
    }, [reviewFrequency, lastReview, reviewProcess, expiryDate, noticePeriod, startDate, periodDuration, term, termDuration]);

    useEffect(() => {
      updateReviewDate();
    }, [updateReviewDate]);

    const updateStatus = useCallback(() => {
      let status, color;
      if (reviewProcess === REVIEW_PROCESS_TYPES.TERMINATED) {
        status = CONTRACT_STATUS_TYPES.TERMINATED;
        color = "white"
      } else if (reviewProcess === REVIEW_PROCESS_TYPES.NO_REVIEW_REQUIRED) {
        status = CONTRACT_STATUS_TYPES.STATIC
        color = "white"
      } else if (reviewDate && dayjs(reviewDate).isBefore(dayjs(), 'day')) {
        status = CONTRACT_STATUS_TYPES.REVIEW_OVERDUE
        color = "red"
      } else if (reviewDate && Math.abs(dayjs().diff(dayjs(reviewDate), 'day')) <= 30) {
        status = CONTRACT_STATUS_TYPES.REVIEW_DUE;
        color = "yellow"
      } else {
        status = CONTRACT_STATUS_TYPES.CURRENT;
        color = "green"
      }
      formik.setFieldValue("metadata.status", status);
      formik.setFieldValue("metadata.statusColor", color);
    }, [reviewProcess, reviewDate]);

    useEffect(() => {
      updateStatus();
    }, [updateStatus]);

    const updateNeedReview = useCallback(() => {
      if (reviewProcess !== REVIEW_PROCESS_TYPES.NEEDS_REVIEW) {
        formik.setFieldValue('metadata.reviewFrequency', undefined);
        formik.setFieldValue('metadata.lastReview', undefined);
      }
    }, [reviewProcess]);

    const updateAutoRenewal = useCallback(() => {
      if (reviewProcess !== REVIEW_PROCESS_TYPES.AUTO_RENEWS) {
        formik.setFieldValue('metadata.term', undefined);
        formik.setFieldValue('metadata.termDuration', undefined);
        formik.setFieldValue('metadata.noticePeriod', undefined);
        formik.setFieldValue('metadata.periodDuration', undefined);
      }
    }, [reviewProcess]);

    useEffect(() => {
      updateNeedReview();
    }, [updateNeedReview]);

    useEffect(() => {
      updateAutoRenewal();
    }, [updateAutoRenewal]);

    function disabledDate(current: Dayjs) {
      if (reviewProcess === REVIEW_PROCESS_TYPES.AUTO_RENEWS) {
        return current && current.isBefore(dayjs().endOf('day'));
      } else {
        return false
      }
    }

    return (
      <div>
        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Review process"
                errorMessage={formik?.errors?.metadata?.reviewProcess}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={reviewProcessOptions}
                  onChange={(value) =>
                    formik.setFieldValue("metadata.reviewProcess", value)
                  }
                  value={reviewProcess}
                  status={formik.errors.metadata?.reviewProcess && "error"}

                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Start date"
              errorMessage={formik?.errors?.metadata?.startDate}
            >
              <DatePicker
                name="metadata.startDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) => {
                  formik.setFieldValue(
                    "metadata.startDate",
                    value?.toISOString()
                  );
                  updateLastRenewalDate(expiryDate, term, termDuration)
                }}
                value={startDate && dayjs(startDate)}
                status={formik.errors.metadata?.startDate && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        {reviewProcess === REVIEW_PROCESS_TYPES.AUTO_RENEWS && (
          <>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Term"
                  errorMessage={formik.errors?.metadata?.term}
                >
                  <Input
                    type="number"
                    name="metadata.term"
                    size="large"
                    placeholder="Enter here"
                    onChange={(e) => {
                      formik.setFieldValue("metadata.term", +e.target.value);
                      updateLastRenewalDate(expiryDate, +e.target.value, termDuration)
                    }}
                    value={term}
                    status={formik?.errors?.metadata?.term && "error"}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />

              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Term Duration"
                  errorMessage={formik.errors?.metadata?.termDuration}
                >
                  <Select
                    size="large"
                    placeholder="Select"
                    options={durationOptions}
                    onChange={(value) => {
                      formik.setFieldValue("metadata.termDuration", value);
                      updateLastRenewalDate(expiryDate, term, value)
                    }}
                    value={termDuration}
                    status={formik.errors.metadata?.termDuration && "error"}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Notice period (days)"
                  errorMessage={formik.errors?.metadata?.noticePeriod}
                >
                  <Input
                    type="number"
                    name="metadata.noticePeriod"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={noticePeriod}
                    status={formik?.errors?.metadata?.noticePeriod && "error"}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />

              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Period Duration"
                  errorMessage={formik.errors?.metadata?.periodDuration}
                >
                  <Select
                    size="large"
                    placeholder="Select"
                    options={durationOptions}
                    onChange={(value) =>
                      formik.setFieldValue("metadata.periodDuration", value)
                    }
                    value={periodDuration}
                    status={formik?.errors?.metadata?.periodDuration && "error"}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
          </>
        )}

        {reviewProcess === REVIEW_PROCESS_TYPES.NEEDS_REVIEW && (
          <>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Review Frequency"
                  errorMessage={formik.errors?.metadata?.reviewFrequency}
                >
                  <Select
                    size="large"
                    placeholder="Select"
                    options={frequencyOptions}
                    onChange={(value) => {
                      formik.setFieldValue("metadata.reviewFrequency", value);
                    }}
                    value={reviewFrequency}
                    status={
                      formik?.errors?.metadata?.reviewFrequency && "error"
                    }
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <div></div>
              </FlexBox>
            </FlexBox>
          </>
        )}

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Status"
              errorMessage={formik?.errors?.metadata?.status}
            >
              <Input
                disabled
                value={status}
                status={formik?.errors?.metadata?.status && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Expiry/ Renewal date"
              errorMessage={formik?.errors?.metadata?.expiryDate}
            >
              <DatePicker
                disabledDate={disabledDate}
                name="metadata.expiryDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) => {
                  formik.setFieldValue(
                    "metadata.expiryDate",
                    value?.toISOString()
                  );
                  if (value) {
                    updateLastRenewalDate(value?.toISOString(), term, termDuration)
                  }
                }}
                value={expiryDate && dayjs(expiryDate)}
                status={formik.errors.metadata?.expiryDate && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Parties"
              errorMessage={formik?.errors?.metadata?.parties}
            >
              <Input
                name="metadata.parties"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={parties}
                status={formik?.errors?.metadata?.parties && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection="column" flex={1}>
            <Field label="Owner/Department" errorMessage={formik?.errors?.metadata?.owner}>
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
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Last Renewal Date">
              <DatePicker
                name="metadata.lastRenewalDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                onChange={(value) => {
                  formik.setFieldValue(
                    "metadata.lastRenewalDate",
                    value?.toISOString()
                  );
                  if (value) {
                    updateLastRenewalDate(expiryDate, term, termDuration)
                  }
                }}
                value={lastRenewalDate && dayjs(lastRenewalDate)}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Review date">
              <DatePicker
                disabled
                name="metadata.reviewDate"
                size="large"
                placeholder="__/__/____"
                format="DD/MM/YYYY"
                value={reviewDate && dayjs(reviewDate)}
              />
            </Field>
          </FlexBox>


        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            {(reviewProcess === REVIEW_PROCESS_TYPES.NEEDS_REVIEW || reviewProcess === REVIEW_PROCESS_TYPES.AUTO_RENEWS) && (
              <Field label="Last review" sideContent={
                <>
                  <Space horizontal size={5} />
                  <Tooltip placement='top'
                    // eslint-disable-next-line max-len
                    title={"This is the date that the document was last formally reviewed.  This will set the review timetable for next review. This date is automatically updated if an item is approved in a board meeting and can also be manually entered if the item is reviewed outside of a board meeting run through SEEIO."}
                    color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </>
              }>
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
                  value={lastReview && dayjs(lastReview)}
                />
              </Field>
            )}
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <div></div>
          </FlexBox>
        </FlexBox>
      </div>
    );
  }
);
ContractDocumentForm.displayName = "ContractDocumentForm";

export default ContractDocumentForm;
