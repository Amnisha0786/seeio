import { forwardRef } from 'react'
import { DatePicker, Input } from 'antd'
import dayjs from 'dayjs'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'

const NextMeetingForm = forwardRef(({ formik }: any, ref) => {
  const { dateOfNextMeeting, location } = formik.values
  return (
    <div>
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Date'>
            <DatePicker
              size='large'
              placeholder='__/__/____'
              format='DD/MM/YYYY'
              onChange={(value) =>
                formik.setFieldValue('dateOfNextMeeting', value?.toISOString())
              }
              value={dateOfNextMeeting && dayjs(dateOfNextMeeting)}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Location'>
            <Input
              name='location'
              size='large'
              placeholder='Enter here'
              onChange={formik.handleChange}
              value={location}
            />
          </Field>
        </FlexBox>
      </FlexBox>
    </div>
  )
})
NextMeetingForm.displayName = 'NextMeetingForm'

export default NextMeetingForm
