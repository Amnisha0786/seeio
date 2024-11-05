import React, { forwardRef, useEffect, useState } from 'react';
import { DatePicker, Input, Select } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

import Modal from '@/components/modal';
import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Button from '@/components/button';
import Space from '@/components/space';
import Field from '@/components/field';
import styles from './page.module.scss';
import * as API from '@/api'
import { useSelectedAccountCompany } from '@/hooks'
import Toast from '@/components/toast'

type TForm = {
  value: string | null;
  status: string;
  period?: dayjs.Dayjs | string | null;
  revenue?: number | null;
  rootfiCompanyId?: number
};

type TDocument = {
  cashBalances: {
    value: string;
    status: string;
    period: string;
    rootfiCompanyId?: number,
    balance: string
  }
  revenue: {
    id?: string;
    balance?: number;
    period?: string;
    rootfiCompanyId?: string;
  }
}

export const STATUS_OPTIONS = [
  {
    label: 'VERIFIED',
    value: 'VERIFIED'
  }, {
    label: 'PROVISIONAL',
    value: 'PROVISIONED'
  }
]

const validationSchema = yup.object().shape({
  status: yup.string().required("Status is required."),
  value: yup.string().required("Cash Balance is required."),
  period: yup.string().required("Period is required."),
});

const EditDocumentModal = forwardRef(
  (
    {
      open,
      setOpen,
      data,
      rootiFyId,
      onSuccess,
      isEdit = false
    }: {
      open: any,
      setOpen: () => void,
      rootiFyId?: number,
      data?: TDocument,
      onSuccess: () => void
      isEdit?: boolean
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const company = useSelectedAccountCompany()
    const [details, setDetails] = useState<TForm | null>(null)

    useEffect(() => {
      if (data) {
        setDetails({
          value: data?.cashBalances?.balance,
          period: dayjs(data?.cashBalances?.period),
          status: data?.cashBalances?.status,
          revenue: data?.revenue?.balance,
        })
      }
    }, [data])

    const initialValues = {
      value: null,
      period: null,
      status: "PROVISIONED",
      revenue: null,
    };

    const formik = useFormik<TForm>({
      enableReinitialize: true,
      validateOnChange: false,
      initialValues: (data && isEdit && details) ? details : initialValues,
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        if (values.period) {
          values.period = dayjs(values.period).format("YYYY-MM")
        }
        if (!company) return
        setLoading(true);
        try {
          if (isEdit) {
            await API.updateCash({
              companyId: company?.companyId,
              rootiFyId: rootiFyId,
              ...{
                period: values.period,
                status: values.status,
                value: values.value,
              },
            });
            if (data?.revenue?.balance !== values.revenue) {
              await API.updateRevenue({
                companyId: company?.companyId,
                rootiFyId: rootiFyId,
                ...{
                  value: values.revenue,
                  period: values.period
                }
              })
            }
            setLoading(false);
            onSuccess()
            setOpen()
            formik.resetForm()
          } else {
            if (values) {
              await API.addNewCashRevenueDocument({
                companyId: company?.companyId,
                rootiFyId: rootiFyId,
                ...{
                  period: values?.period,
                  cashValue: values?.value,
                  revenueValue: values?.revenue,
                  status: values?.status
                }
              })
              setLoading(false);
              onSuccess()
              setOpen()
              formik.resetForm()

            }
          }
        } catch (error) {
          Toast.error("Something went wrong")
        } finally {
          setLoading(false);
        }
      },
    });

    return (
      <Modal open={open} width={780} onCancel={() => {
        setOpen()
        formik.resetForm()
      }}>
        <div className={styles.addActionModal}>
          <Typography size='huge'>{`${isEdit ? 'Edit' : 'Add'}`} data</Typography>
          <Space size={24} />
          <FlexBox>

            <FlexBox flexDirection='column' flex={1}>
              <Field label='Period' errorMessage={formik.errors.period}>
                {isEdit ? <Input
                  className={styles.editData}
                  disabled
                  size='large'
                  onChange={(value) => formik.setFieldValue('period', value)}
                  value={dayjs(formik.values?.period).format("MMM-YY")}
                />
                  : <DatePicker
                    name="date"
                    size='large'
                    placeholder='__ __'
                    picker="month"
                    format={'MMM-YY'}
                    onChange={(value) => formik.setFieldValue('period', value)}
                    value={formik.values?.period ? dayjs(formik.values?.period) : null}
                  />}
              </Field>
            </FlexBox>
            <Space horizontal size={24} />

            <FlexBox flexDirection='column' flex={1}>
              <Field label='Status' errorMessage={formik.errors.status}>
                <Select
                  className={styles.editData}
                  size='large'
                  placeholder='status'
                  allowClear
                  options={STATUS_OPTIONS}
                  onChange={(value) => formik.setFieldValue('status', value)}
                  value={formik.values?.status}
                  status={formik.errors.status && 'error'}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection='column' flex={1}>
              <Field label='Revenue' errorMessage={formik.errors.value}>
                <Input
                  type='number'
                  className={styles.editData}
                  size='large'
                  placeholder='value'
                  onChange={(value) => formik.setFieldValue('revenue', value.target.value)}
                  value={formik.values?.revenue ? formik.values?.revenue : ''}
                  status={formik.errors.revenue && 'error'}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />

            <FlexBox flexDirection='column' flex={1}>
              <Field label='Cash Balance' errorMessage={formik.errors.value}>
                <Input
                  type='number'
                  className={styles.editData}
                  size='large'
                  placeholder='value'
                  onChange={(value) => formik.setFieldValue('value', value.target.value)}
                  value={formik.values?.value ? formik.values?.value : ''}
                  status={formik.errors.value && 'error'}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox justifyContent='flex-end'>
            <Button
              type='primary'
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

EditDocumentModal.displayName = 'EditDocumentModal';

export default EditDocumentModal;
