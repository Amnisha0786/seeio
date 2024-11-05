'use client'
import { forwardRef, useRef } from 'react'
import { Col, Radio, Row } from 'antd'
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import Field from '@/components/field'
import Accordion from '@/components/accordion'
import variables from '@/theme/variables.module.scss'
import styles from '../../page.module.scss'
import PeopleSelect from '@/shared/people-select'
import MeetingRiskForm, { getFullLabel } from '../../../../meeting-risks-form'
import { TMeetingDetailsTopicDoc, TMeetingDetailsTopicRisk } from '@/models'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import { MeetingMinuteStatus } from '../form-modal-validation-schemas'

const RiskForReviewForm = forwardRef(
  (
    {
      formik,
      setEditRiskIndex,
      editRiskIndex,
    }: { formik: any; setEditRiskIndex: (data: number[]) => void; editRiskIndex: number[] },
    ref
  ) => {
    const { presenter, discussion, minutes, risks, documents } = formik.values
    const openDocumentPreviewModal: any = useRef()

    const handleEditRisk = (index: number) => {
      if (editRiskIndex.includes(index)) {
        setEditRiskIndex(editRiskIndex.filter((item) => item !== index))
      } else {
        setEditRiskIndex([...editRiskIndex, index])
      }
    }

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
            <Field label='Minutes'>
              <TextArea
                rows={3}
                disabled
                name={`minutes`}
                size='large'
                value={minutes}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        {risks &&
          risks?.length > 0 &&
          risks?.map((risk: TMeetingDetailsTopicRisk, index: number) => (
            <>
              <div className={styles.padding} key={index}>
                <FlexBox justifyContent='space-between'>
                  <Typography className={styles.bolder} size='large'>
                    Risk {index + 1}
                  </Typography>
                  <FlexBox>
                    <Clickable onClick={() => handleEditRisk(index)}>
                      {editRiskIndex.includes(index) ? (
                        <Icon
                          name='cross-icon'
                          color={variables.primaryColor}
                          size={30}
                        />
                      ) : (
                        <Icon
                          name='edit'
                          color={variables.primaryColor}
                          size={24}
                        />
                      )}
                    </Clickable>
                  </FlexBox>
                </FlexBox>
                {editRiskIndex.includes(index) ? (
                  <MeetingRiskForm formik={formik} index={index} />
                ) : (
                  <Accordion
                    className={styles.neutral}
                    title={risk?.name || ''}
                    middle={{
                      text1: `Due Date : ${risk?.nextReview
                        ? dayjs(risk?.nextReview).format('DD/MM/YYYY')
                        : '-'
                      } 
                      `,
                    }}
                    right={`Category : ${getFullLabel(risk?.riskType) || ""}`}
                  >
                    <Space size={18} />
                    <FlexBox>
                      <Typography size='large'>{risk?.description}</Typography>
                    </FlexBox>
                  </Accordion>
                )}
                <Space size={16} />

                <FlexBox>
                  <FlexBox flexDirection='column' flex={1}>
                    <Field>
                      <Radio.Group
                        name={`risks[${index}].topicStatus`}
                        onChange={formik.handleChange}
                        value={formik?.values?.risks?.[index]?.topicStatus}
                        defaultValue={MeetingMinuteStatus.PENDING}
                      >
                        <Radio value={MeetingMinuteStatus.APPROVED}>Approve</Radio>
                        <Radio value={MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS}>Approve With Amendments</Radio>
                      </Radio.Group>
                    </Field>
                  </FlexBox>
                </FlexBox>
                {formik?.values?.risks?.[index]?.topicStatus === MeetingMinuteStatus.APPROVED_WITH_AMENDMENTS && (
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
                              onChange={(value) => formik.setFieldValue(`risks[${index}].topicOwner`, value)}
                              value={formik?.values?.risks?.[index]?.topicOwner}
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
                          name={`risks[${index}].topicAmendments`}
                          size='large'
                          placeholder='Enter here'
                          onChange={formik.handleChange}
                          value={formik?.values?.risks?.[index]?.topicAmendments}
                        />
                      </Field>
                    </FlexBox>
                  </>
                )}
              </div>
              <Space size={24} />
            </>
          ))}
        <Space size={16} />
        {documents &&
          documents?.map((document: TMeetingDetailsTopicDoc) => (
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
RiskForReviewForm.displayName = 'RiskForReviewForm'

export default RiskForReviewForm
