import { useContext, useState, useEffect, Fragment, useRef } from 'react'
import { Input, Row, Col, ModalProps } from 'antd'
import { useFormik } from 'formik'
import { useRouter, useParams } from 'next/navigation'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import FilePicker from '@/components/file-picker'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import { TMeetingDetailsTopic } from '@/models'
import { DRAFT_EDITOR_DEFAULT_TEXT } from '@/constants'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import ConfirmDelete from '@/shared/confirm-delete'

interface IProps extends ModalProps {
  onCancel: () => void
  topic: TMeetingDetailsTopic
}

type TForm = {
  timeAlloted?: number
  notes?: string
  presenter?: string
  name?: string
  documents: File[]
}

const AddInformationItemModal = ({ onCancel, topic, open, ...props }: IProps) => {
  const [loading, setLoading] = useState(false)
  const { updateTopic, deleteTopic, deleting } = useContext(MeetingDetailsContext)
  const router = useRouter()
  const deleteModelRef = useRef<any>();
  const params = useParams()

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues:  {
      timeAlloted: topic?.timeAlloted,
      notes: topic.notes || DRAFT_EDITOR_DEFAULT_TEXT,
      documents: []
    },
    onSubmit: async (values) => {
      setLoading(true)
      await updateTopic(topic, values)
      onCancel()
      setLoading(false)
    }
  });

  const onDelete = async () => {
    deleteTopic(topic, onCancel)
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
            Add Information Item
          </Typography>
          <Clickable onClick={() => deleteModelRef.current.open()}>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
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
          <Col span={12}>
            <Field label="Name">
              <Input
                name="name"
                size="large"
                type="number"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Presenter">
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
        {topic.documents?.map((document) => (
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
            Save
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
AddInformationItemModal.displayName = "AddInformationItemModal"

export default AddInformationItemModal
