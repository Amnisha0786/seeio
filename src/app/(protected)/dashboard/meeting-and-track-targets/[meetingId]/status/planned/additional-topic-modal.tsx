import { useState, useContext, useEffect, Fragment, useRef } from 'react'
import { Input, Row, Col, ModalProps } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter, useParams } from 'next/navigation'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import Toast from '@/components/toast'
import FilePicker from '@/components/file-picker'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import * as API from '@/api'
import { useSelectedAccountCompany } from '@/hooks'
import { TMeetingDetailsTopic } from '@/models'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import ConfirmDelete from '@/shared/confirm-delete'

interface IProps extends ModalProps {
  onCancel: () => void
  topic?: TMeetingDetailsTopic
  categoryId?: string
}

type TForm = {
  notes: string
  presenter: string
  name: string
  timeAlloted?: number
  documents: File[]
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  presenter: yup.string().required('Presenter is required.'),
})

const AdditionalTopicModal = ({ onCancel, topic, categoryId, open, ...props }: IProps) => {
  const { meetingDetails, loadMeetingDetails, updateTopic, deleteTopic, deleting } = useContext(MeetingDetailsContext)
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId
  const deleteModelRef = useRef<any>();
  const router = useRouter()
  const params = useParams()

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: topic ? {
      name: topic.topicName || '',
      presenter: topic.presenter || '',
      timeAlloted: topic.timeAlloted,
      notes: topic.notes || '',
      documents: []
    } : {
      name: '',
      presenter: '',
      notes: '',
      documents: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)

      if (topic) {
        await updateTopic(topic, values)
      } else {
        try {
          if (!companyId || !categoryId || !meetingDetails) return
          let documentsFileNames: string[] = []
          if (values.documents?.length > 0) {
            documentsFileNames = values.documents.map((item: File) => item.name)
          }

          const result = await API.createTopic({
            companyId,
            meetingId: meetingDetails.id,
            categoryId: categoryId,
            name: values.name,
            presenter: values.presenter,
            notes: values.notes,
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

          await loadMeetingDetails()
          Toast.success("Create topic successfully")
        } finally {
        }
      }
      onCancel()
      setLoading(false)
    }
  });

  const onDelete = async () => {
    if (topic) {
      deleteTopic(topic, onCancel)
    }
  }

  useEffect(() => {
    if (open) formik.resetForm()

    // eslint-disable-next-line
  }, [open])

  return (
    <Modal
      width={780}
      onCancel={onCancel}
      open={open}
      {...props}
    >
      <div className={styles.addActionModal}>
        <Typography size="giant">
          Manage agenda
        </Typography>
        <Space size={24} />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">
            Additional Topic
          </Typography>
          {topic && (
            <Clickable onClick={() => deleteModelRef.current.open()}>
              <Icon name="black-delete-icon" size={24} />
            </Clickable>
          )}
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Topic Name" errorMessage={formik.errors.name}>
              <Input
                name="name"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.name}
                status={formik.errors.name && "error"}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Alloted time (minutes)">
              <Input
                name="timeAlloted"
                size="large"
                type="number"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.timeAlloted}
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
        {topic?.documents?.map((document) => (
          <Fragment key={document.documentId}>
            <Clickable
              onClick={() => router.push(
                `/dashboard/meeting-and-track-targets/${params?.meetingId}/${topic.categoryId}/${topic.topicId}/document/${document.documentId}`
              )}
            >
              <FlexBox alignItems="center">
                <Icon name="pdf-file-icon" size={34} />
                <Space horizontal size={5} />
                <Typography gray>
                  {document.fileName}
                </Typography>
              </FlexBox>
            </Clickable>
            <Space size={16} />
          </Fragment>
        ))}
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            {!topic ? "Add" : "Save"}
          </Button>
        </FlexBox>
      </div>

      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={onDelete}
        loading={deleting}
        message={'Are you sure you want to delete the topic?'}
      />
    </Modal>
  )
}
AdditionalTopicModal.displayName = "AdditionalTopicModal"

export default AdditionalTopicModal
