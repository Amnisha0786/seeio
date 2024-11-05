import { forwardRef, useRef } from 'react'
import { Radio } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Field from '@/components/field'
import styles from '../../page.module.scss'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import Clickable from '@/components/clickable'
import DocumentPreviewModal from '@/shared/document-preview-modal'

const HorizonPlanningForm = forwardRef(({ formik }: any, ref) => {
  const { presenter, discussion, notes, documents, horizons } = formik.values
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
        <FlexBox flexDirection='column' flex={1}>
          <div></div>
        </FlexBox>
      </FlexBox>

      <Space size={16} />
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
      {horizons?.length > 0 && horizons?.map((horizon: string, index: number) => <>
        <Space size={24} />
        <div className={styles.padding}>
          <FlexBox justifyContent='space-between'>
            <Typography size='large' bold={true}>{`Horizon ${index + 1}`}</Typography>
          </FlexBox>
          <Space size={18} />
          <FlexBox justifyContent='space-between'>
            <Typography size='large'>{horizon}</Typography>
            {/* <Typography size='large'>Time :18:32</Typography> */}
          </FlexBox>
        </div></>)}
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
HorizonPlanningForm.displayName = 'HorizonPlanningForm'

export default HorizonPlanningForm
