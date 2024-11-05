"use client"

import { useEffect, useState, useCallback, useContext } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Document, Page as PDFPage } from 'react-pdf';

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Breadcrumbs from '@/components/breadcrumbs'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
// import Avatars from '@/components/avatars'
import Loading from '@/components/loading'
import { useSelectedAccountCompany } from '@/hooks'
import Icon from '@/components/icon'
import * as API from '@/api'
import { MeetingDetailsContext } from '../../../../context'
import { TDocument } from '@/models'
import { openUploadDialog } from '@/utils/file-reader'
import styles from './page.module.scss'

// const SRCS = ["https://picsum.photos/id/237/200/300", "https://picsum.photos/id/238/200/300", "https://picsum.photos/id/239/200/300"]

const Page = ({ params: { documentId, meetingId } }: { params: { documentId: string, meetingId: string } }) => {
  const [data, setData] = useState<TDocument>()
  const { meetingDetails } = useContext(MeetingDetailsContext)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTotal, setPageTotal] = useState(0)
  const [initing, setIniting] = useState(true)
  const companyId = useSelectedAccountCompany()?.companyId

  const fetchData = useCallback(async () => {
    setIniting(true)

    try {
      if (!companyId) return

      const result = await API.getDocument(documentId)
      setData(result)
    } finally {
      setIniting(false)
    }
  }, [companyId, documentId])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [])


  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPageTotal(numPages)
  }

  const onUpload = async () => {
    const files = await openUploadDialog("application/pdf")

    setUploadFile(files[0])
  }

  if (initing) return <Loading size="small" />
  if (!data) return

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <Breadcrumbs
            items={[{
              title: "Meetings",
              link: "/dashboard/meeting-and-track-targets"
            }, {
              title: meetingDetails?.date || '',
              link: `/dashboard/meeting-and-track-targets/${meetingId}`
            }, {
              title: data.name
            }]}
          />
          <FlexBox>
            <Button
              icon={<Icon name="black-upload-icon" size={24} />}
              onClick={onUpload}
            />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.previewBox} flexDirection="column">
          <FlexBox justifyContent="space-between" alignItems="center">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage < 2}
            >
            Previous Page
            </Button>
            {pageTotal > 0 && (
              <Typography size="large">{currentPage}/{pageTotal}</Typography>
            )}
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageTotal}
            >Next Page</Button>
          </FlexBox>
          <Space size={30} />

          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography size="giant">
              {data.name}
            </Typography>
            {/*<Avatars sources={SRCS} />*/}
          </FlexBox>
          <Space size={20} />
          <Document
            file={uploadFile || data.documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <PDFPage
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page
