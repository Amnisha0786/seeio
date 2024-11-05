import { forwardRef, useImperativeHandle, useState } from "react";
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
import styles from "./page.module.scss";

type TForm = {
  name: string;
  parentId: string;
  description: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Folder Name is required."),
  description: yup.string().required("Folder Description is required."),
});

const AddFolderModal = forwardRef(
  (
    {
      onSuccess,
      companyId,
      recordId,
    }: { onSuccess: () => void; companyId: string; recordId: string },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik<TForm>({
      validateOnChange: false,
      enableReinitialize: true,
      initialValues: {
        name: "",
        parentId: recordId,
        description: "",
      },
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        setLoading(true);

        try {
          await API.addFolder(companyId, recordId, values);
          Toast.success("Create Folder Successfully");
          onSuccess();
          setOpen(false);
        } catch (err: any) {
          Toast.error(err?.message || "Something went wrong.")
        } finally {
          setLoading(false);
        }
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          formik.resetForm();
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );

    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)} className="add_folder">
        <div className={styles.addFolderModal}>
          <Typography size="huge">Add a Folder</Typography>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Folder Name" errorMessage={formik.errors.name}>
                <Input
                  name="name"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  status={formik.errors.name && "error"}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Folder Description"
                errorMessage={formik.errors.description}
              >
                <Input
                  name="description"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  status={formik.errors.description && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox justifyContent="flex-end">
            <Space horizontal size={16} />
            <Button
              type="primary"
              loading={loading}
              onClick={() => formik.handleSubmit()}
            >
              Save
            </Button>
          </FlexBox>
        </div>
      </Modal>
    );
  }
);

AddFolderModal.displayName = "AddFolderModal";

export default AddFolderModal;
