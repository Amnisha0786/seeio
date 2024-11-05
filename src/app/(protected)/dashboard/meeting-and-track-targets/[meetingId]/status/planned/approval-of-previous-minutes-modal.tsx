import { useContext, useState, useRef } from 'react'
import { Col, Input, ModalProps, Row } from 'antd'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import { TMeetingDetailsTopic, TMinutes } from '@/models'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import ConfirmDelete from '@/shared/confirm-delete'
import { MeetingMinuteStatus } from '../started/form-modals/form-modal-validation-schemas'

interface IProps extends ModalProps {
  topic: TMeetingDetailsTopic
  onCancel: () => void
}

const ApprovalOfMinutesModal = ({
  onCancel,
  topic,
  open,
  ...props
}: IProps) => {
  const { updateTopic, deleteTopic, deleting } = useContext(
    MeetingDetailsContext
  )
  const deleteModelRef = useRef<any>()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      timeAlloted: topic?.timeAlloted,
      minutes: topic?.minutes,
    },
    onSubmit: async (values) => {
      setLoading(true)
      await updateTopic(topic, values)
      onCancel()
      setLoading(false)
    },
  })

  const onDelete = async () => {
    deleteTopic(topic, onCancel)
  }

  const { minutes } = formik.values

  const statusColor = (status: string) => {
    let color: string, statusText: string;
    if (status === MeetingMinuteStatus.PENDING) {
      color = "Blue"
      statusText = 'Pending'
    } else if (status === MeetingMinuteStatus.APPROVED) {
      color = "Green"
      statusText = 'Approved'
    } else if ((status === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS)) {
      color = "#CE9F46"
      statusText = 'Approved with Amendments'
    } else {
      color = ""
      statusText = ''
    }
    return { statusText, color }
  }

  return (
    <Modal width={780} onCancel={onCancel} open={open} {...props}>
      <div className={styles.addActionModal}>
        <Typography size='giant'>Manage agenda</Typography>
        <Space size={24} />
        <FlexBox justifyContent='space-between' alignItems='center'>
          <Typography size='huge'>Approval of previous minutes</Typography>
          <Clickable onClick={() => deleteModelRef.current.open()}>
            <Icon name='black-delete-icon' size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
        <div>
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <Field label="Alloted time (minutes)" >
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
          <Space size={24} />
          {(minutes &&
            minutes?.length > 0 &&
            Array.isArray(minutes)) &&
            minutes?.map((minute: TMinutes, index: number) => (
              <>
                <div className={styles.padding} key={index}>
                  <FlexBox justifyContent='space-between'>
                    <Typography size='large' className={styles.bolder}>
                      {`Meeting dated ${minute?.meeting?.date
                        ? dayjs(minute?.meeting?.date).format('DD/MM/YYYY')
                        : '- -'
                      }`}
                    </Typography>
                    <Typography
                      size='large'
                      color={statusColor(minute.status).color}
                    >
                      {statusColor(minute.status).statusText}
                    </Typography>
                  </FlexBox>
                  <Space size={18} />
                  {minutes?.[index]?.status ===
                    MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS && (
                    <>
                      <Space size={18} />
                      <FlexBox flexDirection='column' flex={1}>
                        <Field label='Description of amendments'>
                          <TextArea
                            rows={4}
                            name={`minutes[${index}].amendments`}
                            size='large'
                            placeholder='Enter here'
                            onChange={formik.handleChange}
                            value={minutes?.[index]?.amendments}
                          />
                        </Field>
                      </FlexBox>
                    </>
                  )}
                </div>
                <Space size={16} />
              </>
            ))}
        </div>
        <Space size={24} />
        <FlexBox justifyContent='flex-end'>
          <Button
            type='primary'
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
ApprovalOfMinutesModal.displayName = 'ApprovalOfMinutesModal'

export default ApprovalOfMinutesModal
