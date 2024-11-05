import { forwardRef, useContext, useRef, useState } from 'react'
import { Col, Input, ModalProps, Radio, Row } from 'antd'
import { useFormik } from 'formik'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import styles from './page.module.scss'
import { TMeetingDetailsTopic } from '@/models'
import { MeetingDetailsContext } from '../../context'
import ConfirmDelete from '@/shared/confirm-delete'
import PeopleSelect from '@/shared/people-select'

interface IProps extends ModalProps {
  topic: TMeetingDetailsTopic
  onCancel: () => void
}

const ChairsIntroductionModal = forwardRef(
  ({ onCancel, topic, open, ...props }: IProps, ref) => {
    const { updateTopic, deleteTopic, deleting } = useContext(
      MeetingDetailsContext
    )
    const deleteModelRef = useRef<any>()
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
      validateOnChange: false,
      initialValues: {
        meetingChair: topic?.meetingChair,
        meetingIsQuorate: topic?.meetingIsQuorate,
        minutes: topic?.meetingIsQuorate,
        timeAlloted: topic?.timeAlloted,
        notes: topic?.notes,
        documents: topic?.documents,
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

    const { meetingChair, meetingIsQuorate, notes } = formik.values

    return (
      <Modal width={780} onCancel={onCancel} open={open} {...props}>
        <div className={styles.addActionModal}>
          <Typography size='giant'>Manage agenda</Typography>
          <Space size={24} />
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>
              Chair’s Introduction and Opening
            </Typography>
            <Clickable onClick={() => deleteModelRef.current.open()}>
              <Icon name='black-delete-icon' size={24} />
            </Clickable>
          </FlexBox>
          <Space size={24} />
          <div>
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
            </Row>

            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Meeting Chair'>
                  <PeopleSelect
                    size='large'
                    placeholder='Choose chair'
                    onChange={(value) =>
                      formik.setFieldValue('meetingChair', value)
                    }
                    value={meetingChair}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Meeting is quorate'>
                  <Space size={16} />
                  <Radio.Group
                    name='meetingIsQuorate'
                    onChange={formik.handleChange}
                    value={meetingIsQuorate}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={16} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Notes'>
                  <TextArea
                    rows={4}
                    name={`notes`}
                    size='large'
                    placeholder='Enter here'
                    onChange={formik.handleChange}
                    value={notes}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
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
)
ChairsIntroductionModal.displayName = 'ChairsIntroductionModal'

export default ChairsIntroductionModal
