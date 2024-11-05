import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Checkbox } from 'antd'
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
import { useSelectedAccountCompany } from '@/hooks/account'

type TForm = {
  folderName: string
  folderDescription: string
  needsReview: boolean
}

const validationSchema = yup.object().shape({
  folderName: yup.string().required(),
})

const AddFolderModal = forwardRef(({
  dataRoomId,
  onSuccess,
  parentFolderId
}: {
  dataRoomId: string,
  parentFolderId?: string,
  onSuccess: () => void
}, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const selectedCompany = useSelectedAccountCompany()

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      folderName: '',
      folderDescription: '',
      needsReview: false
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        await API.addAFolder({
          companyId: selectedCompany?.companyId || "",
          dataroomId: dataRoomId,
          parentId: parentFolderId ?? dataRoomId, // Or folder parent id if in folder
          ...values
        })
        Toast.success("Create Folder Successfully")
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
          Add a Folder
        </Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Folder Name" errorMessage={formik.errors.folderName}>
              <Input
                name="folderName"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.folderName}
                status={formik.errors.folderName && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Folder Description" errorMessage={formik.errors.folderDescription}>
              <Input
                name="folderDescription"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.folderDescription}
                status={formik.errors.folderDescription && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Typography>Needs Review</Typography>
            <Space size={8} />
            <Checkbox
              name="needsReview"
              onChange={formik.handleChange}
              checked={formik.values.needsReview}
            >
              Yes
            </Checkbox>
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
AddFolderModal.displayName = "AddFolderModal"

export default AddFolderModal
