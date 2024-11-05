import { forwardRef, useRef } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import Typography from '@/components/typography'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import Clickable from '@/components/clickable'

const FinanceOperationsForm = forwardRef(({ formik }: any, ref) => {
  const { presenter, discussion, notes, documents } = formik.values
  const openDocumentPreviewModal: any = useRef()

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
      <Space size={16} />
      {documents &&
        documents?.map((document: any) => (
          <Clickable key={document.documentId} onClick={() => openDocumentPreviewModal.current.open(document)}>
            <FlexBox alignItems='center'>
              <Icon name='green-pdf-icon' size={34} />
              <Space horizontal size={5} />
              <Typography gray>{document.fileName}</Typography>
            </FlexBox>
            <Space size={16} />
          </Clickable>
        ))}
      <DocumentPreviewModal ref={openDocumentPreviewModal} />
    </div>
  )
})
FinanceOperationsForm.displayName = 'FinanceOperationsForm'

export default FinanceOperationsForm
