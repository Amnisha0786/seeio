import { forwardRef, useRef } from 'react'
import { Col, Input, Radio, Row } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import PeopleSelect from '@/shared/people-select'
import Icon from '@/components/icon'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import { MeetingMinuteStatus } from './form-modals/form-modal-validation-schemas'

const AdditionalOpeningForm = forwardRef(({ formik }: any, ref) => {
  const { topicName, timeAlloted, presenter, notes, documents, discussion, minutes } = formik.values
  const openDocumentPreviewModal: any = useRef()

  return (
    <div>
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={12}>
          <Field label="Topic Name" errorMessage={formik.errors.topicName}>
            <Input
              name="topicName"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={topicName}
              status={formik.errors.topicName && "error"}
            />
          </Field>
        </Col>
        <Col span={12}>
          <Field label="Alloted time (minutes)">
            <Input
              name="timeAlloted"
              size="large"
              type="number"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={timeAlloted}
            />
          </Field>
        </Col>
      </Row>
      <Space size={16} />
      <Row gutter={[30, 0]}>
        <Col span={12}>
          <Field label="Presenter" errorMessage={formik.errors.presenter}>
            <PeopleSelect
              size="large"
              allowClear
              placeholder="Select"
              onChange={(value) => formik.setFieldValue("presenter", value)}
              value={presenter}
            />
          </Field>
        </Col>
      </Row>
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
          <Field label="Status">
            <Radio.Group
              name={`topicStatus`}
              onChange={formik.handleChange}
              value={formik?.values?.topicStatus}
              defaultValue={MeetingMinuteStatus.PENDING}
            >
              <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
              <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
            </Radio.Group>
          </Field>
        </FlexBox>
      </FlexBox>
      <Space size={16} />
      <Row gutter={[30, 0]}>
        <Col span={24}>
          <Field label="Notes">
            <TextArea
              rows={4}
              name={`notes`}
              size='large'
              placeholder='Enter here'
              onChange={formik.handleChange}
              value={notes}
            />
          </Field>
        </Col>
      </Row>
      <Space size={16} />
      <Row gutter={[30, 0]}>
        <Col span={24}>
          <Field label="Minutes">
            <TextArea
              rows={4}
              name={`minutes`}
              size='large'
              placeholder='Enter here'
              onChange={formik.handleChange}
              value={minutes}
            />
          </Field>
        </Col>
      </Row>
      <Space size={16} />
      {documents &&
        documents?.map((document: any) => (
          document.fileUrl && document.fileUrl !== "error" &&
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

AdditionalOpeningForm.displayName = 'AdditionalOpeningForm'

export default AdditionalOpeningForm
