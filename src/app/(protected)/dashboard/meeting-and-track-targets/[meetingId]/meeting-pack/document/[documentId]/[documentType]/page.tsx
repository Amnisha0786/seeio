"use client"

import React, { useCallback, useContext, useEffect, useState } from 'react'

import Container from '@/components/container'
import ScollablePage from '@/components/scollable-page'
import Space from '@/components/space'
import { useCompanyRole, useSelectedAccountCompany } from '@/hooks'
import DocumentView from './document-view'
import * as API from '@/api'
import Loading from '@/components/loading'
import { TMeetingPackDocument } from '@/models'
import Toast from '@/components/toast'
import BreadCrumbs from '@/components/breadcrumbs'
import { MeetingDetailsContext } from '../../../../context'

type TProps = { params: { documentId: string, meetingId: string, documentType: string } }

const Page = ({ params: { documentId, meetingId, documentType } }: TProps) => {
  const [data, setData] = useState<TMeetingPackDocument>()
  const [initing, setIniting] = useState(true)
  const role = useCompanyRole()
  const companyId = useSelectedAccountCompany()?.companyId;
  const { meetingDetails } = useContext(MeetingDetailsContext)

  const fetchData = useCallback(async () => {
    if (!companyId) return

    setIniting(true)

    try {
      const result = await API.getMeetingPackDocument({
        companyId,
        documentId,
        meetingId,
        documentType
      })
      setData(result)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }, [documentId, companyId, meetingId, documentType])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyId, documentId, meetingId, documentType])

  if (initing) return <Loading size="small" />
  if (!data) return
  if (!meetingDetails) return null

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <DocumentView data={data} role={role} breadCrumbs={<BreadCrumbs
          items={[{
            title: "Board Meetings",
            link: "/dashboard/meeting-and-track-targets"
          }, {
            title: meetingDetails.name,
            // eslint-disable-next-line max-len
            link: `/dashboard/meeting-and-track-targets/${meetingId}/status/${meetingDetails?.status === "closed" ? "ended" : meetingDetails?.status === "open" ? "started" : meetingDetails.status}`
          }, {
            title: "Meeting Pack",
            link: `/dashboard/meeting-and-track-targets/${meetingId}/meeting-pack`
          },{
            title: documentType,
          }]}
          activeItem={documentType}
        />} />
      </Container>
    </ScollablePage>
  )
}

export default Page
