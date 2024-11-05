import { Fragment, useContext, useState, useEffect, useRef } from 'react'
import { Input, Row, Col, ModalProps } from 'antd'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import { useRouter, useParams } from 'next/navigation'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Card from '@/components/card'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import FilePicker from '@/components/file-picker'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import { TMeetingDetailsTopic } from '@/models'
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
  documents: File[]
}

const ProgressAgainstObjectivesModal = ({ onCancel, topic, open, ...props }: IProps) => {
  const [openAction, setOpenAction] = useState<string | null>(null)
  const { updateTopic, deleteTopic, deleting } = useContext(MeetingDetailsContext)
  const [loading, setLoading] = useState(false)
  const deleteModelRef = useRef<any>();
  const router = useRouter()
  const params = useParams()

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      timeAlloted: topic?.timeAlloted,
      presenter: topic?.presenter,
      notes: topic?.notes,
      documents: []
    }
    ,
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
            Progress against objectives
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
        {topic.objectives?.map((objective) => (
          <Fragment key={objective.id}>
            <Clickable onClick={() => setOpenAction(objective.id === openAction ? null : objective.id)}>
              <Card>
                <FlexBox flexDirection="column">
                  <Typography size="large" bold>
                    {objective.name}
                  </Typography>
                  <Space size={14} />
                  <FlexBox alignItems="center" justifyContent="space-between">
                    <FlexBox flex={1.5}>
                      <Typography size="large">
                        {dayjs(objective.nextReview).format('MMM DD YYYY')}
                      </Typography>
                    </FlexBox>
                    <Icon name="up-arrow" size={24} rotate={objective.id === openAction ? 0 : 180} />
                  </FlexBox>
                  {objective.id === openAction && (
                    <>
                      <Space size={14} />
                      <Typography size="large" gray>
                        {objective.description}
                      </Typography>
                    </>
                  )}
                </FlexBox>
              </Card>
            </Clickable>
            <Space size={24} />
          </Fragment>
        ))}
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
ProgressAgainstObjectivesModal.displayName = "ProgressAgainstObjectivesModal"

export default ProgressAgainstObjectivesModal
