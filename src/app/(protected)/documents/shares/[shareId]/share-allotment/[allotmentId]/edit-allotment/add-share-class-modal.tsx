"use-client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Input, ModalProps, Radio, Select } from "antd";
import { useFormik } from "formik";
import TextArea from "antd/es/input/TextArea";

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Field from "@/components/field";
import CurrencySelect from "@/app/(protected)/dashboard/business-health/corporate-objectives/currency-select";

interface IProps extends ModalProps {}

const SHARE_TYPE_OPTIONS = [
  {
    value: "share-type-1",
    label: "Share type 1",
  },
  {
    value: "share-type-2",
    label: "Share type 2",
  },
  {
    value: "share-type-3",
    label: "Share type 3",
  },
];

const AddShareClassModal = forwardRef(({ ...props }: IProps, ref) => {
  const deleteModelRef = useRef<any>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik: any = useFormik({
    validateOnChange: false,
    initialValues: {},
    onSubmit: async (values) => {},
  });

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setOpen(true);
      },
      close: () => setOpen(false),
    }),
    []
  );

  return (
    <Modal width={780} open={open} {...props}>
      <div>
        <Typography size="giant">Add a Share Class</Typography>
        <Space size={24} />
        <div>
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Share Type">
                <Select
                  size="middle"
                  placeholder="Select"
                  options={SHARE_TYPE_OPTIONS}
                  onChange={(value) => formik.setFieldValue("shareType", value)}
                  value={formik.values.shareType}
                  status={formik.errors.shareType && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Is this a warrant/option?">
                <Space size={8} />
                <Radio.Group
                  name="isWarrant"
                  onChange={formik.handleChange}
                  value={formik?.isWarrant}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Currency">
                <CurrencySelect
                  onChange={(value) => formik.setFieldValue("currency", value)}
                  value={formik?.currency}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Nominal value"
                errorMessage={formik.errors.nominalValue}
              >
                <Input
                  name="nominalValue"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.nominalValue}
                  status={formik.errors.nominalValue && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Voting rights">
                <Select
                  size="middle"
                  placeholder="Select"
                  options={SHARE_TYPE_OPTIONS}
                  onChange={(value) =>
                    formik.setFieldValue("votingRights", value)
                  }
                  value={formik.values.votingRights}
                  status={formik.errors.votingRights && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Dividend rights">
                <Select
                  size="middle"
                  placeholder="Select"
                  options={SHARE_TYPE_OPTIONS}
                  onChange={(value) =>
                    formik.setFieldValue("dividentRights", value)
                  }
                  value={formik.values.dividentRights}
                  status={formik.errors.dividentRights && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Rights to Capital">
                <Select
                  size="middle"
                  placeholder="Select"
                  options={SHARE_TYPE_OPTIONS}
                  onChange={(value) =>
                    formik.setFieldValue("capitalRights", value)
                  }
                  value={formik.values.capitalRights}
                  status={formik.errors.capitalRights && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <div></div>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Description">
                <TextArea
                  rows={4}
                  name={"description"}
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik?.description || ""}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Share Class Name">
                <Select
                  size="middle"
                  placeholder="Select"
                  options={SHARE_TYPE_OPTIONS}
                  onChange={(value) =>
                    formik.setFieldValue("shareClassName", value)
                  }
                  value={formik.values.shareClassName}
                  status={formik.errors.shareClassName && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label=" ">
                <Button className="">Generate</Button>
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Notes">
                <TextArea
                  rows={4}
                  name={"notes"}
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik?.notes || ""}
                />
              </Field>
            </FlexBox>
          </FlexBox>
        </div>
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Submit
          </Button>
        </FlexBox>
      </div>
    </Modal>
  );
});
AddShareClassModal.displayName = "AddShareClassModal";

export default AddShareClassModal;
