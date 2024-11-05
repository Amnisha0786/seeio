import React, {
  forwardRef,
  useContext,
  useRef,
  useState,
} from 'react'
import { Col, Input, ModalProps, Radio, Row } from 'antd'
import { useFormik } from 'formik'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import styles from './page.module.scss'
import {
  TMeetingDetailsTopic,
  TMeetingDetailsTopicObjective,
  TMeetingDetailsTopicRecord,
  TMeetingDetailsTopicRegisters,
} from '@/models'
import { MeetingDetailsContext } from '../../context'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import Accordion from '@/components/accordion'
import DraftEditor from '@/components/draft-editor'
import Field from '@/components/field'
import Button from '@/components/button'
import { MeetingMinuteStatus } from '../started/form-modals/form-modal-validation-schemas'
import PeopleSelect from '@/shared/people-select'
import { DOCUMENT_TYPE } from '@/app/(protected)/documents/registers/registers-validation-schemas'
import PreviewObjectiveDetails from '@/app/(protected)/dashboard/business-health/corporate-objectives/preview-action-details'
import { CorporateObjective } from '@/models/corporate-objective'

interface IProps extends ModalProps {
  onCancel: () => void
  topic: TMeetingDetailsTopic
}


const ForReviewOrApprovalModal = forwardRef(
  ({ onCancel, open, topic, ...props }: IProps, ref) => {
    const { updateTopic } = useContext(
      MeetingDetailsContext
    )
    const ViewObjectiveModalRef: any = useRef();
    const [loading, setLoading] = useState(false)
    const openDocumentPreviewModal: any = useRef()
    const [viewObjective, setViewObjective] = useState<CorporateObjective | null>(
      null
    );
    const [openModal, setOpenModal] = useState(false);

    const formik = useFormik({
      validateOnChange: false,
      initialValues: {
        categoryId: topic.categoryId,
        topicId: topic.topicId,
        topicType: topic.topicType,
        topicName: topic?.topicName || '',
        registers: topic?.registers,
        records: topic?.records,
        objectives: topic?.objectives,
        topic: topic?.topic || '',
        presenter: topic?.presenter,
        forReviewOrApproval: topic?.forReviewOrApproval || '',
        minutes: topic?.minutes || '',
        discussion: topic?.discussion || '',
        meetingIsQuorate: topic?.meetingIsQuorate,
        timeAlloted: topic?.timeAlloted || '',
        notes: topic?.notes || '',
        documents: topic?.documents || '',
      },
      onSubmit: async (values: any) => {
        setLoading(true)
        if (values.documents) {
          delete values.documents
        }
        const apiObject = { ...values };

        if (apiObject?.registers && apiObject?.registers?.length > 0) {
          apiObject?.registers.map((register: TMeetingDetailsTopicRegisters) => {
            if (register?.additionalFiles) {
              delete register?.additionalFiles
            }
            if (register?.fileUrl) {
              delete register.fileUrl
            }
            if (register?.fileType) {
              delete register.fileType
            }
            if (register?.fileName) {
              delete register.fileName
            }
            if (register?.fileSize) {
              delete register?.fileSize
            }
            if (register?.owner && typeof register?.owner !== "string") {
              register.owner = register?.owner?.id
            }
          })
        }
        if (apiObject?.records && apiObject?.records?.length > 0) {
          apiObject?.records.map((record: TMeetingDetailsTopicRecord) => {
            if (record?.additionalFiles) {
              delete record?.additionalFiles
            }
            if (record?.fileUrl) {
              delete record.fileUrl
            }
            if (record?.fileType) {
              delete record.fileType
            }
            if (record?.fileName) {
              delete record.fileName
            }
            if (record?.fileSize) {
              delete record?.fileSize
            }
            if (record?.owner && typeof record?.owner !== "string") {
              record.owner = record?.owner?.id
            }
          })
        }
        await updateTopic(topic, values)
        onCancel()
        setLoading(false)
      },
    })

    const {
      discussion,
      topicName,
      notes,
      registers,
      records,
      objectives,
    } = formik.values


    return (
      <Modal open={open} width={780} onCancel={onCancel} {...props}>
        <div className={styles.addActionModal}>
          <Typography size='giant'>Manage agenda</Typography>
          <Space size={24} />
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>For review/approval</Typography>
          </FlexBox>
          <Space size={24} />
          <div>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Field label="Alloted time (minutes)">
                  <Input
                    name="timeAlloted"
                    size="large"
                    type="number"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.timeAlloted}
                  />
                </Field>
              </Col>
            </Row>
            <Space size={24} />
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
                        <Clickable
                          onClick={() =>
                            openDocumentPreviewModal.current.open(register)
                          }
                        >
                          <FlexBox alignItems='center'>
                            <Icon name='green-pdf-icon' size={34} />
                            <Space horizontal size={5} />
                            <Typography gray size='large'>
                              View Document
                            </Typography>
                          </FlexBox>
                        </Clickable>
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

                      {(register?.docType === DOCUMENT_TYPE.RESOLUTION ||
                        register?.docType === DOCUMENT_TYPE.RESOLUTION_DOCTYPE ||
                        register?.docType === DOCUMENT_TYPE.RESOLUTION_DOCUMENT) && (
                        <>
                          <Space size={16} />

                          <FlexBox>
                            <FlexBox flexDirection='column' flex={1}>
                              <Field labelProps={{ size: 'large' }} label='Resolution number'>
                                <Typography size='large'>{register?.resolutionNumber || "-"}</Typography>
                              </Field>
                            </FlexBox>
                            <Space horizontal size={24} />

                            <FlexBox flexDirection='column' flex={1} alignItems='flex-end'>
                              <Field label='Type of resolution' labelProps={{ size: 'large' }}>
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
                              value={formik?.values?.registers?.[index]?.topicStatus}
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
                                value={formik?.values?.registers?.[index]?.topicAmendments || ""}
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
              records?.map(
                (record: TMeetingDetailsTopicRecord, index: number) => (
                  <>
                    <div className={styles.padding} key={index}>
                      <FlexBox justifyContent='space-between'>
                        <Typography className={styles.bolder} size='large'>
                          Record {index + 1}
                        </Typography>
                        <Clickable
                          onClick={() =>
                            openDocumentPreviewModal.current.open(record)
                          }
                        >
                          <FlexBox alignItems='center'>
                            <Icon name='green-pdf-icon' size={34} />
                            <Space horizontal size={5} />
                            <Typography gray size='large'>
                              View Document
                            </Typography>
                          </FlexBox>
                        </Clickable>
                      </FlexBox>

                      <Accordion
                        className={styles.neutral}
                        title={record?.name || ''}
                        right={`Category : ${record?.docType || ''}`}
                      >
                        <Space size={18} />
                        <FlexBox>
                          <Typography size='large'>
                            {record?.description}
                          </Typography>
                        </FlexBox>
                      </Accordion>
                      <Space size={16} />

                      <FlexBox>
                        <FlexBox flexDirection='column' flex={1}>
                          <Field>
                            <Radio.Group
                              name={`records[${index}].topicStatus`}
                              onChange={formik.handleChange}
                              value={formik?.values?.records?.[index]?.topicStatus}
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
                                value={formik?.values?.records?.[index]?.topicAmendments || ""}
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
            {topicName === 'Objectives' &&
              objectives &&
              objectives?.length > 0 &&
              objectives?.map(
                (objective: TMeetingDetailsTopicObjective, index: number) => (
                  <>
                    <div className={styles.padding} key={index}>
                      <FlexBox justifyContent='space-between'>
                        <Typography className={styles.bolder} size='large'>
                          Objective {index + 1}
                        </Typography>
                      </FlexBox>

                      <FlexBox justifyContent='space-between'>
                        <Clickable
                          onClick={() => {
                            if (objectives?.length > 0) {
                              setViewObjective(objectives?.find((item: any) => objective?.id === item?.id) || null);
                              ViewObjectiveModalRef?.current?.open()
                            }
                          }}>
                          <Typography size='huge' color='#9ec23b'>
                            {objective?.name || ''}
                          </Typography>
                        </Clickable>
                        <Typography>{objective?.status ? `Status : ${objective?.status}` : ""}

                        </Typography>
                      </FlexBox>
                      <Space size={16} />

                      <FlexBox>
                        <FlexBox flexDirection='column' flex={1}>
                          <Field>
                            <Radio.Group
                              name={`objectives[${index}].topicStatus`}
                              onChange={formik.handleChange}
                              value={formik?.values?.objectives?.[index]?.topicStatus}
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
                                value={formik?.values?.objectives?.[index]?.topicAmendments || ""}
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
            <DocumentPreviewModal ref={openDocumentPreviewModal} />
          </div>
          <Space size={24} />
          <FlexBox justifyContent='flex-end'>
            <Button type='primary' loading={loading} onClick={() => formik.handleSubmit()}>
              Save
            </Button>
          </FlexBox>
        </div>
        <PreviewObjectiveDetails
          open={openModal}
          setOpen={setOpenModal}
          ref={ViewObjectiveModalRef}
          onEdit={(objective: CorporateObjective | null) => {
            setViewObjective(objective);
            ViewObjectiveModalRef.current.close();
          }}
          isEdit={false}
          hideEditButton={true}
          setViewObjective={setViewObjective}
          details={viewObjective}
        />
      </Modal>
    )
  }
)
ForReviewOrApprovalModal.displayName = 'ForReviewOrApprovalModal'

export default ForReviewOrApprovalModal
