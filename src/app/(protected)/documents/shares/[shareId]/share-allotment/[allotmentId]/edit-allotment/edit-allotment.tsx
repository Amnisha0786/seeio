"use-client";

import React from "react";
import dayjs from "dayjs";
import { DatePicker, Radio } from "antd";

import Field from "@/components/field";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Typography from "@/components/typography";
import Button from "@/components/button";
import FilePicker from "@/shared/formik-file-picker";
import styles from "../../page.module.scss";

const EditAllotment = ({ formik }: { formik: any }) => {
  return (
    <>
      <FlexBox flexDirection="column" className={styles.infoBox}>
        <FlexBox className={styles.content}>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Date of Issue" errorMessage={formik.errors.name}>
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Tax scheme used"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.content}>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Number of shares allocated *"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Total consideration paid"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.content}>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Share premium"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Nominal value"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.content}>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Agregate nominal value"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Share Price"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
      </FlexBox>
      <Space size={24} />
      <FlexBox flexDirection="column" className={styles.infoBox}>
        <Typography red>
          Share certificate will be created as pdf and viewable through the
          burger menu once you save this form.
        </Typography>
        <Space size={24} />
        <FlexBox className={styles.halfWidth}>
          <FlexBox flexDirection="column" flex={1}>
            <FlexBox flexDirection="column">
              <FlexBox>
                <Radio.Group
                  name="incidentCancelled"
                  onChange={formik.handleChange}
                  //   value={formik.values.metadata.incidentCancelled}
                  defaultValue={"generate-share-certificate"}
                >
                  <Radio value={"generate-share-certificate"}>
                    Generate share certificate
                  </Radio>
                </Radio.Group>
              </FlexBox>
              {/* {formik.errors?.metadata?.incidentCancelled && (
                <>
                  <Space size={5} />
                  <Typography red size="small">
                    {formik.errors?.metadata?.incidentCancelled}
                  </Typography>
                </>
              )} */}
            </FlexBox>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.halfWidth}>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Agregate nominal value"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column">
            <Space horizontal size={160} />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.halfWidth}>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Document">
              <FilePicker
                fileBinaryKeyName={"fileBinary"}
                fileKeyName={"fileName"}
                form={formik}
                resetError={() => formik.setFieldError(`fileName`, undefined)}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.halfWidth}>
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label="Share Certificate Number"
              errorMessage={formik.errors?.metadata?.documentDate}
            >
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
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column">
            <Field label=" ">
              <Space size={14} />
              <Button>Get next number</Button>
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
      </FlexBox>
    </>
  );
};

export default EditAllotment;
