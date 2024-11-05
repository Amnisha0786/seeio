import { forwardRef } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'

const ChairsIntroductionForm = forwardRef(({ formik }: any, ref) => {
  const { meetingChair, meetingIsQuorate, notes } = formik.values
  return (
    <div>
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Meeting Chair'>
            <PeopleSelect
              size='large'
              placeholder='Choose chair'
              onChange={(value) => formik.setFieldValue('meetingChair', value)}
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
  )
})
ChairsIntroductionForm.displayName = 'ChairsIntroductionForm'

export default ChairsIntroductionForm
