"use client"

import React, { useState, useContext, useRef, useEffect } from 'react'
import { Select, Checkbox, Input, DatePicker, Dropdown, Tooltip, UploadFile } from 'antd'
import { EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as yup from 'yup'
import dayjs from 'dayjs'
import lodash from 'lodash'

import Space from '@/components/space'
import Typography from '@/components/typography'
import Button from '@/components/button'
import Breadcrumbs from '@/components/breadcrumbs'
import FlexBox from '@/components/flex-box'
import Toast from '@/components/toast'
import Field from '@/components/field'
import * as API from '@/api'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import { MeetingDetailsContext } from '../context'
import styles from './layout.module.scss'
import { CATEGORY_TYPE, TOPIC_TYPE } from './started/form-modals/form-modal-types'
import ConfirmNextDate from './ended/next-date-confirmation-modal'
import { TMeetingDetailsTopic } from '@/models'
import SharedFormModal from './started/form-modals/shared-form-modal'
import Clickable from '@/components/clickable'
import { isProduction, MEETING_AGENDA_STATUS, MEETING_TYPE, MEETING_TYPES } from '@/constants'
import ConfirmToClose from './ended/close-meeting-confirmation-modal'
import DocumentPreviewModal from '@/shared/document-preview-modal'
import OpenMeetingWarningModal from '@/shared/open-meeting-warning-modal'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, EVENT_TYPE, PLATFORM } from '@/contexts/AmplitudeContext'
import FilePicker from '@/components/file-picker'
import Loading from '@/components/loading'

type TForm = {
  name: string
  location: string
  date: dayjs.Dayjs | null
  isVirtual?: boolean
  type: string | null
}

