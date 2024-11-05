import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "antd";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import Button from "@/components/button";
import Space from "@/components/space";
import Modal from "@/components/modal";

import Field from "@/components/field";
import DraftEditor from "@/components/draft-editor";


export type TNotes = {
  subject: string,
  description?: string,
  user?: string,
  date?: string,
  id?: string
}

const AddNotesModal = forwardRef(
  (
    {
      loading = false,
      formik,
    }: {
      loading?: boolean;
      formik: any;
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => {
          handleCancel();
        },
      }),
      []
    );
    const handleCancel = () => {
      setOpen(false);
      formik.resetForm();
    };

    return (
      <>
        <Modal open={open} width={670} onCancel={handleCancel}>
          <FlexBox flexDirection="column">
            <Typography size="giant">Add Notes</Typography>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Subject" labelProps={{ gray: true }}
                  errorMessage={formik.errors.subject}>
                  <Input
                    name="subject"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.subject}
                    status={formik.errors.subject}
                  />
                </Field>
              </FlexBox>
            </FlexBox>

            <Space size={14} />

            <Field label="Notes Fields" labelProps={{ gray: true }}
              errorMessage={formik.errors.description}>
              <DraftEditor
                onChange={(value) => formik.setFieldValue("description", value)}
                value={formik.values.description}
              />
            </Field>

          </FlexBox>
          <Space size={14} />
          <FlexBox justifyContent="flex-end">
            <Button
              loading={loading}
              onClick={() => {
                formik.handleSubmit();
              }}
              type="primary"
            >
              Submit
            </Button>
          </FlexBox>
        </Modal>
      </>
    );
  }
);

AddNotesModal.displayName = "AddNotesModal";

export default AddNotesModal;
