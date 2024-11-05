import { forwardRef, useCallback, useEffect, useState } from "react";
import { Input, DatePicker, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Field from "@/components/field";
import DepartmentSelect from "@/shared/department-select"
import { useAccessLevel, useSelectedAccountCompany } from "@/hooks"
import * as API from '@/api'
import Toast from "@/components/toast"

dayjs.extend(utc);

const REVIEW_PROCESS = [
  {
    label: "No longer required",
    value: "No longer required",
  },
  {
    label: "Specific review trigger",
    value: "specific review trigger",
  },
  {
    label: "Annual review",
    value: "annual review",
  },
  {
    label: "6 monthly review",
    value: "6 monthly review",
  },
  {
    label: "Quarterly review",
    value: "quarterly review",
  },
  {
    label: "Subject to contract",
    value: "subject to contract",
  }
];

export const STATUS_TYPES = [
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "In force",
    value: "In Force",
  },
  {
    label: "Lapsed",
    value: "Lapsed",
  },
  {
    label: "Terminated",
    value: "Terminated",
  },
];

export const SUPPLIER_STATUS = {
  NOT_REQUIRED: "Not required",
  PENDING_APPROVAL: "Pending approval",
  REVIEW_OVERDUE: "Review Overdue",
  REVIEW_DUE: "Review due",
  APPROVED: "Approved"
}

