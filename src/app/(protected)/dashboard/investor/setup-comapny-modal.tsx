import React from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Button, Input } from 'antd'
import Image from 'next/image'

import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Space from '@/components/space';
import Field from '@/components/field';
import Modal from '@/components/modal';

type TForm = {
  companyName: string
  incorperativeDate: string
  companyNumber: string
  companyType: string
  address: string
}
interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  open: boolean
}

const validationSchema = yup.object().shape({
  companyName: yup.string(),
  incorperativeDate: yup.string(),
  companyNumber: yup.string(),
  companyType: yup.string(),
  address: yup.string(),
})

const CompanySetupModal = ({ setOpen, open }: Props) => {
  const handleCancel = () => {
    setOpen(false);
  };

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      companyName: "",
      incorperativeDate: "",
      companyNumber: "",
      companyType: "",
      address: ""
    },
    validationSchema,
    onSubmit: async (): Promise<void> => {
      setOpen(false)
    }
  });

  return (
    <Modal open={open} width={600} onCancel={handleCancel}>
      <Space size={10} />
      {(
        <>
          <form onSubmit={formik.handleSubmit}>
            <FlexBox flexDirection='column' justifyContent='center' alignItems='center'>
              <FlexBox justifyContent='center' alignItems='center' flexDirection='column' flex={1}>
                <Image
                  src="/logo.png"
                  alt="App Logo"
                  width={200}
                  height={100}
                  priority
                />
                <Typography size='enormous' bold >Setup a Company</Typography>
              </FlexBox>
              <Space size={25} />
              <FlexBox flexDirection="column" width={350}>
                <Field label="Company Name" errorMessage={formik.errors.companyName}>
                  <Input
                    name="companyName"
                    size="large"
                    placeholder="Enter company name"
                    value={formik.values.companyName}
                    status={formik.errors.companyName && "error"}
                  />
                </Field>

                <Space size={25} />

                <Field label="Incorperative Date" errorMessage={formik.errors.incorperativeDate}>
                  <Input
                    name="incorperativeDate"
                    size="large"
                    placeholder="Enter incorperative date"
                    value={formik.values.incorperativeDate}
                    status={formik.errors.incorperativeDate && "error"}
                  />
                </Field>
                <Space size={25} />

                <Field label="Company Number" errorMessage={formik.errors.companyNumber}>
                  <Input
                    name="companyNumber"
                    size="large"
                    placeholder="Enter company number"
                    value={formik.values.companyName}
                    status={formik.errors.companyName && "error"}
                  />
                </Field>
                <Space size={25} />

                <Field label="Company Type" errorMessage={formik.errors.companyType}>
                  <Input
                    name="companyType"
                    size="large"
                    placeholder="Enter company type"
                    value={formik.values.companyType}
                    status={formik.errors.companyType && "error"}
                  />
                </Field>
                <Space size={25} />

                <Field label="Address" errorMessage={formik.errors.address}>
                  <Input
                    name="address"
                    size="large"
                    placeholder="Enter address"
                    value={formik.values.address}
                    status={formik.errors.address && "error"}
                  />
                </Field>
                <Space size={25} />

                <Button type='primary' htmlType='submit'>Confirm</Button>
              </FlexBox>
              <Space size={25} />
            </FlexBox>
          </form>
        </>
      )}
    </Modal>
  );
}

CompanySetupModal.displayName = 'CompanySetupModal';

export default CompanySetupModal;
