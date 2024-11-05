import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import { TDataRoomDocument } from '@/models'

type TForm = {
  name: string
  description: string
}

interface IProps {
  handleDocumentUpdate: (data: any, calback: () => void) => void
  loading: boolean
}

const validationSchema = yup.object().shape({
  name: yup.string().required(),
})

const EditDocumentModal = forwardRef(({ handleDocumentUpdate, loading }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      handleDocumentUpdate(values, () => setOpen(false))
    }
  });

  useImperativeHandle(ref, () => ({
    open: (data: TDataRoomDocument) => {
      formik.setValues({
        name: data.name,
        description: data.description
      })
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [formik])

  return (
    <Modal
      open={open}
      width={780}
      onCancel={() => setOpen(false)}
    >
      <div>
        <Typography size="huge">Edit Document</Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Title" errorMessage={formik.errors.name}>
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
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Description" errorMessage={formik.errors.description}>
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
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Update
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})

EditDocumentModal.displayName = "EditDocumentModal"

export default EditDocumentModal
