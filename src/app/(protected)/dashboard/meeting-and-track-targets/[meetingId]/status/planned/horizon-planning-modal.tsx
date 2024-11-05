import { Fragment, useContext, useState, useEffect, useRef } from 'react'
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
import Card from '@/components/card'
import FilePicker from '@/components/file-picker'
import Icon from '@/components/icon'
import PeopleSelect from '@/shared/people-select'
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
  presenter?: string
  notes?: string
  horizons: string[]
  documents: File[]
}

const HorizonPlanningModal = ({ onCancel, topic, open, ...props }: IProps) => {
  const { updateTopic, deleteTopic, deleting } = useContext(MeetingDetailsContext)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const deleteModelRef = useRef<any>();

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      timeAlloted: topic?.timeAlloted,
      presenter: topic?.presenter,
      horizons: topic?.horizons || [],
      notes: topic?.notes || '',
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
            Horizon Planning
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
        <Space size={24} />
        {[1, 2, 3].map((horizon) => (
          <Fragment key={horizon}>
            <Card>
              <FlexBox flexDirection="column">
                <Typography size="large" bold>
                  Horizon {horizon}
                </Typography>
                <Space size={14} />
                <TextArea
                  rows={4}
                  name={`horizons[${horizon - 1}]`}
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.horizons[horizon - 1]}
                />
              </FlexBox>
            </Card>
            <Space size={24} />
          </Fragment>
        ))}
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
HorizonPlanningModal.displayName = "HorizonPlanningModal"

export default HorizonPlanningModal
