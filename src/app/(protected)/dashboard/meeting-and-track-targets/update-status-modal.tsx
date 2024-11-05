import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Select } from "antd";
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
import { TAction } from "@/models";
import { useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import ConfirmDelete from "@/shared/confirm-delete";

type TForm = {
  name?: string
  status?: string;
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

const initialValues = {
  name: "",
  status: "",
};

const validationSchema = yup.object().shape({});

const getStatus = (status?: string) => {
  if (status) {
    const val = STATUS_OPTIONS.filter((item) => item.value === status)
    return val[0]?.label
  }
}

const UpdateStatusModal = forwardRef(
  (
    {
      onSuccess,
      isEdit = true,
      searchData,
    }: {
      onSuccess?: (searchData?: string[]) => void;
      isEdit?: boolean;
      searchData?: string[];
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionToEdit, setActionToEdit] = useState("");
    const companyId = useSelectedAccountCompany()?.companyId;
    const updateStatusRef = useRef<any>();

    const formik = useFormik<TForm>({
      enableReinitialize: true,
      validateOnChange: false,
      initialValues: initialValues,
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        setLoading(true);

        try {
          if (!companyId) return;
          if (isEdit) {
            await API.updateActionstatus({
              companyId,
              actionId: actionToEdit,
              status: values?.status,
            });
            Toast.success("Updated Successfully!");
          }
          if (onSuccess) {
            onSuccess(searchData);
          }
          updateStatusRef.current.close();
          setOpen(false);
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
        open: (action: TAction) => {
          if (action && isEdit) {
            setActionToEdit(action.id);

            formik.setValues({
              name: action?.name || '',
              status: action?.status || "",
            });
          }
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );
    return (
      <Modal open={open} width={500} onCancel={() => setOpen(false)}>
        <div className={styles.addActionModal}>
          <Typography size="huge">{`${"Update"}`} Status</Typography>
          <Space size={24} />

          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Status" errorMessage={formik.errors.status}>
                <Select
                  size="large"
                  placeholder="Choose status"
                  options={STATUS_OPTIONS}
                  onChange={(value) => formik.setFieldValue("status", value)}
                  value={formik.values.status}
                  status={formik.errors.status && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox justifyContent="flex-end">
            <Button
              type="primary"
              loading={loading}
              onClick={() => updateStatusRef.current.open()}
            >
              {"Update"}
            </Button>
          </FlexBox>
        </div>
        <ConfirmDelete
          ref={updateStatusRef}
          handleConfirm={formik.handleSubmit}
          loading={loading}
          message={`Are you sure you want mark as ${getStatus(formik?.values?.status)} ${formik?.values?.name}?`}
        />
      </Modal>
    );
  }
);
UpdateStatusModal.displayName = "UpdateStatusModal";

export default UpdateStatusModal;
