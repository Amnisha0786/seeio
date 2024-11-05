import { forwardRef, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
// import * as yup from 'yup'

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import Toast from "@/components/toast";
import * as API from "@/api";
import { AddCode } from "@/models/pass-store";
import AddPasswordForm from './store-password-form';

// const validationSchema = yup.object().shape({
//   title: yup.string().required(),
// })

const AddPasswordStoreModal = forwardRef(
  ({ onSuccess }: { onSuccess: () => void }, ref) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik<AddCode>({
      validateOnChange: false,
      initialValues: {
        passwords: [
          {
            url: "",
            username: "",
            password: "",
            pin: "",
            associatedEmail: "",
            associatedPhone: "",
            notes: "",
          },
        ],
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
          Toast.error(err?.message || "Something went wrong.");
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
        <Typography size="huge">Add Password</Typography>
        <AddPasswordForm
          loading={loading}
          saveButtonText={"Save"}
          formik={formik}

        />
      </Modal>
    );
  }
);

AddPasswordStoreModal.displayName = "AddPasswordStoreModal";

export default AddPasswordStoreModal;
