import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
// import * as yup from 'yup'

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import Space from "@/components/space";
import Toast from "@/components/toast";
import * as API from "@/api";
import styles from "./page.module.scss";
import { AddCode } from "@/models/pass-store";
import PassStoreForm from './pass-store-form';

// const validationSchema = yup.object().shape({
//   title: yup.string().required(),
// })

const AddPassStoreModal = forwardRef(
  ({ onSuccess }: { onSuccess: () => void }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik<AddCode>({
      validateOnChange: false,
      initialValues: {
        documentType: "",
        code1Name: "",
        code1: "",
        code2Name: "",
        code2: "",
        notes: "",
        passwords: [
          {
            url: "",
            username: "",
            password: "",
            pin: "",
            associatedEmail: "",
            associatedPhone: "",
            notes: "",
          }
        ]
      },
      // validationSchema,
      onSubmit: async (values): Promise<void> => {
        setLoading(true);

        try {
          await API.createMockPassStore(values);
          Toast.success("Created Pass store Successfully");
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
      <Modal open={open} width={780} onCancel={() => setOpen(false)}>
        <div className={styles.addFolderModal}>
          <Typography size="huge">Add Code</Typography>
          <Space size={24} />
          <PassStoreForm
            formik={formik}
            loading={loading}
            saveButtonText='Save'
          />
        </div>
      </Modal>
    );
  }
);

AddPassStoreModal.displayName = "AddPassStoreModal";

export default AddPassStoreModal;