const initialTopic = {
  topicId: "",
  categoryId: "",
  topicName: "",
  topicType: "",
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  location: yup.string().required('Location is required.'),
  date: yup.date().required('Date is required.'),
  type: yup.string().required('Type is required.')
})

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [ending, setEnding] = useState(false)
  const [topicWithoutNextDate, setTopicWithoutNextDate] = useState<TMeetingDetailsTopic>()
  const [isPreview, setIsPreview] = useState(false)
  const [isUploadingTranscript, setIsUploadingTranscript] = useState(false)
  const [isHideUploadTranscript, seIsHideUploadTranscript] = useState(false)

  const { meetingDetails, loadMeetingDetails } = useContext(MeetingDetailsContext)
  const companyId = useSelectedAccountCompany()?.companyId
  const confirmationModalRef: any = useRef()
  const nextMeetingDateModalRef: any = useRef()
  const confirmToCloseModalRef: any = useRef()
  const previewDocumentModalRef: any = useRef()
  const openMeetingModalRef: any = useRef()
  const router = useRouter()


  const { trackAmplitudeEvent } = useAmplitudeContext();
  const userAccess = useAccessLevel()

  const formik = useFormik<TForm>({
    validateOnChange: false,
    enableReinitialize: true,
    initialValues: meetingDetails ? {
      name: meetingDetails?.name,
      location: meetingDetails?.location,
      isVirtual: meetingDetails?.isVirtual,
      type: meetingDetails?.type,
      date: dayjs(meetingDetails.date)
    } : {
      name: '',
      location: '',
      isVirtual: false,
      date: dayjs(),
      type: null
    },
    validationSchema,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: () => { }
  })

  useEffect(() => {
    if (meetingDetails?.transcriptUploadedAt) {
      seIsHideUploadTranscript(true)
    }
  }, [meetingDetails])

  const onSaveMeeting = async (values: any) => {
    if (!companyId || !meetingDetails || meetingDetails.status === "closed") return;
    try {
      const meetingValues = {
        name: meetingDetails?.name,
        location: meetingDetails?.location,
        isVirtual: meetingDetails?.isVirtual,
        type: meetingDetails?.type,
        date: dayjs(meetingDetails.date),
      }
      await API.updateMeeting({
        companyId,
        meetingId: meetingDetails.id,
        status: "planned",
        ...meetingValues,
        ...values
      });
      await loadMeetingDetails();
      Toast.success("Updated successfully!");
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    }
  };

  const onRefreshMeeting = async () => {
    setRefreshLoading(true)

    if (!companyId || !meetingDetails) return
    try {
      await API.refreshMeeting({
        companyId,
        meetingId: meetingDetails.id,
      })
      await loadMeetingDetails()
      Toast.success('Agenda Refreshed')
    } catch (err) {
      Toast.error('Something went wrong.')
    } finally {
      setRefreshLoading(false)
    }
  }

  const onApplyTemplate = async () => {
    setRefreshLoading(true)

    if (!companyId || !meetingDetails) return
    try {
      await API.applyTemplate({
        companyId,
        meetingId: meetingDetails.id,
      })
      await loadMeetingDetails()
      Toast.success('Template Applied')
    } catch (err) {
      Toast.error('Something went wrong.')
    } finally {
      setRefreshLoading(false)
    }
  }

  const onUpdateMeeting = async (type: 'planned' | 'open' | 'closed', agendaStatus?: MEETING_AGENDA_STATUS) => {
    setLoading(true)

    try {
      if (!companyId || !meetingDetails) return

      if (agendaStatus) {
        await API.updateMeeting({
          companyId,
          meetingId: meetingDetails.id,
          agendaStatus
        })
      } else {

        await API.updateMeeting({
          companyId,
          meetingId: meetingDetails.id,
          status: type
        })
      }

      await loadMeetingDetails()
      if (agendaStatus) {
        Toast.success("Agenda Finalised")
        trackAmplitudeEvent(EVENT_TYPE.KEY_STEP, {
          user_id: userAccess?.userId,
          actioned_at: new Date().valueOf(),
          platform: PLATFORM.WEB,
        });
      } else if (type == 'planned') {
        Toast.success("Meeting Planned")
      } else if (type == 'open') {
        Toast.success("Meeting Opened")
      } else {
        Toast.success("Meeting Closed")
      }
    } finally {
      confirmToCloseModalRef.current.close()
      if (type === "open") {
        trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
          user_id: userAccess?.userId,
          actioned_at: new Date().valueOf(),
          platform: PLATFORM.WEB,
        });
        router.push(`/dashboard/meeting-and-track-targets/${meetingDetails?.id}/status/started`)
      } else if (type === "closed") {
        router.push(`/dashboard/meeting-and-track-targets/${meetingDetails?.id}/status/ended`)
      } else if (type === "planned") {
        router.push(`/dashboard/meeting-and-track-targets/${meetingDetails?.id}/status/planned`)
      }
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    try {
      setEnding(true)
      confirmToCloseModalRef.current.open()
    } catch (error) {
      Toast.error("Something went wrong.")
    } finally {
      confirmationModalRef.current.close()
      setEnding(false)
    }
  }

  const handleCancel = () => {
    confirmationModalRef.current.close()
    nextMeetingDateModalRef.current.open()
  }

  const handleEditAgendaClick = () => {
    onUpdateMeeting('planned', MEETING_AGENDA_STATUS.IN_PROGRESS)
  }

  const handleCloseClick = () => {
    if (meetingDetails && meetingDetails?.agenda?.length > 0) {
      meetingDetails?.agenda?.map((agenda) => {
        if (agenda?.categoryType == CATEGORY_TYPE.AOB) {
          if (agenda?.topics?.length > 0) {
            agenda?.topics?.map((topic) => {
              if (topic?.topicType == TOPIC_TYPE.NEXT_MEETING) {
                if (!topic?.dateOfNextMeeting) {
                  setTopicWithoutNextDate(topic)
                  trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
                    user_id: userAccess?.userId,
                    actioned_at: new Date().valueOf(),
                    platform: PLATFORM.WEB,
                  });
                  confirmationModalRef.current.open()
                } else {
                  confirmToCloseModalRef.current.open()
                }
              }
            })
          }
        }
      })
    }
  }

  const handleFinaliseMeeting = () => {
    onUpdateMeeting('closed')
  }

  const handleClose = () => {
    confirmationModalRef.current.close()
    confirmToCloseModalRef.current.close()
  }

  const handlePreviewMinuteClick = async () => {
    if (!companyId || !meetingDetails) return
    try {
      setIsPreview(true)
      const result = await API.previewMinute({ companyId, meetingId: meetingDetails?.id })
      if (result) {
        previewDocumentModalRef.current.open({
          fileUrl: result,
          fileType: "application/pdf",
        })
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
    } finally {
      setIsPreview(false)
    }
  }

  const handleOpenMeeting = () => {
    if (meetingDetails?.date) {
      const parsedDate = dayjs(meetingDetails?.date).startOf('day')
      if (parsedDate.isAfter(dayjs().startOf('day'))) {
        openMeetingModalRef.current.open()
      } else {
        onUpdateMeeting('open')
      }
    }
  }

  const handleUploadTranscript = async (file: UploadFile | File | null) => {
    if (!companyId || !meetingDetails) return
    try {
      setIsUploadingTranscript(true)
      await API.uploadTranscript({ companyId, meetingId: meetingDetails?.id, file: file as File })
      seIsHideUploadTranscript(true)
      Toast.success("Transcript uploaded successfully.")
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
    } finally {
      setIsUploadingTranscript(false)
    }
  }

  const handleInputChange = lodash.debounce((key: string, value: string) => {
    formik.setFieldValue(key, value);
    onSaveMeeting({ [key]: value });
  }, 1000)

  if (!meetingDetails) return null

  return (
    <>
      <FlexBox justifyContent="space-between">
        <Breadcrumbs
          items={[
            {
              title: "Meetings",
              link: "/dashboard/meeting-and-track-targets",
            },
            {
              title: meetingDetails.name,
            },
          ]}
        />
        {meetingDetails.status == "planned" &&
          meetingDetails?.agendaStatus === MEETING_AGENDA_STATUS.FINALISED && (
          <FlexBox alignItems="center">
            <Button
              type='primary'
              onClick={() => {


                handleOpenMeeting()
              }}
              loading={loading}
            >
                Start meeting
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    label: 'Edit Agenda',
                    key: '0',
                    onClick: () => handleEditAgendaClick(),
                  },
                ],
              }}
              trigger={['click']}
            >
              <Clickable onClick={(e) => e.stopPropagation()}>
                <EllipsisOutlined style={{ fontSize: 24, marginLeft: 10 }} />
              </Clickable>
            </Dropdown>
          </FlexBox>
        )}
        {meetingDetails.status == 'planned' &&
          meetingDetails?.agendaStatus ===
          MEETING_AGENDA_STATUS.IN_PROGRESS && (
          <FlexBox >
            {meetingDetails?.type === MEETING_TYPE.MANAGEMENT ? (
              <Button
                onClick={() =>
                  onApplyTemplate()
                }
                loading={refreshLoading}
              >
                  Apply Template
              </Button>
            ) : (
              <Button
                onClick={() =>
                  onRefreshMeeting()
                }
                loading={refreshLoading}
              >
                  Refresh Agenda
              </Button>
            )}
            <Space horizontal size={20} />
            <Button
              type='primary'
              onClick={() => {
                onUpdateMeeting('planned', MEETING_AGENDA_STATUS.FINALISED)
              }

              }
              loading={loading}
            >
                Finalise Agenda
            </Button>
          </FlexBox>
        )}
        {meetingDetails.status === 'open' && (
          <FlexBox alignItems='center'>
            <Button onClick={handlePreviewMinuteClick} loading={isPreview} style={{ marginRight: 5 }}>
              Preview minutes
            </Button>
            <Button
              type="primary"
              onClick={handleCloseClick}
            >
              Finalise meeting
            </Button>
          </FlexBox>
        )}
        <ConfirmNextDate ref={confirmationModalRef} handleConfirm={handleConfirm} loading={ending} handleCancel={handleCancel} />
        <ConfirmToClose ref={confirmToCloseModalRef} handleConfirm={handleFinaliseMeeting} loading={loading} handleCancel={handleClose} />
        <SharedFormModal ref={nextMeetingDateModalRef} topic={topicWithoutNextDate || initialTopic} />
        <DocumentPreviewModal ref={previewDocumentModalRef} />
        <OpenMeetingWarningModal ref={openMeetingModalRef} />
      </FlexBox>
      <Space size={24} />
      {meetingDetails.status !== 'open' && (
        <>
          <FlexBox className={styles.topBox} flexDirection="column">
            <Typography size="big">
              Manage the Meeting
            </Typography>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Name" errorMessage={formik.errors.name}>
                  <Input
                    name="name"
                    size="large"
                    placeholder="Enter here"
                    onChange={(e) => {
                      handleInputChange("name", e?.target?.value)
                    }}
                    defaultValue={formik.values.name}
                    status={formik.errors.name && "error"}
                    disabled={meetingDetails.status === "closed"}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Link/ Location" errorMessage={formik.errors.location}>
                  <Input
                    name="location"
                    size="large"
                    placeholder="Enter here"
                    onChange={(e) => {
                      handleInputChange("location", e?.target?.value)
                    }}
                    defaultValue={formik.values.location}
                    status={formik.errors.location && "error"}
                    disabled={meetingDetails.status === "closed"}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Date & Time" errorMessage={formik.errors.date}>
                  <DatePicker
                    showTime
                    name="date"
                    size='large'
                    placeholder='__/__/____ __:__'
                    format='DD/MM/YYYY HH:mm'
                    onChange={(value) => {
                      formik.setFieldValue("date", value);
                      onSaveMeeting({ date: value })
                    }}
                    value={formik.values.date && dayjs(formik.values.date)}
                    allowClear={false}
                    disabled={meetingDetails.status === "closed"}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Type" errorMessage={formik.errors.type}>
                  <Select
                    disabled={true}
                    size="large"
                    placeholder="Select"
                    options={MEETING_TYPES}
                    onChange={(value) => {
                      formik.setFieldValue("type", value);
                      onSaveMeeting({ type: value });
                    }}
                    value={formik.values.type}
                    status={formik.errors.type && "error"}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <Typography>Add a via video conference/telephone dial-in</Typography>
                <Space size={16} />
                <Checkbox
                  name="isVirtual"
                  onChange={(value) => {
                    formik.setFieldValue("isVirtual", value?.target?.checked);
                    onSaveMeeting({ isVirtual: value?.target?.checked });
                  }}
                  checked={formik.values.isVirtual}
                  disabled={meetingDetails.status === "closed"}
                >
                  Yes
                </Checkbox>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flex={1}>{''}</FlexBox>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
        </>
      )}
      {meetingDetails.status === 'open' && !isHideUploadTranscript && !isProduction && (
        <>
          <Space size={24} />
          <FlexBox className={styles.topBox} flexDirection="column">
            <FlexBox>
              <Typography size="giant">Upload transcript</Typography>
              <Space horizontal size={5} />
              <Tooltip 
                placement='top' 
                // eslint-disable-next-line max-len
                title={"If you upload a transcript or your meeting here, SEEIO’s robot will generate the meeting minutes and actions automatically.  You will need to switch on meeting recording or alternatively generate a transcript from a sound file.  Transcripting from sound files is for a future release."} color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}
                className={styles.cursor}
              >
                <InfoCircleOutlined className={styles.size} />
              </Tooltip>
            </FlexBox>
            <Space size={24} />
            {isUploadingTranscript ? <Loading size='small' /> : <FilePicker onChange={(files) => {
              if (files?.length > 0) {
                setIsUploadingTranscript(true)
                handleUploadTranscript(files?.[0])
              }
            }} accept={".txt,.pdf,.doc,.docx"} />}
          </FlexBox>
          <Space size={24} />
        </>
      )}
      {children}
    </>
  )
}

export default Layout;
