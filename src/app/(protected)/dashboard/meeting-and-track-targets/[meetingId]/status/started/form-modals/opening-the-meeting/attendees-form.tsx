'use client'
import React, { forwardRef, useEffect } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'
import {
  MEETING_TYPE,
  TEXT_FOR_CONFLICTS,
  TEXT_FOR_NO_CONFLICTS,
} from '@/constants'

const AttendeesForm = forwardRef(({ formik, meetingType }: any, ref) => {
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
    } else if (anyConflictsOfInterest === false) {
      formik.setFieldValue('minutes', TEXT_FOR_NO_CONFLICTS)
    }
  }, [anyConflictsOfInterest])

  useEffect(() => {
    if (minutes) {
      formik.setFieldValue('minutes', minutes)
    }
  }, [])

  return (
    <div>
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Attendees'>
            <PeopleSelect
              allowClear
              mode='multiple'
              size='large'
              placeholder='Select'
              onChange={(value) => formik.setFieldValue('attendees', value)}
              value={attendees}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection='column' flex={1}>
          <div></div>
        </FlexBox>
      </FlexBox>
      <Space size={24} />
      {meetingType !== MEETING_TYPE.MANAGEMENT && (
        <>
          <FlexBox>
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
          </FlexBox> 
        </>
      )}
      {anyConflictsOfInterest && (
        <>
          {' '}
          <Space size={16} />
          <FlexBox>
            <FlexBox flexDirection='column' flex={1}>
              <Field label='Details'>
                <TextArea
                  rows={4}
                  name={`details`}
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
              name={`minutes`}
              size='large'
              placeholder='Enter here'
              onChange={formik.handleChange}
              value={minutes}
            />
          </Field>
        </FlexBox>
      </FlexBox>
    </div>
  )
})
AttendeesForm.displayName = 'AttendeesForm'

export default AttendeesForm
