import React from 'react';
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Button, Input } from 'antd'

import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Space from '@/components/space';
import Field from '@/components/field'
import Modal from '@/components/modal';

type TForm = {
  companyHouseNumber: string
  companyAdminEmail: string
}

const validationSchema = yup.object().shape({
  companyHouseNumber: yup.string(),
  companyAdminEmail: yup.string()
})

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCompanySetupModal: React.Dispatch<React.SetStateAction<boolean>>,
  open: boolean
}
const AddCompanyModal = ({ setOpen, setCompanySetupModal, open }: Props) => {
  const handleCancel = () => {
    setOpen(false);
  };

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      companyHouseNumber: "",
      companyAdminEmail: ""
    },
    validationSchema,
    onSubmit: (): void => {
      setOpen(false)
      setCompanySetupModal(true)
    }
  });

  return (
    <Modal open={open} width={400} onCancel={handleCancel}>
      <Space size={10} />
      {(
        <>
          <Typography size='giant'>Add Company</Typography>
          <Space size={25} />
          <form onSubmit={formik.handleSubmit}>
            <FlexBox flexDirection="column">
              <Field label='Comapany House Number' errorMessage={formik.errors.companyHouseNumber}>
                <Input
                  name="companyHouseNumber"
                  size="large"
                  placeholder="Enter Company House number"
                  onChange={formik.handleChange}
                  value={formik.values.companyHouseNumber}
                  status={formik.errors.companyHouseNumber && "error"}
                />
              </Field>

              <Space size={24} />

              <Field label='Company Admin Email' errorMessage={formik.errors.companyAdminEmail}>
                <Input
                  name="companyAdminEmail"
                  size="large"
                  placeholder="Enter Company Admin email"
                  onChange={formik.handleChange}
                  value={formik.values.companyAdminEmail}
                  status={formik.errors.companyAdminEmail && "error"}
                />
              </Field>

              <Space size={25} />

              <Button type='primary' htmlType='submit'>Search</Button>
            </FlexBox>
          </form>
          <Space size={25} />
        </>
      )}
    </Modal>
  );
}
AddCompanyModal.displayName = 'AddCompanyModal';

export default AddCompanyModal;
