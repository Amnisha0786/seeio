"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import lodash from 'lodash'

import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Loading from '@/components/loading'
import Toast from '@/components/toast'
import { useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import { TMeetingDetails, TMeetingDetailsTopic } from '@/models'
import { MeetingDetailsContext } from './context'
import ResetMeetingModal from './reset-meeting-modal'
import styles from './layout.module.scss'

const Layout = ({ params: { meetingId }, children }: { params: { meetingId: string }, children: React.ReactNode }) => {
  const [meetingDetails, setMeetingDetails] = useState<TMeetingDetails | null>(null)
  const [initing, setIniting] = useState(true)
  const [deleting, setDeleting] = useState(false);
  const companyId = useSelectedAccountCompany()?.companyId
  const resetMeetingModalRef = useRef<any>()

  const loadMeetingDetails = useCallback(async (showLoading?: boolean) => {
    if (showLoading) setIniting(true)

    try {
      if (!companyId) return

      const result = await API.getMeetingDetails({
        companyId,
        meetingId
      })
      if (!lodash.isEmpty(result)) {
        setMeetingDetails({
          ...result,
          agenda: result.agenda.map((category) => ({
            ...category,
            timeAlloted: lodash.sumBy(category.topics, (topic) => topic.timeAlloted || 0),
            topics: category.topicOrderIds.reduce((array: TMeetingDetailsTopic[], value: string) => {
              const findedTopic = category.topics.find(topic => topic.topicId === value)

              if (findedTopic) {
                array.push(findedTopic)
              }

              return array
            }, [])
          }))
        })
      }
    } finally {
      if (showLoading) setIniting(false)
    }
  }, [companyId, meetingId])

  const updateTopic = useCallback(async (topic: TMeetingDetailsTopic, values: any) => {
    try {
      if (!companyId || !meetingDetails?.id) return
      let documentsFileNames: string[] = []
      if (values.documents?.length > 0) {
        documentsFileNames = values.documents.map((item: File) => item.name)
      }

      const result = await API.updateTopic({
        companyId,
        meetingId: meetingDetails.id,
        categoryId: topic.categoryId,
        topicId: topic.topicId,
        topicType: topic.topicType,
        updateAttributes: {
          ...values,
          documents: documentsFileNames
        },
      })

      if (result.documents?.length > 0) {
        await API.uploadFiles({
          files: result.documents.map((item, index) => ({
            presignUrl: item.uploadUrl,
            file: values.documents[index]
          }))
        })
      }
      await loadMeetingDetails()
      Toast.success("Update topic successfully")
    } catch (e) {
    }
  }, [companyId, loadMeetingDetails, meetingDetails?.id])

  const deleteTopic = useCallback(async (topic: TMeetingDetailsTopic, callback?: () => void) => {
    try {
      if (!companyId || !meetingDetails?.id) return

      setDeleting(true)

      await API.deleteTopic({
        companyId,
        meetingId: meetingDetails.id,
        categoryId: topic.categoryId,
        topicId: topic.topicId,
      })

      if (callback) {
        callback()
      }

      await loadMeetingDetails()

      Toast.success("Delete topic successfully")
    } catch (e) {
    } finally {
      setDeleting(false)
    }
  }, [companyId, loadMeetingDetails, meetingDetails?.id])

  useEffect(() => {
    loadMeetingDetails(true)

    // eslint-disable-next-line
  }, [companyId, meetingId])


  if (initing) return <Loading size="small" />
  if (!meetingDetails) return null

  return (
    <ScollablePage className={styles.layout}>
      <Space size={32} />
      <Container>
        <MeetingDetailsContext.Provider
          value={{
            meetingDetails,
            loadMeetingDetails,
            setMeetingDetails,
            updateTopic,
            deleteTopic,
            deleting
          }}
        >
          {children}
        </MeetingDetailsContext.Provider>
      </Container>
      <ResetMeetingModal
        ref={resetMeetingModalRef}
      />
      <Space size={50} />
    </ScollablePage>
  )
}

export default Layout
