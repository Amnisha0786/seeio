/* eslint-disable max-len */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Toast from '@/components/toast'
import Field from '@/components/field'
import FilePicker from '@/shared/formik-file-picker'
import * as API from '@/api'
import styles from './page.module.scss'
import { useSelectedAccountCompany } from '@/hooks'

type TForm = {
  name: string
  description: string
  needsReview: boolean
  active: boolean
  type?: number
  fileName: string
  fileBinary: ArrayBuffer | undefined
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Document name is required."),
  description: yup.string(),
  fileName: yup.string().required("File is required")
})

const AddDocumentModal = forwardRef(({ dataRoomId, parent_folder_id, onSuccess }: { dataRoomId: string, parent_folder_id?: string, onSuccess: () => void }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId;

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      name: '',
      needsReview: false,
      active: false,
      description: '',
      fileName: '',
      fileBinary: undefined,
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)
      try {
        await API.addDataRoomDocument({
          companyId: companyId!,
          dataroomId: dataRoomId,
          parentFolderId: parent_folder_id ?? dataRoomId,
          ...values,
        })
        Toast.success("Create Document Successfully")
        onSuccess()
        setOpen(false)
      } catch (err: any) {
        Toast.error(err.message || "Something went wrong.")
      } finally {
        setLoading(false)
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
        <Typography size="huge">
          Add a Document
        </Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Document Name*" errorMessage={formik.errors.name}>
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
          <FlexBox flexDirection="column" flex={1}><Space size={1} /></FlexBox>
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
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <FilePicker form={formik} error={formik.errors.fileName} resetError={() => formik.setFieldError("fileName", undefined)} />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              formik.handleSubmit()
            }}
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
