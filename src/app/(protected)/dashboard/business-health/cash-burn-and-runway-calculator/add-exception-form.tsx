import React from "react";
import { Col, Input, Row, Select } from "antd";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import AddButton from "@/components/add-button";
import styles from "../corporate-objectives/action-form.module.scss";
import Button from "@/components/button";
import Space from "@/components/space";
import Clickable from "@/components/clickable";
import Field from "@/components/field";
import DraftEditor from "@/components/draft-editor";
import { DRAFT_EDITOR_EMPTY_TEXT, SYMBOLS } from '@/constants';
import { Currency } from '@/models';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const CATEGORY_OPTION = [
  {
    label: "Expected One off expense",
    value: "One-off expected expense",
  },
  {
    label: "Expected One off cash receipt",
    value: "One-off expected cash receipts",
  },
  {
    label: "Exceptional Expense",
    value: "Expected exceptional expense",
  },
  {
    label: "Exceptional Cash receipt",
    value: "Expected exceptional cash receipts",
  },
  {
    label: "Known changes to expenditure",
    value: "Known Changes Expense",
  },
  {
    label: "Known changes to revenue",
    value: "Known Changes Revenue",
  },
];

const AddExceptionForm = ({
  loading = false,
  formik,
  period,
  currency,
  handleUpdate,
  rootfiCompanyId
}: {
  onSuccess: (values: any) => void;
  loading?: boolean;
  formik: any;
  period: string
  rootfiCompanyId?: number
  currency: Currency
  handleUpdate?: any
}) => {
  const onClickDelete = (index: number) => {
    if (formik.values?.input) {
      const input = [...formik.values?.input];
      handleUpdate(input[index])
      input.splice(index, 1);
      formik.setFieldValue("input", input);
    }
  };
  return (
    <>
      <div className={styles.setupACompanyModal}>
        {formik.values.input?.map((input: any, index: number) => (
          <React.Fragment key={index}>
            <Space size={25} />
            <FlexBox justifyContent="space-between">
              <FlexBox>
                <Typography size="enormous">{`Exception ${index + 1} `}</Typography>
                <Space horizontal size={10} />
              </FlexBox>

              {index > 0 && <Clickable onClick={() => onClickDelete(index)}>
                <Image
                  src="/icons/delete-icon.svg"
                  alt="delete icon"
                  width={24}
                  height={24}
                />
              </Clickable>}
            </FlexBox>

            <Space size={24} />

            <FlexBox className={styles.card} flexDirection="column">
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <FlexBox flexDirection="column">
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field
                          label="Period"
                          errorMessage={
                            Array.isArray(formik.errors?.input)
                              ? formik?.errors?.input?.[index]?.period
                              : ""
                          }
                        >
                          <Input
                            name="period"
                            size="middle"
                            disabled
                            status={
                              formik?.errors?.input?.[index]?.period && "error"
                            }
                            onChange={(value) =>
                              formik.setFieldValue(
                                `input[${index}].period`,
                                (value)
                              )
                            }
                            value={dayjs(input?.period).format("MMM-YY")}
                          />
                        </Field>
                      </Col>
                      <Col span={12}></Col>
                    </Row>
                    <Space size={15} />
                    <Typography color="#00293F">{`Exception Item #${index + 1
                    }`}</Typography>
                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field
                          label="Name"
                          errorMessage={
                            Array.isArray(formik.errors?.input)
                              ? formik?.errors?.input?.[index]?.category
                              : ""
                          }
                        >
                          <Select
                            size="large"
                            placeholder="Select"
                            options={CATEGORY_OPTION}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `input[${index}].category`,
                                value
                              )
                            }
                            value={input?.category}
                            status={
                              Array.isArray(formik.errors?.input) &&
                              formik?.errors?.input?.[index]?.category &&
                              "error"
                            }
                          />
                        </Field>
                      </Col>
                      <Col span={12}>
                        <Field
                          label="Amount"
                          errorMessage={
                            Array.isArray(formik.errors?.input)
                              ? formik?.errors?.input?.[index]?.amount
                              : ""
                          }
                        >
                          <Input
                            name={`input[${index}].amount`}
                            size="large"
                            placeholder="amount"
                            onChange={formik.handleChange}
                            value={input.amount}
                            prefix={<>{SYMBOLS[currency || "GBP"]}</>}
                            type="number"
                            status={
                              Array.isArray(formik.errors?.input) &&
                              formik?.errors?.input?.[index]?.amount &&
                              "error"
                            }
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Field
                          label="Notes"
                          errorMessage={
                            Array.isArray(formik.errors?.input)
                              ? formik?.errors?.input?.[index]?.notes
                              : ""
                          }
                        >
                          <DraftEditor
                            onChange={(value) => {
                              formik.setFieldValue(
                                `input[${index}].notes`,
                                value
                              )
                            }
                            }
                            value={formik?.values?.input[index]?.notes || ""}
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Space size={25} />
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
          </React.Fragment>
        ))}
        <Space size={24} />
        <FlexBox
          className={styles.addinput}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography size="huge">Add New Exception</Typography>
          <AddButton
            onClick={() =>
              formik.setFieldValue("input", [
                ...(formik.values?.input || []),
                {
                  category: "",
                  period: period,
                  amount: null,
                  notes: DRAFT_EDITOR_EMPTY_TEXT,
                  rootfiCompanyId: rootfiCompanyId
                },
              ])
            }
          />
        </FlexBox>

        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Button
              loading={loading}
              type="primary"
              onClick={() => formik.handleSubmit()}
            >
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddExceptionForm;
