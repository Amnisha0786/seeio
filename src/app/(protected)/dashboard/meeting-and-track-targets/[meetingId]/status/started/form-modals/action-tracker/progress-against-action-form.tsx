import { forwardRef, useRef } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import Icon from '@/components/icon'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import DocumentPreviewModal from '@/shared/document-preview-modal'


const ProgressAgainstActionForm = forwardRef(
  ({ formik }: { formik: any }, ref) => {
    const { notes, minutes, discussion, documents } = formik.values
    const openDocumentPreviewModal: any = useRef()
    return (
      <div>
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Pre-meeting notes'>
              <TextArea
                disabled
                rows={3}
                name={`notes`}
                size='large'
                value={notes}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={16} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Discussion'>
              <Space size={8} />
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
  }
)
ProgressAgainstActionForm.displayName = 'ProgressAgainstActionForm'

export default ProgressAgainstActionForm