const ApprovedSupplierForm = forwardRef(({ formik }: { formik: any }, ref) => {

  const {
    currentlyRequired,
    reviewDate,
    dateLastReviewed,
    dateFirstApproved,
    contractRenewalDate,
    other,
    supplierType,
    status,
    reviewProcess,
    notes,
    noticePeriod
  } = formik.values.metadata

  const [accountingReferenceDate, setAccountingReferenceDate] = useState<any>(null);
  const [numBoardMeetings, setNumBoardMeetings] = useState<number>(0)

  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()

  const getAccountingReferenceDate = async () => {
    if (!companyId || !userAccess) return;
    try {
      const result = await API.getCompanyKeyDates({
        companyId,
      });
      const date = result?.accountingReferenceDate
        ? dayjs(
          `${dayjs().year()}-${result?.accountingReferenceDate?.month}-${result?.accountingReferenceDate?.day
          }`
        )
        : null;
      setAccountingReferenceDate(date);
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong");
    }
  };

  const getNumboardMeetings = async () => {
    if (!companyId || !userAccess) return;
    try {
      const result = await API.getCompanyMetadata({
        companyId,
      });
      setNumBoardMeetings(result?.numBoardMeetings);
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getAccountingReferenceDate()
    getNumboardMeetings()
  }, [companyId, userAccess])

  const updateStatus = useCallback(() => {
    let status, color;
    if (!dateFirstApproved) {
      status = SUPPLIER_STATUS.PENDING_APPROVAL
      color = "red"
    } else if (reviewDate && dayjs(reviewDate).isBefore(dayjs())) {
      status = SUPPLIER_STATUS.REVIEW_OVERDUE
      color = "red"
    } else if (reviewDate && (dayjs(reviewDate).diff(dayjs(), 'day') < 60)) {
      status = SUPPLIER_STATUS.REVIEW_DUE
      color = "yellow"
    } else {
      status = SUPPLIER_STATUS.APPROVED
      color = "green"
    }
    formik.setFieldValue("metadata.status", status);
    formik.setFieldValue("metadata.statusColor", color);
  }, [dateFirstApproved, reviewDate, currentlyRequired]);

  const updateReviewProcess = useCallback(() => {
    let reviewDate = undefined;

    switch (reviewProcess) {
    case "no longer required":
      reviewDate = null;
      break;

    case "specific review trigger":
      reviewDate =
          supplierType === "Accountant" || supplierType === "Auditor"
            ? new Date(accountingReferenceDate)
            : null;
      break;

    case "annual review":
      if (!dateFirstApproved) {
        reviewDate = dayjs(new Date());
      } else if (dateLastReviewed) {
        reviewDate = dayjs(dateLastReviewed).add(12, "month");
      }
      break;

    case "6 monthly review":
      if (!dateFirstApproved) {
        reviewDate = dayjs(new Date());
      } else if (dateLastReviewed) {
        reviewDate = dayjs(dateLastReviewed).add(6, "month");
      }
      break;

    case "quarterly review":
      if (!dateFirstApproved) {
        reviewDate = dayjs(new Date());
      } else if (dateLastReviewed) {
        reviewDate = dayjs(dateLastReviewed).add(3, "month");
      }
      break;

    case "subject to contract":
      if (numBoardMeetings && noticePeriod && contractRenewalDate) {
        reviewDate = new Date(
          new Date(contractRenewalDate).getTime() -
            (noticePeriod - 365 / numBoardMeetings)
        );
      }
      break;
    default:
      break;
    }
    formik.setFieldValue("metadata.reviewDate", reviewDate?.toISOString());
  }, [
    dateLastReviewed,
    dateFirstApproved,
    reviewProcess,
    supplierType,
    noticePeriod,
    numBoardMeetings,
    accountingReferenceDate,
    contractRenewalDate,
  ]);

  useEffect(() => {
    updateReviewProcess()
  }, [updateReviewProcess]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const updateOther = useCallback(() => {
    if (supplierType !== "Other") {
      formik.setFieldValue('metadata.other', undefined);
    }
  }, [supplierType]);

  useEffect(() => {
    updateOther();
  }, [updateOther]);

  function disabledDate(current: Dayjs) {
    return current && current.isAfter(dayjs().endOf('day'));
  }

  return (
    <div>
      {supplierType === "Other" && (
        <>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Other Supplier Type" errorMessage={formik.errors.metadata?.other}>
                <Input
                  name="metadata.other"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={other}
                  status={formik.errors.metadata?.other && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
        </>
      )}
      <Space size={24} />
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

        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Space horizontal size={24} />
          <Field label="Status">
            <Input
              disabled
              value={status}
            />
          </Field>
        </FlexBox>
      </FlexBox>

      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Date First Approved">
            <DatePicker
              disabledDate={disabledDate}
              name="metadata.dateFirstApproved"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value: Dayjs | null) =>
                formik.setFieldValue(
                  "metadata.dateFirstApproved",
                  value?.toISOString()
                )
              }
              value={dateFirstApproved && dayjs(dateFirstApproved)}
            />
          </Field>
        </FlexBox>

        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Review Date">
            <DatePicker
              disabled
              name="metadata.reviewDate"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              value={
                reviewDate &&
                dayjs(reviewDate)
              }
            />
          </Field>
        </FlexBox>
      </FlexBox>

      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Date Last Reviewed" sideContent={<><Space horizontal size={5} />
            <Tooltip placement='top'
              // eslint-disable-next-line max-len
              title={"This is the date that the document was last formally reviewed.  This will set the review timetable for next review. This date is automatically updated if an item is approved in a board meeting and can also be manually entered if the item is reviewed outside of a board meeting run through SEEIO."}
              color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
              <InfoCircleOutlined />
            </Tooltip>
          </>}>
            <DatePicker
              disabledDate={disabledDate}
              name="metadata.dateLastReviewed"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value: Dayjs | null) =>
                formik.setFieldValue(
                  "metadata.dateLastReviewed",
                  value?.toISOString()
                )
              }
              value={dateLastReviewed && dayjs(dateLastReviewed)}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label='Review Process'
            errorMessage={formik.errors.metadata?.reviewProcess}
          >
            <Select
              size='large'
              placeholder='Select'
              options={REVIEW_PROCESS}
              onChange={(value) =>
                formik.setFieldValue("metadata.reviewProcess", value)
              }
              value={reviewProcess}
              status={formik.errors.metadata?.reviewProcess && "error"}
            />
          </Field>
        </FlexBox>
      </FlexBox>

      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          {reviewProcess === "subject to contract" && <Field label="Contract Renewal Date"
            errorMessage={formik.errors.metadata?.contractRenewalDate}
          >
            <DatePicker
              name="metadata.contractRenewalDate"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value: Dayjs | null) =>
                formik.setFieldValue(
                  "metadata.contractRenewalDate",
                  value?.toISOString()
                )
              }
              value={contractRenewalDate && dayjs(contractRenewalDate)}
            />
          </Field>}
        </FlexBox>

        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          {reviewProcess === "subject to contract" && <Field
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
          </Field>}
        </FlexBox>
      </FlexBox>

      <FlexBox flexDirection="column" flex={1}>
        <Field label="Notes" errorMessage={formik?.errors?.metadata?.notes}>
          <Input
            name="metadata.notes"
            size="large"
            placeholder="Enter here"
            onChange={formik.handleChange}
            value={notes}
            status={formik.errors.metadata?.notes && "error"}
          />
        </Field>
      </FlexBox>
    </div>
  );
});
ApprovedSupplierForm.displayName = "ApprovedSupplierForm";

export default ApprovedSupplierForm;
