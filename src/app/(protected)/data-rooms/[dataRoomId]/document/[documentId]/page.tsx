"use client"

import React, { useCallback, useEffect, useState } from 'react'

import Container from '@/components/container'
import ScollablePage from '@/components/scollable-page'
import Space from '@/components/space'
import { useCompanyRole, useSelectedAccountCompany } from '@/hooks'
import DocumentView from './document-view'
import * as API from '@/api'
import Loading from '@/components/loading'
import { TDataRoomDocument } from '@/models'
import Toast from '@/components/toast'

const Page = ({ params: { documentId, dataRoomId } }: { params: { documentId: string, dataRoomId: string } }) => {
  const [data, setData] = useState<TDataRoomDocument>()
  const [initing, setIniting] = useState(true)
  const [loading, setLoading] = useState(false)
  const role = useCompanyRole()
  const companyId = useSelectedAccountCompany()?.companyId;

  const fetchData = useCallback(async () => {
    setIniting(true)
    if (!companyId) return
    try {
      const result = await API.getDataRoomDocument({ companyId, dataroomId: dataRoomId, documentId: documentId})
      setData(result)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }, [documentId, dataRoomId, companyId])

  const handleDocumentUpdate = useCallback(async (data: TDataRoomDocument, callback: () => void) => {
    setLoading(true)

    try {
      await API.updateDataRoomDocument(data)
      Toast.success("Document updated successfully.")
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
      callback()
    }
  }, [])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyId, documentId, dataRoomId])

  if (initing) return <Loading size="small" />
  if (!data) return

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <DocumentView data={data} role={role} loading={loading} handleDocumentUpdate={handleDocumentUpdate} />
      </Container>
      <Space size={100} />
    </ScollablePage>
  )
}

export default Page