'use client'

import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'

import * as API from '@/api'
import { useSelectedAccountCompany } from '@/hooks'
import { MeetingDetailsContext } from '../../../context'
import { Owner, OwnerOption, TMeetingDetailsTopic, TMeetingDetailsTopicRecord, TMeetingDetailsTopicRegisters, TMinutes } from '@/models'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Modal from '@/components/modal'
import Toast from '@/components/toast'
import Clickable from '@/components/clickable'
import Typography from '@/components/typography'
import Icon from '@/components/icon'
import ConfirmDelete from '@/shared/confirm-delete'
import { MAIN_HEADING, SUB_HEADING, TOPIC_TYPE } from './form-modal-types'
import { getUpdateAttributes } from './form-modal-initial-values'
import { updateAttributeTopicMapSchema } from './form-modal-validation-schemas'
import ChairsIntroductionForm from './opening-the-meeting/chairs-introduction-form'
import AttendeesForm from './opening-the-meeting/attendees-form'
import ApprovalPreviousForm from './opening-the-meeting/approval-previous-minutes'
import AdditionalOpeningForm from '../additional-opening-form'
import NextMeetingForm from './any-other-business/next-meeting-form'
import AdditionalAobForm from './any-other-business/additional-aob-form'
import RiskForReviewForm from './for-discussion/risk-for-review-form'
import ProgressAgainstObjectivesForm from './for-discussion/progress-against-objectives-form'
import HorizonPlanningForm from './for-discussion/horizon-planning-form'
import FinanceOperationsForm from './for-discussion/finance-operations-form'
import AdditionalDiscussionForm from './for-discussion/additional-discussion-item'
import ActionsFromThisMeetingForm from './actions-from-this-meeting/actions-form'
import ReviewOrApprovalForm from './for-review-approval/review-or-approval-form'
import ProgressAgainstActionForm from './action-tracker/progress-against-action-form'
import RiskRegisterFrom from './for-information/risk-register-form'
import AdditionalInformationItem from './for-information/additional-information-item'
import ComplaintsIncidentsForm from './for-discussion/complaints-incidents-form'
import AddActionModal from '../../../../add-action-modal'
import { MEETING_TYPE } from '@/constants'

interface IProps {
  topic: TMeetingDetailsTopic
  onActionSuccess?: () => void
  meetingType?: string
}

export type IOptions = {
  label: string;
  value: string;
  agendaId: string;
}

