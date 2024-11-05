import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, DatePicker } from 'antd'
import { useFormik } from 'formik'
// import * as yup from 'yup'
import dayjs, { Dayjs } from "dayjs";

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Toast from '@/components/toast'
import Field from '@/components/field'
import * as API from '@/api'
import { TDocument } from '@/models'
import styles from './page.module.scss'

type TForm = {
  name: string
  notes: string
  review: Dayjs
}

// const validationSchema = yup.object().shape({
//   name: yup.string().required(),
// })

const EditDocumentModal = forwardRef(({ onSuccess }: { onSuccess: (data: any) => void }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      name: "",
      review: dayjs(),
      notes: "",
    },
    // validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        // await API.updateDocument(values)
        Toast.success("Update Document Successfully")
        onSuccess(values)
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }
  });

  useImperativeHandle(ref, () => ({
    open: (data: TDocument) => {
      formik.setValues({
        name: data.name,
        review: dayjs(data.review, "DD/MM/YYYY"),
        notes: data.notes
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
      <div className={styles.addFolderModal}>
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
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Review Date">
              <DatePicker
                name="review"
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) => formik.setFieldValue('review', value)}
                value={formik.values.review}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Notes" errorMessage={formik.errors.notes}>
              <Input
                name="notes"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.notes}
                status={formik.errors.notes && "error"}
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
