import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Toast from "@/components/toast";
import Field from "@/components/field";
import * as API from "@/api";
import { useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import DraftEditor from "@/components/draft-editor";

type TForm = {
  name: string;
  username: string;
  description?: string
  password: string
  id?: string
  references?: string
};

export const STATUS_OPTIONS = [
  {
    label: "Not started",
    value: "not-started",
  },
  {
    label: "In progress",
    value: "in-progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Abandoned",
    value: "abandoned",
  },
];

// eslint-disable-next-line max-len
const EDITOR_INITIAL_VALUE = '{\"blocks\":[{\"key\":\"cneuh\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}'

const initialValues = {
  name: "",
  username: "",
  description: EDITOR_INITIAL_VALUE,
  password: "",
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required."),
  username: yup.string().required("User Name is required."),
  password: yup.string().required("Reference code is required."),
  description: yup.string().max(200, "Description should be of 200 characters"),
});

const AddDocumentModal = forwardRef(
  (
    {
      onSuccess,
      isEdit = false,
    }: {
      onSuccess: (searchData?: string[]) => void;
      isEdit?: boolean
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const companyId = useSelectedAccountCompany()?.companyId;

    const formik = useFormik<TForm>({
      enableReinitialize: true,
      validateOnChange: false,
      initialValues: initialValues,
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        setLoading(true);

        try {
          if (isEdit) {
            await API.editDocument(companyId, values)
            Toast.success('Code update successfully')
            setOpen(false);
            formik.resetForm()
            onSuccess()

          } else {

            await API.addNewDocument(companyId, values)
            Toast.success('Code added successfully')
            setOpen(false);
            formik.resetForm()
            onSuccess()
          }
        } catch (error) {
          Toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        open: (action: TForm) => {
          if (action && isEdit) {
            formik.setValues({
              name: action?.name || "",
              description: action?.description || EDITOR_INITIAL_VALUE,
              username: action?.username || '',
              password: action?.references ? action?.references[0] : '',
              id: action?.id || ''
            });
          }
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );

    return (
      <Modal 
        open={open} 
        width={780} 
        onCancel={() => {
          setOpen(false)
          formik.resetForm()
        }}
      >
        <div className={styles.addActionModal}>
          <Typography size="huge">{`${"Add"}`} New</Typography>

          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Name" errorMessage={formik.errors.name}>
                <Input
                  size="large"
                  placeholder="Enter here"
                  onChange={(value) => formik.setFieldValue("name", value.target.value)}
                  value={formik.values.name}
                  status={formik.errors.name && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label="User name" errorMessage={formik.errors.username}>
                <Input
                  size="large"
                  placeholder="Enter here"
                  onChange={(value) => formik.setFieldValue("username", value.target.value)}
                  value={formik.values.username}
                  status={formik.errors.username && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>

          <Space size={24} />

          <FlexBox flexDirection="column">
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Description (200 Characters)"
                errorMessage={formik.errors.description}
              >
                <DraftEditor
                  onChange={(value) => formik.setFieldValue("description", value)}
                  value={formik.values.description || ''}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Reference code"
                errorMessage={formik.errors.password}
              >
                <Input
                  size="large"
                  placeholder="Enter here"
                  onChange={(value) => formik.setFieldValue("password", value.target.value)}
                  value={formik.values.password}
                  status={formik.errors.password && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <></>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox justifyContent="flex-end">
            <Button
              type="primary"
              loading={loading}
              onClick={() => formik.handleSubmit()}
            >
              {"Save"}
            </Button>
          </FlexBox>
        </div>
      </Modal>
    );
  }
);

AddDocumentModal.displayName = "AddDocumentModal";

export default AddDocumentModal;
