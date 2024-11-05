import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useFormik } from "formik";
import * as yup from 'yup';
import decamelizeKeys from "decamelize-keys"

import Modal from "@/components/modal";
import * as API from "@/api";
import Toast from "@/components/toast";
import AddExceptionForm from "./add-exception-form";
import { useSelectedAccountCompany } from "@/hooks"
import { Currency } from '@/models';
import { DRAFT_EDITOR_EMPTY_TEXT } from "@/constants"

interface Props {
  fetchData: () => void;
  rootifyId?: number,
  currency: Currency,
  data: any,
  isEdit?: boolean,
}

const validationSchema = yup.object().shape({
  input: yup.array().of(
    yup.object().shape({
      category: yup.string().required("Exception name is required."),
      period: yup.string().required("Exception period is required."),
      amount: yup.number().required("Exception amount is required."),
    })
  ),
});

const AddExceptionModal = forwardRef(
  (
    {
      fetchData,
      rootifyId,
      data,
      currency,
      isEdit
    }: Props,
    ref
  ) => {
    const [deleteArray, setDeleteArray] = useState<any>([])

    const handleUpdate = (remove?: any) => {
      if (remove && remove?.id !== undefined) {
        setDeleteArray([...deleteArray, { rootfiCompanyId: remove?.rootfiCompanyId, id: remove?.id, period: remove?.period }])
      }
    }

    const initialValues = useMemo(() => {
      return (
        {
          input: [
            {
              category: "",
              period: data?.period,
              amount: null,
              notes: DRAFT_EDITOR_EMPTY_TEXT,
            },
          ],
        }
      )
    }, [data]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const company = useSelectedAccountCompany()

    const exceptionObject = useMemo(() => {
      const exceptionalItemsArray = {
        input: data?.exceptionalItems
      }
      if (exceptionalItemsArray && isEdit) {
        return exceptionalItemsArray;
      }

    }, [data]);
    const formik = useFormik<any>({
      validateOnChange: false,
      initialValues: exceptionObject ? exceptionObject : initialValues,
      validationSchema,
      enableReinitialize: true,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          if (!rootifyId) return
          if (isEdit) {
            const newItems = formik?.values?.input.filter((item: any) => item?.id === undefined)
            const UpdatedItems = formik?.values?.input.filter((item: any) => item?.id !== undefined)
            handleUpdate()
            await API.editException({
              companyId: company?.companyId,
              ...{
                rootfiCompanyId: rootifyId,
                delete: decamelizeKeys(deleteArray),
                update: decamelizeKeys(UpdatedItems),
                create: decamelizeKeys(newItems)
              }
            });
            setDeleteArray([])
            formik.resetForm();
            onSuccess();
          } else {
            await API.addException({
              ...values,
              companyId: company?.companyId,
              rootfiCompanyId: rootifyId
            });
            formik.resetForm();
            onSuccess();
          }
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
          setOpen(true);
        },
        close: () => {
          handleCancel();
        },
      }),
      []
    );

    const onSuccess = () => {
      setOpen(false);
      fetchData();
    };

    const handleCancel = () => {
      setOpen(false);
      formik.resetForm();
    };

    return (
      <Modal open={open} width={970} onCancel={handleCancel}>
        <AddExceptionForm
          period={data?.period}
          onSuccess={onSuccess}
          formik={formik}
          loading={loading}
          currency={currency}
          handleUpdate={handleUpdate}
          rootfiCompanyId={rootifyId}
        />
      </Modal>
    );
  }
);

AddExceptionModal.displayName = "AddExceptionModal";

export default AddExceptionModal;
