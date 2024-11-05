import { forwardRef, useRef } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { Col, Radio, Row } from 'antd'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import DraftEditor from '@/components/draft-editor'
import Accordion from '@/components/accordion'
import Typography from '@/components/typography'
import styles from '../../page.module.scss'
import {
  TMeetingDetailsTopicObjective,
  TMeetingDetailsTopicRecord,
  TMeetingDetailsTopicRegisters,
} from '@/models'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import PeopleSelect from '@/shared/people-select'
import { MeetingMinuteStatus } from '../form-modal-validation-schemas'
import { DOCUMENT_TYPE } from '@/app/(protected)/documents/registers/registers-validation-schemas'

const ReviewOrApprovalForm = forwardRef(
  ({ formik }: any, ref) => {
    const {
      discussion,
      topicName,
      notes,
      registers,
      records,
      objectives
    } = formik.values;

    const openDocumentPreviewModal: any = useRef()

    return (
      <div>
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
        <Space size={24} />
        {topicName === 'Registers' &&
          registers &&
          registers?.length > 0 &&
          registers?.map(
            (register: TMeetingDetailsTopicRegisters, index: number) => (
              <>
                <div className={styles.padding} key={index}>
                  <FlexBox justifyContent='space-between'>
                    <Typography className={styles.bolder} size='large'>
                      Register {index + 1}
                    </Typography>
                    {(register?.fileUrl && register?.fileUrl !== "error") || register?.additionalFiles && (
                      <Clickable onClick={() => openDocumentPreviewModal.current.open(register)}>
                        <FlexBox alignItems='center'>
                          <Icon name='green-pdf-icon' size={34} />
                          <Space horizontal size={5} />
                          <Typography gray size='large'>View Document</Typography>
                        </FlexBox>
                      </Clickable>
                    )}
                    
                  </FlexBox>

                  <Accordion
                    className={styles.neutral}
                    title={register?.name || ''}
                    right={`Category : ${register?.docType || ''}`}
                  >
                    <Space size={18} />
                    <FlexBox>
                      <DraftEditor
                        viewOnly
                        defaultValue={register?.description}
                      />
                    </FlexBox>
                  </Accordion>
                  {(register?.docType  === DOCUMENT_TYPE.RESOLUTION ||
                    register?.docType  === DOCUMENT_TYPE.RESOLUTION_DOCTYPE || 
                    register?.docType  === DOCUMENT_TYPE.RESOLUTION_DOCUMENT ) && (
                    <>
                      <Space size={16} />

                      <FlexBox>
                        <FlexBox flexDirection='column' flex={1}>
                          <Field labelProps={{size:'large'}} label='Resolution number'>
                            <Typography size='large'>{register?.resolutionNumber || "-"}</Typography>
                          </Field>
                        </FlexBox>
                        <Space horizontal size={24} />

                        <FlexBox flexDirection='column' flex={1} alignItems='flex-end'>
                          <Field label='Type of resolution' labelProps={{size:'large'}}>
                            <Typography size='large'>{register?.typeOfResolution || "-"}</Typography>
                          </Field>
                        </FlexBox>
                      </FlexBox>
                    </>
                  )}
                  <Space size={16} />

                  <FlexBox>
                    <FlexBox flexDirection='column' flex={1}>
                      <Field>
                        <Radio.Group
                          name={`registers[${index}].topicStatus`}
                          onChange={formik.handleChange}
                          value={formik?.values?.registers?.[index]?.topicStatus }
                          defaultValue={MeetingMinuteStatus.PENDING}
                        >
                          <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
                          <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
                        </Radio.Group>
                      </Field>
                    </FlexBox>
                  </FlexBox>
                  {formik?.values?.registers?.[index]?.topicStatus === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS && (
                    <>
                      <Space size={18} />
                      <Row gutter={[30, 0]}>
                        <Col span={12}>
                          <FlexBox flexDirection='column'>
                            <Field label='Owner'>
                              <PeopleSelect
                                size='large'
                                allowClear
                                placeholder='Select'
                                onChange={(value) => formik.setFieldValue(`registers[${index}].topicOwner`, value)}
                                value={formik?.values?.registers?.[index]?.topicOwner}
                              />
                            </Field>
                          </FlexBox>
                        </Col>
                      </Row>
                      <Space size={18} />
                      <FlexBox flexDirection='column' flex={1}>
                        <Field label='Description of amendments'>
                          <TextArea
                            rows={4}
                            name={`registers[${index}].topicAmendments`}
                            size='large'
                            placeholder='Enter here'
                            onChange={formik.handleChange}
                            value={formik?.values?.registers?.[index]?.topicAmendments}
                          />
                        </Field>
                      </FlexBox>
                    </>
                  )}
                </div>
                <Space size={24} />
              </>
            )
          )}
        {topicName === 'Records' &&
          records &&
          records?.length > 0 &&
          records?.map((record: TMeetingDetailsTopicRecord, index: number) => (
            <>
              <div className={styles.padding} key={index}>
                <FlexBox justifyContent='space-between'>
                  <Typography className={styles.bolder} size='large'>
                    Record {index + 1}
                  </Typography>
                  {record?.fileUrl && record?.fileUrl !== "error" && (<Clickable onClick={() => openDocumentPreviewModal.current.open(record)}>
                    <FlexBox alignItems='center'>
                      <Icon name='green-pdf-icon' size={34} />
                      <Space horizontal size={5} />
                      <Typography gray size='large'>View Document</Typography>
                    </FlexBox>
                  </Clickable>)}
                </FlexBox>

                <Accordion
                  className={styles.neutral}
                  title={record?.name || ''}
                  right={`Category : ${record?.docType || ''}`}
                >
                  <Space size={18} />
                  <FlexBox>
                    <Typography size='large'>{record?.description}</Typography>
                  </FlexBox>
                </Accordion>
                <Space size={16} />

                <FlexBox>
                  <FlexBox flexDirection='column' flex={1}>
                    <Field>
                      <Radio.Group
                        name={`records[${index}].topicStatus`}
                        onChange={formik.handleChange}
                        value={formik?.values?.records?.[index]?.topicStatus }
                        defaultValue={MeetingMinuteStatus.PENDING}
                      >
                        <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
                        <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
                      </Radio.Group>
                    </Field>
                  </FlexBox>
                </FlexBox>
                {formik?.values?.records?.[index]?.topicStatus === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS && (
                  <>
                    <Space size={18} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <FlexBox flexDirection='column'>
                          <Field label='Owner'>
                            <PeopleSelect
                              size='large'
                              allowClear
                              placeholder='Select'
                              onChange={(value) => formik.setFieldValue(`records[${index}].topicOwner`, value)}
                              value={formik?.values?.records?.[index]?.topicOwner}
                            />
                          </Field>
                        </FlexBox>
                      </Col>
                    </Row>
                    <Space size={18} />
                    <FlexBox flexDirection='column' flex={1}>
                      <Field label='Description of amendments'>
                        <TextArea
                          rows={4}
                          name={`records[${index}].topicAmendments`}
                          size='large'
                          placeholder='Enter here'
                          onChange={formik.handleChange}
                          value={formik?.values?.records?.[index]?.topicAmendments}
                        />
                      </Field>
                    </FlexBox>
                  </>
                )}
              </div>
              <Space size={24} />

            </>
          ))}
        {topicName === 'Objectives' &&
          objectives &&
          objectives?.length > 0 &&
          objectives?.map((objective: TMeetingDetailsTopicObjective, index: number) => (
            <>
              <div className={styles.padding} key={index}>
                <FlexBox justifyContent='space-between'>
                  <Typography className={styles.bolder} size='large'>
                    Objective {index + 1}
                  </Typography>
                </FlexBox>

                <Accordion
                  className={styles.neutral}
                  title={objective?.name || ''}
                  right={`Status : ${objective?.status}`}
                >
                  <Space size={18} />
                  <FlexBox>
                    <Typography size='large'>{objective?.description}</Typography>
                  </FlexBox>
                </Accordion>
                <Space size={16} />

                <FlexBox>
                  <FlexBox flexDirection='column' flex={1}>
                    <Field>
                      <Radio.Group
                        name={`objectives[${index}].topicStatus`}
                        onChange={formik.handleChange}
                        value={formik?.values?.objectives?.[index]?.topicStatus }
                        defaultValue={MeetingMinuteStatus.PENDING}
                      >
                        <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
                        <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
                      </Radio.Group>
                    </Field>
                  </FlexBox>
                </FlexBox>
                {formik?.values?.objectives?.[index]?.topicStatus === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS && (
                  <>
                    <Space size={18} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <FlexBox flexDirection='column'>
                          <Field label='Owner'>
                            <PeopleSelect
                              size='large'
                              allowClear
                              placeholder='Select'
                              onChange={(value) => formik.setFieldValue(`objectives[${index}].topicOwner`, value)}
                              value={formik?.values?.objectives?.[index]?.topicOwner}
                            />
                          </Field>
                        </FlexBox>
                      </Col>
                    </Row>
                    <Space size={18} />
                    <FlexBox flexDirection='column' flex={1}>
                      <Field label='Description of amendments'>
                        <TextArea
                          rows={4}
                          name={`objectives[${index}].topicAmendments`}
                          size='large'
                          placeholder='Enter here'
                          onChange={formik.handleChange}
                          value={formik?.values?.objectives?.[index]?.topicAmendments}
                        />
                      </Field>
                    </FlexBox>
                  </>
                )}
              </div>
              <Space size={24} />
            </>
          ))}
        <DocumentPreviewModal ref={openDocumentPreviewModal} />
      </div>
    )
  }
)
ReviewOrApprovalForm.displayName = 'ReviewOrApprovalForm'

export default ReviewOrApprovalForm
