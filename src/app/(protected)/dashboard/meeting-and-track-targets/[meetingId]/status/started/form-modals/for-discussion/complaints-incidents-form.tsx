import React, { forwardRef, useRef } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { Radio } from 'antd'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import DocumentPreviewModal from '@/shared/document-preview-modal'

const ComplaintsIncidentsForm = forwardRef(({ formik }: any, ref) => {
  const { presenter, notes, documents, minutes, discussion } = formik.values
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
      <Space size={16} />
      <FlexBox>
        <FlexBox flexDirection='column' flex={1}>
          <Field label='Type of discussion'>
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
ComplaintsIncidentsForm.displayName = 'ComplaintsIncidentsForm'

export default ComplaintsIncidentsForm
