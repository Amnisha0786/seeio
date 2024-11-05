import { forwardRef } from 'react'
import { DatePicker, Input } from 'antd'
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'

const ActionsFromThisMeetingForm = forwardRef(
  ({ formik, meetingDate }: { formik: any; meetingDate?: string }, ref) => {
    const { agenda, dueDate, owner, notes } = formik.values
    return (
      <div>
        <Typography size='huge'>
          {meetingDate ? dayjs(meetingDate).format('DD/MM/YYYY') : ''}
        </Typography>
        {meetingDate && <Space size={16} />}
        <FlexBox justifyContent='space-between' alignItems='center'>
          <Typography size='large' gray>
            You can add actions as meeting results.
          </Typography>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Agenda'>
              <Input
                name='agenda'
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={agenda}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Due Date'>
              <DatePicker
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) =>
                  formik.setFieldValue('dueDate', value?.toISOString())
                }
                value={dueDate && dayjs(dueDate)}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Owner'>
              <PeopleSelect
                size='large'
                placeholder='Choose presenter'
                onChange={(value) => formik.setFieldValue('owner', value)}
                value={owner}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
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
    )
  }
)
ActionsFromThisMeetingForm.displayName = 'ActionsFromThisMeetingForm'

export default ActionsFromThisMeetingForm
