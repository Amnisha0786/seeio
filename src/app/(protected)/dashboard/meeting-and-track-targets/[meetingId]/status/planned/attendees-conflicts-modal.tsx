import { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Input, ModalProps, Radio } from 'antd'
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
import { MEETING_TYPE, TEXT_FOR_CONFLICTS, TEXT_FOR_NO_CONFLICTS } from '@/constants'

interface IProps extends ModalProps {
  topic: TMeetingDetailsTopic
  onCancel: () => void
  meetingType?: string
}

const AttendeesConflictsModal = forwardRef(
  ({ onCancel, topic, open, meetingType, ...props }: IProps, ref) => {
    const { updateTopic, deleteTopic, deleting } = useContext(
      MeetingDetailsContext
    )
    const deleteModelRef = useRef<any>()
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
      validateOnChange: false,
      initialValues: {
        timeAlloted: topic?.timeAlloted,
        notes: topic?.notes,
        documents: topic?.documents,
        attendees: topic?.attendees,
        anyConflictsOfInterest: topic?.anyConflictsOfInterest,
        methodOfManagingConflict: topic?.methodOfManagingConflict,
        details: topic?.details,
        minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : topic?.minutes,
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

    const {
      anyConflictsOfInterest,
      minutes,
      attendees,
      methodOfManagingConflict,
      details,
    } = formik.values

    useEffect(() => {
      if (anyConflictsOfInterest) {
        formik.setFieldValue('minutes', TEXT_FOR_CONFLICTS)
      } else if (anyConflictsOfInterest == false) {
        formik.setFieldValue('minutes', TEXT_FOR_NO_CONFLICTS)
      }
    }, [anyConflictsOfInterest])

    useEffect(() => {
      if (minutes) {
        formik.setFieldValue('minutes', minutes)
      }
    }, [])

    useEffect(() => {
      if (meetingType === MEETING_TYPE?.MANAGEMENT) {
        formik.setFieldValue('anyConflictsOfInterest', undefined)
        formik.setFieldValue('methodOfManagingConflict', undefined)
      }
    }, [meetingType])

    const isFormEmpty = useMemo(() => {
      if (formik?.values) {
        const formValues = Object.values(formik?.values)?.filter((item) => item)
        return formValues?.length ? false : true
      }
      return true
    }, [formik])

    return (
      <Modal width={780} onCancel={onCancel} open={open} {...props}>
        <div className={styles.addActionModal}>
          <Typography size='giant'>Manage agenda</Typography>
          <Space size={24} />
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>
              {meetingType === MEETING_TYPE?.MANAGEMENT ? "Attendees" : "Attendees & Conflicts of interest"}
            </Typography>
            <Clickable onClick={() => deleteModelRef.current.open()}>
              <Icon name='black-delete-icon' size={24} />
            </Clickable>
          </FlexBox>
          <Space size={24} />
          <div>
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Attendees'>
                  <PeopleSelect
                    allowClear
                    mode='multiple'
                    size='large'
                    placeholder='Select'
                    onChange={(value) =>
                      formik.setFieldValue('attendees', value?.length > 0 ? value : undefined)
                    }
                    value={attendees}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection='column' flex={1}>
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
              </FlexBox>
            </FlexBox>
            <Space size={24} />
            {meetingType !== MEETING_TYPE?.MANAGEMENT && <> <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Any Conflicts of Interests?'>
                  <Space size={8} />
                  <Radio.Group
                    name='anyConflictsOfInterest'
                    onChange={formik.handleChange}
                    value={anyConflictsOfInterest}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Field>
              </FlexBox>
            </FlexBox>

            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Method of managing conflict'>
                  <Space size={8} />
                  <Radio.Group
                    name='methodOfManagingConflict'
                    onChange={formik.handleChange}
                    value={methodOfManagingConflict}
                  >
                    <Radio value='Articles Permit Voting'>Articles Permit Voting</Radio>
                    <Radio value='Did Not Vote Or Form Part Of Quorum'>Did Not Vote Or Form Part Of Quorum</Radio>
                    <Radio value='Rescue From Meeting'>Recuse From Meeting</Radio>
                  </Radio.Group>
                </Field>
              </FlexBox>
            </FlexBox></>}
            {anyConflictsOfInterest && (
              <>
                {' '}
                <Space size={16} />
                <FlexBox>
                  <FlexBox flexDirection='column' flex={1}>
                    <Field label='Details'>
                      <TextArea
                        rows={4}
                        name={'details'}
                        size='large'
                        placeholder='Enter here'
                        onChange={formik.handleChange}
                        value={details}
                      />
                    </Field>
                  </FlexBox>
                </FlexBox>
              </>
            )}
            <Space size={16} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Minutes'>
                  <TextArea
                    rows={4}
                    name={'minutes'}
                    size='large'
                    placeholder='Enter here'
                    onChange={formik.handleChange}
                    value={typeof minutes === 'string' && minutes || ""}
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
              disabled={isFormEmpty}
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
AttendeesConflictsModal.displayName = 'AttendeesConflictsModal'

export default AttendeesConflictsModal
