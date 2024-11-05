import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, DatePicker } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Toast from '@/components/toast'
import Field from '@/components/field'
import * as API from '@/api'
import styles from './page.module.scss'
import { useSelectedAccountCompany } from '@/hooks'
import FormikFilePicker from '@/shared/formik-file-picker'

type TForm = {
  title: string
  notes: string
  needsReview: boolean
  active: boolean
  type?: number
  fileName: string
  fileBinary: ArrayBuffer | undefined
}

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required."),
  fileName: yup.string().required("File is required")
})

const AddDocumentModal = forwardRef(({ onSuccess , meetingId }: { onSuccess?: () => void, meetingId?:string }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      title: '',
      needsReview: false,
      active: false,
      notes: '',
      fileName: '',
      fileBinary: undefined,
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)
      if( !companyId || !meetingId){
        return
      }
      try {
        await API.addMeetingPackDocument(companyId , meetingId ,values)
        Toast.success("Create Document Successfully")
        setOpen(false)
      } catch(error:any){
        Toast.error(error?.message || "Something went wrong.")
      }finally {
        if(onSuccess){
          onSuccess()
        }
        setLoading(false)
        formik.resetForm()
      }
    }
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      formik.resetForm()
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
        <Typography size="huge">Add Document</Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Document Title" errorMessage={formik.errors.title}>
              <Input
                name="title"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.title}
                status={formik.errors.title && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Document Date">
              <DatePicker
                name='documentDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) => formik.setFieldValue('documentDate', value?.toISOString())}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <Typography size="large" red>
          ⓘ Firstly Choose File, then Add File.
        </Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Document">
              <FormikFilePicker
                form={formik}
                error={formik.errors.fileName}
                resetError={() => formik.setFieldError("fileName", undefined)}
                fileKeyName='fileName'
                maxFileCount={1}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <Typography size="large" gray>
          You can download model articles for private companies limited by shares here: Visit Gov.uk
        </Typography>
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
            Save
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})
AddDocumentModal.displayName = "AddDocumentModal"

export default AddDocumentModal
