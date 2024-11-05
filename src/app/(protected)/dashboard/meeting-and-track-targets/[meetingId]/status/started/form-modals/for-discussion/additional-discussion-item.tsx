import { forwardRef } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'

const AdditionalDiscussionForm = forwardRef(({ formik }: any, ref) => {
  const { presenter, discussion, notes } = formik.values
  return (
    <div>
      <FlexBox>
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
        <Space horizontal size={24} />
        <FlexBox flexDirection='column' flex={1}>
          <div></div>
        </FlexBox>
      </FlexBox>
      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Discussion'>
            <Radio.Group
              name='discussion'
              onChange={formik.handleChange}
              value={discussion}
            >
              <Radio value='Not discussed'>Not discussed</Radio>
              <Radio value='Brief discussion'>Brief discussion</Radio>
              <Radio value='Detailed discussion'>Detailed discussion</Radio>
            </Radio.Group>
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
})
AdditionalDiscussionForm.displayName = 'AdditionalDiscussionForm'

export default AdditionalDiscussionForm
