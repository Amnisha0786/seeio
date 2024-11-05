import { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import { Input, Row, Col } from 'antd'
import { useFormik } from 'formik'
import TextArea from 'antd/es/input/TextArea'
import * as yup from 'yup'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import FilePicker from '@/components/file-picker'
import * as API from '@/api'
import styles from './page.module.scss'
import { useSelectedAccountCompany } from '@/hooks'
import { MeetingDetailsContext } from '../../context'
import Toast from '@/components/toast'
import PeopleSelect from '@/shared/people-select'

type TForm = {
  timeAlloted?: number
  notes?: string
  presenter: string
  topicName: string
  documents?: any
}


const validationSchema = yup.object().shape({
  topicName: yup.string().required('Topic name is required.'),
  presenter: yup.string().required('Presenter is required.'),
})

const AddOptionalTopicsModal = forwardRef((props, ref) => {
  const { meetingDetails, loadMeetingDetails } = useContext(MeetingDetailsContext)
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId
  const [open, setOpen] = useState(false)
  const [categoryId, setCategoryId] = useState<string>("")

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema,
    initialValues: {
      notes: '',
      documents: [],
      presenter: '',
      topicName: ''
    },
    onSubmit: async (values) => {
      if (!companyId || !categoryId || !meetingDetails) return
      try {
        setLoading(true)
        let documentsFileNames: string[] = []
        if (values.documents?.length > 0) {
          documentsFileNames = values.documents.map((item: File) => item.name)
        }

        const result = await API.createTopic({
          companyId,
          meetingId: meetingDetails.id,
          categoryId,
          presenter: values.presenter,
          name: values.topicName,
          notes: values?.notes || "",
          documents: documentsFileNames,
          timeAlloted: values?.timeAlloted
        })

        if (result.documents?.length > 0) {
          await API.uploadFiles({
            files: result.documents.map((item, index) => ({
              presignUrl: item.uploadUrl,
              file: values.documents[index]
            }))
          })
        }
        Toast.success("Create topic successfully")
        await loadMeetingDetails()
      } finally {
        setLoading(false)
        setOpen(false)
      }
    }
  });

  useImperativeHandle(ref, () => ({
    open: (id: string) => {
      setCategoryId(id)
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
      <div className={styles.addActionModal}>
        <Typography size="giant">
          Manage agenda
        </Typography>
        <Space size={24} />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">
            Add Optional Topics
          </Typography>
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Topic Name" errorMessage={formik.errors.topicName}>
              <Input
                name="topicName"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.topicName}
                status={formik.errors.topicName && "error"}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Presenter" errorMessage={formik.errors.presenter}>
              <PeopleSelect
                size="large"
                allowClear
                placeholder="Select"
                onChange={(value) => formik.setFieldValue("presenter", value)}
                value={formik.values.presenter}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Notes">
              <TextArea
                rows={4}
                name={`notes`}
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={formik.values.notes}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Associated document(s)">
              <FilePicker onChange={(files) => formik.setFieldValue("documents", files)} />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            onClick={() => formik.handleSubmit()}
            loading={loading}
          >
            Add
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})
AddOptionalTopicsModal.displayName = "AddOptionalTopicsModal"

export default AddOptionalTopicsModal
