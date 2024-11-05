"use client"

import { useState, useMemo, useContext } from 'react'
import { Document, Page as PDFPage } from 'react-pdf';

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Breadcrumbs from '@/components/breadcrumbs'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
// import Avatars from '@/components/avatars'
// import Icon from '@/components/icon'
import DownloadFileView from '@/shared/download-file-view';
import { MeetingDetailsContext } from '../../../../context'
// import { openUploadDialog } from '@/utils/file-reader'
import styles from './page.module.scss'

// const SRCS = ["https://picsum.photos/id/237/200/300", "https://picsum.photos/id/238/200/300", "https://picsum.photos/id/239/200/300"]

interface Props { params: { categoryId: string, topicId: string, documentId: string, meetingId: string } }

const Page = ({ params: { categoryId, topicId, documentId, meetingId } }: Props) => {
  const { meetingDetails } = useContext(MeetingDetailsContext)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTotal, setPageTotal] = useState(0)

  const document = useMemo(() => {
    const category = meetingDetails?.agenda?.find(item => item.categoryId === categoryId)
    const topic = category?.topics?.find(item => item.topicId === topicId)

    return topic?.documents?.find(document => document.documentId === documentId)
  }, [categoryId, documentId, meetingDetails?.agenda, topicId])


  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPageTotal(numPages)
  }

  // const onUpload = async () => {
  //   const files = await openUploadDialog("application/pdf")
  //
  //   setUploadFile(files[0])
  // }

  if (!document || !meetingDetails) return

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <Breadcrumbs
            items={[{
              title: "Board Meetings",
              link: "/dashboard/meeting-and-track-targets"
            }, {
              title: meetingDetails.name,
              link: `/dashboard/meeting-and-track-targets/${meetingId}/status/${meetingDetails.status}`
            }, {
              title: document.fileName
            }]}
          />
          {/*<FlexBox>*/}
          {/*  <Button*/}
          {/*    icon={<Icon name="black-upload-icon" size={24} />}*/}
          {/*    onClick={onUpload}*/}
          {/*  />*/}
          {/*</FlexBox>*/}
        </FlexBox>
        <Space size={24} />
        <FlexBox className={styles.previewBox} flexDirection="column">
          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography size="giant">
              {document.fileName}
            </Typography>
            {/*<Avatars sources={SRCS} />*/}
          </FlexBox>
          <Space size={20} />

          <Space size={30} />
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

          {document.fileType === "application/pdf" ? (
            <Document
              file={uploadFile || document.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <PDFPage
                pageNumber={currentPage}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <DownloadFileView url={document.fileUrl} />
          )}
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page
