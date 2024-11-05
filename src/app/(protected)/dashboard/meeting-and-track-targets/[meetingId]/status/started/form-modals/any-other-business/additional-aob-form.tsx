import { forwardRef } from 'react'
import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'

const AdditionalAobForm = forwardRef(({ formik }: any, ref) => {
  const { topic, presenter, notes } = formik.values
  return (
    <div>
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Topic'>
            <Input
              name='topic'
              size='large'
              placeholder='Enter here'
              onChange={formik.handleChange}
              value={topic}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Presenter'>
            <PeopleSelect
              size='large'
              placeholder='Choose presenter'
              onChange={(value) => formik.setFieldValue('presenter', value)}
              value={presenter}
            />
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
AdditionalAobForm.displayName = 'AdditionalAobForm'

export default AdditionalAobForm
