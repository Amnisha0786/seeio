import { Fragment, useState, useContext, useEffect, useRef } from 'react'
import { Input, Row, Col, ModalProps, Dropdown, Radio } from 'antd'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import { useRouter, useParams } from 'next/navigation'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Card from '@/components/card'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import FilePicker from '@/components/file-picker'
import Icon from '@/components/icon'
import { EllipsisOutlined } from '@ant-design/icons';
import { TMeetingDetailsTopic, TMeetingDetailsTopicRisk } from '@/models'
import { MeetingDetailsContext } from '../../context'
import styles from './page.module.scss'
import MeetingRiskForm, { getFullLabel } from '../../meeting-risks-form'
import variables from '@/theme/variables.module.scss'
import ConfirmDelete from '@/shared/confirm-delete'
import { MeetingMinuteStatus } from '../started/form-modals/form-modal-validation-schemas'
import PeopleSelect from '@/shared/people-select'

interface IProps extends ModalProps {
  onCancel: () => void
  topic: TMeetingDetailsTopic
}

type TForm = {
  timeAlloted?: number
  minutes?: string
  documents: File[]
  risks?: TMeetingDetailsTopicRisk[]
}

const initialValuesOfRisks = {
  id: "",
  name: "",
  description: "",
  riskType: "",
  nextReview: "",
  topicOwner: "",
  topicStatus: "",
  topicAmendments: ""
}

const RisksForReviewModal = ({ onCancel, topic, open, ...props }: IProps) => {
  const [openAction, setOpenAction] = useState<string | null>(null)
  const { updateTopic, deleteTopic, deleting } = useContext(MeetingDetailsContext)
  const [loading, setLoading] = useState(false)
  const [editRiskIndex, setEditRiskIndex] = useState<number[]>([])
  const [risks, setRisks] = useState<TMeetingDetailsTopicRisk[]>(topic?.risks || [])
  const deleteModelRef = useRef<any>();
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (topic?.risks?.length) {
      setRisks(topic?.risks || [])
    }
  }, [topic]);

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      timeAlloted: topic?.timeAlloted,
      minutes: Array.isArray(topic?.minutes) ? topic.minutes?.[0]?.description : "",
      risks: topic?.risks,
      documents: []
    },
    onSubmit: async (values) => {
      setLoading(true)
      await updateTopic(topic, values)
      setRisks(values?.risks || [])
      onCancel()
      setLoading(false)
      setEditRiskIndex([])
    }
  });

  const onDelete = async () => {
    deleteTopic(topic, onCancel)
  }

  useEffect(() => {
    if (open) formik.resetForm()

    // eslint-disable-next-line
  }, [open])


  const handleEditRisk = (index: number) => {
    if (editRiskIndex.includes(index)) {
      setEditRiskIndex(editRiskIndex.filter((item: number) => item !== index))
    } else {
      setEditRiskIndex([...editRiskIndex, index])
    }
    const riskToEdit: TMeetingDetailsTopicRisk = topic?.risks?.[index] || initialValuesOfRisks;
    formik.setValues({
      ...formik.values,
      risks: topic?.risks?.map((risk, i) =>
        i === index ? riskToEdit : risk
      ),
    });
  }
  const handleCancel = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setEditRiskIndex(editRiskIndex.filter((i) => i !== index));
  }

  const handleDeleteRisk = (index: number) => {
    if (!topic.risks) return
    const updatedRisks = [...risks];
    updatedRisks.splice(index, 1);
    setRisks(updatedRisks)

  };

  return (
    <Modal
      width={780}
      onCancel={onCancel}
      open={open}
      {...props}
    >
      <div className={styles.addActionModal}>
        <Typography size="giant">
          Manage agenda
        </Typography>
        <Space size={24} />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">
            Risks for Review
          </Typography>
          <Clickable onClick={() => deleteModelRef.current.open()}>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
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
                value={formik.values.minutes}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Associated document(s)">
              <FilePicker onChange={(files) => formik.setFieldValue("documents", files)} />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        {topic.documents?.map((document) => (
          <Fragment key={document.documentId}>
            <Clickable
              onClick={() => router.push(
                `/dashboard/meeting-and-track-targets/${params?.meetingId}/${topic.categoryId}/${topic.topicId}/document/${document.documentId}`
              )}
            >
              <FlexBox alignItems="center">
                <Icon name="pdf-file-icon" size={34} />
                <Space horizontal size={5} />
                <Typography gray>
                  {document.fileName}
                </Typography>
              </FlexBox>
            </Clickable>
            <Space size={16} />
          </Fragment>
        ))}
        <Space size={24} />
        {risks?.map((risk, index) => (
          <Fragment key={risk.id}>

            <Card>
              {editRiskIndex.includes(index) ? (
                <>
                  <FlexBox alignItems="center" justifyContent="space-between">
                    <div></div>
                    <Clickable onClick={(e) => handleCancel(e, index)}>
                      <Icon
                        name='cross-icon'
                        color={variables.primaryColor}
                        size={30}
                      />
                    </Clickable>
                  </FlexBox>
                  <MeetingRiskForm formik={formik} index={index} />
                </>
              ) : (
                <FlexBox flexDirection="column">
                  <FlexBox alignItems="center" justifyContent="space-between">
                    <Typography size="large" bold>
                      {risk.name}
                    </Typography>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        menu={{
                          items: [
                            {
                              label: 'Edit',
                              key: '1',
                              onClick: () => handleEditRisk(index),
                            },
                            {
                              label: 'Delete',
                              key: '2',
                              onClick: () => handleDeleteRisk(index),
                              style: { color: "red" }
                            },
                          ],
                        }}
                        trigger={['click']}
                      >
                        <Clickable
                          className={styles.optionButton}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <EllipsisOutlined />
                        </Clickable>
                      </Dropdown>
                    </div>
                  </FlexBox>
                  <Space size={14} />
                  <Clickable onClick={() => setOpenAction(risk.id === openAction ? null : risk.id)}>
                    <FlexBox alignItems="center" justifyContent="space-between">
                      <FlexBox flex={1}>
                        <Typography size="large">
                          Due Date: {risk.nextReview ? dayjs(risk.nextReview).format('MMM DD YYYY') : "- -"}
                        </Typography>
                      </FlexBox>
                      <FlexBox flex={1}>
                        <Typography size="large">
                          Category: {getFullLabel(risk?.riskType) || ""}
                        </Typography>
                      </FlexBox>
                      <Icon name="up-arrow" size={24} rotate={risk.id === openAction ? 0 : 180} />
                    </FlexBox>
                  </Clickable>
                  {risk.id === openAction && (
                    <>
                      <Space size={14} />
                      <Typography size="large" gray>
                        {risk.description}
                      </Typography>
                    </>
                  )}
                </FlexBox>)}
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
            </Card>
            <Space size={24} />
          </Fragment>
        ))}
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </FlexBox>
      </div>

      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={onDelete}
        loading={deleting}
        message={'Are you sure you want to delete the topic?'}
      />
    </Modal>
  )
}
RisksForReviewModal.displayName = "RisksForReviewModal"

export default RisksForReviewModal