const SharedFormModal = forwardRef(({ topic, onActionSuccess, meetingType }: IProps, ref) => {
  const deleteModelRef: any = useRef()
  const addActionModalRef: any = useRef()
  const companyId = useSelectedAccountCompany()?.companyId
  const { meetingDetails, loadMeetingDetails } = useContext(
    MeetingDetailsContext
  )
  const [open, setOpen] = useState(false)
  const [initingTopic, setInitingTopic] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updatedAttributes, setUpdatedAttributes] = useState({})
  const [ownerDataOptions, setOwnerDataOptions] = useState<OwnerOption[]>([])
  const [editRiskIndex, setEditRiskIndex] = useState<number[]>([])
  const [topicOptions, setTopicOptions] = useState<IOptions[]>([])

  const validationSchema = yup.object().shape({
    updateAttributes: updateAttributeTopicMapSchema[topic.topicType],
  })

  const onSaveTopic = useCallback(
    async (
      categoryId: string,
      topicId: string,
      topicType: string,
      values: any
    ) => {
      try {
        setInitingTopic(true)
        if (!companyId || !meetingDetails?.id) return
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

        if (Array.isArray(apiObject?.minutes) && apiObject?.minutes?.length > 0) {
          apiObject?.minutes?.map((minute: TMinutes) => {
            if (minute?.status === "pending" || !minute?.status) {
              minute.status = "Pending"
            }
          })
        }
        await API.updateTopic({
          companyId,
          meetingId: meetingDetails.id,
          categoryId,
          topicId,
          topicType,
          updateAttributes: values,
        })
        await loadMeetingDetails()
      } catch (err: any) {
        Toast.error(err.message || 'Something went wrong.')
      } finally {
        setInitingTopic(false)
        setOpen(false)
        setEditRiskIndex([])
      }
    },
    [companyId, meetingDetails, loadMeetingDetails]
  )

  useEffect(() => {
    if (topic) {
      const attributes = getUpdateAttributes(topic)
      setUpdatedAttributes(attributes)
    }
  }, [topic, loadMeetingDetails])

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      categoryId: topic.categoryId,
      topicId: topic.topicId,
      topicType: topic.topicType,
      ...updatedAttributes,
    },
    validationSchema,
    onSubmit: (values) => {
      onSaveTopic(topic.categoryId, topic.topicId, topic.topicType, values)
    },
  })

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        formik.setValues({
          categoryId: topic.categoryId,
          topicId: topic.topicId,
          topicType: topic.topicType,
          ...updatedAttributes,
        })
        setOpen(true)
      },
      close: () => setOpen(false),
    }),
    [formik]
  )

  const fetcOwnerData = useCallback(async () => {
    try {
      if (!companyId) return
      const result = await API.getPeoplesByDepartment(companyId)

      if (result?.departments && result?.departments?.length) {
        const options = result.departments?.map((department: Owner) => ({
          label: department.name,
          value: department.id,
        }))

        setOwnerDataOptions(options)
      }
    } catch (err: any) {
      Toast.error(err?.message || 'Something went wrong.')
    }
  }, [companyId])

  useEffect(() => {
    fetcOwnerData()
    // eslint-disable-next-line
  }, [companyId])

  const deleteTopic = useCallback(async () => {
    try {
      setDeleting(true)
      if (!companyId || !meetingDetails?.id) return

      await API.deleteTopic({
        companyId,
        meetingId: meetingDetails.id,
        categoryId: topic.categoryId,
        topicId: topic.topicId,
      })

      await loadMeetingDetails()
      Toast.success('Delete topic successfully')
    } catch (err: any) {
      Toast.error(err?.message || 'Something went wrong.')
    } finally {
      setDeleting(false)
    }
  }, [companyId, loadMeetingDetails, meetingDetails?.id])

  let formToDisplay = <></>,
    mainHeading,
    subHeading
  const topicType = topic.topicType
  if (topicType === TOPIC_TYPE.CHAIR_INTRODUCTION) {
    mainHeading = MAIN_HEADING.OPENING_MEETING
    subHeading = SUB_HEADING.CHAIR_INTRODUCTION
    formToDisplay = <ChairsIntroductionForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.ATTENDEES) {
    mainHeading = MAIN_HEADING.OPENING_MEETING
    formToDisplay = <AttendeesForm ref={ref} formik={formik} meetingType={meetingType} />
    if (meetingType === MEETING_TYPE.MANAGEMENT) {
      subHeading = SUB_HEADING.ATTENDEES_MANAGEMENT
    } else {
      subHeading = SUB_HEADING.ATTENDEES
    }
  } else if (topicType === TOPIC_TYPE.APPROVAL) {
    mainHeading = MAIN_HEADING.OPENING_MEETING
    subHeading = SUB_HEADING.APPROVAL
    formToDisplay = <ApprovalPreviousForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.ADDITIONAL_AOB) {
    mainHeading = MAIN_HEADING.AOB
    subHeading = SUB_HEADING.ADDITIONAL_AOB
    formToDisplay = <AdditionalAobForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.NEXT_MEETING) {
    mainHeading = SUB_HEADING.NEXT_MEETING
    subHeading = SUB_HEADING.ADDITIONAL_AOB
    formToDisplay = <NextMeetingForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.RISKS) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.RISKS
    formToDisplay = (
      <RiskForReviewForm
        ref={ref}
        formik={formik}
        setEditRiskIndex={setEditRiskIndex}
        editRiskIndex={editRiskIndex}
      />
    )
  } else if (topicType === TOPIC_TYPE.PROGRESS) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.PROGRESS
    formToDisplay = <ProgressAgainstObjectivesForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.HORIZON_PLANNING) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.HORIZON_PLANNING
    formToDisplay = <HorizonPlanningForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.FINANCE) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.FINANCE
    formToDisplay = <FinanceOperationsForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.ADDITIONAL_DISCUSSION) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.ADDITIONAL_DISCUSSION
    formToDisplay = <AdditionalDiscussionForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.COMPLAINT_INCIDENT) {
    mainHeading = MAIN_HEADING.DISCUSSION
    subHeading = SUB_HEADING.COMPLAINT_INCIDENT
    formToDisplay = <ComplaintsIncidentsForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.ACTIONS) {
    mainHeading = MAIN_HEADING.ACTIONS_MEETING
    subHeading = SUB_HEADING.ACTIONS
    formToDisplay = (
      <ActionsFromThisMeetingForm
        ref={ref}
        formik={formik}
        meetingDate={meetingDetails?.date}
      />
    )
  } else if (
    topicType === TOPIC_TYPE.REVIEW_APPROVAL ||
    topicType === TOPIC_TYPE.RECORD_APPROVAL ||
    topicType === TOPIC_TYPE.REGISTER_APPROVAL ||
    topicType === TOPIC_TYPE.OBJECTIVE_APPROVAL
  ) {
    mainHeading = MAIN_HEADING.REVIEW_APPROVAL
    subHeading = SUB_HEADING.REVIEW_APPROVAL
    formToDisplay = (
      <ReviewOrApprovalForm
        ref={ref}
        formik={formik}
        ownerDataOptions={ownerDataOptions}
      />
    )
  } else if (topicType === TOPIC_TYPE.PROGRESS_ACTIONS) {
    mainHeading = MAIN_HEADING.ACTIONS_FROM_PREVIOUS_MEETINGS
    subHeading = SUB_HEADING.ACTION_TRACKER
    formToDisplay = <ProgressAgainstActionForm ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.RISK_REGISTER) {
    mainHeading = MAIN_HEADING.INFORMATION
    subHeading = SUB_HEADING.RISK_REGISTER
    formToDisplay = <RiskRegisterFrom ref={ref} formik={formik} />
  } else if (topicType === TOPIC_TYPE.ADDITIONAL_INFORMATION) {
    mainHeading = MAIN_HEADING.INFORMATION
    subHeading = SUB_HEADING.ADDITIONAL_INFORMATION
    formToDisplay = <AdditionalInformationItem ref={ref} formik={formik} />
  } else {
    mainHeading = 'Manage Agenda'
    subHeading = 'Additional Form'
    formToDisplay = <AdditionalOpeningForm ref={ref} formik={formik} />
  }

  useEffect(() => {
    if (topic && meetingDetails) {
      const options: IOptions[] = [];
      const meeting = meetingDetails?.agenda?.find(
        (category) => category.categoryId === topic?.categoryId)
      if (meeting) {
        meeting?.topics?.map((topicData) => {
          options.push({ label: topicData?.topicName, value: topicData?.topicId, agendaId: topicData?.categoryId })
        })
      }
      setTopicOptions(options)
    }
  }, [topic, meetingDetails])

  return (
    <Modal open={open} width={780} onCancel={() => setOpen(false)}>
      <div>
        <Typography size='giant'>{mainHeading}</Typography>
        <Space size={24} />
        {topicType === TOPIC_TYPE.REVIEW_APPROVAL && (
          <Typography gray size='large'>
            In this section you can record what the board approved/rejected at
            the meeting.
          </Typography>
        )}
        {(subHeading != SUB_HEADING.ADDITIONAL_AOB ||
          subHeading != SUB_HEADING.ACTIONS ||
          subHeading != SUB_HEADING.REVIEW_APPROVAL) && (
          <FlexBox justifyContent='space-between' alignItems='center'>
            <Typography size='huge'>{subHeading}</Typography>
            <Clickable onClick={() => deleteModelRef?.current?.open()}>
              <Icon name='black-delete-icon' size={24} />
            </Clickable>
          </FlexBox>
        )}
        {topicType != TOPIC_TYPE.ACTIONS && <Space size={24} />}
        {formToDisplay}
        <Space size={24} />
        <FlexBox justifyContent='flex-end'>
          {topicType === TOPIC_TYPE.ACTIONS && (
            <Button
              onClick={() => deleteModelRef?.current?.open()}
              style={{ marginRight: '2%' }}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => addActionModalRef.current.open()}
            style={{ marginRight: '2%' }}
          >
            Add action
          </Button>

          <Button
            type='primary'
            loading={initingTopic}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>

        </FlexBox>
        <AddActionModal
          ref={addActionModalRef}
          meetingId={meetingDetails?.id}
          topicId={topic?.topicId}
          topicOptions={topicOptions}
          onSuccess={onActionSuccess}
        />
        <ConfirmDelete
          ref={deleteModelRef}
          handleConfirm={deleteTopic}
          loading={deleting}
        />
      </div>
    </Modal>
  )
})

SharedFormModal.displayName = 'SharedFormModal'

export default SharedFormModal
