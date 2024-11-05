"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Document, Page as PDFPage } from 'react-pdf';

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Status from '@/components/status'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Avatars from '@/components/avatars'
import Loading from '@/components/loading'
import Icon from '@/components/icon'
import BreadCrumbs from '@/shared/global-breadcrumbs'
import * as API from '@/api'
import { TDocument } from '@/models'
import { useCompanyRole } from '@/hooks'
import { openDownloadDialog, openUploadDialog } from '@/utils/file-reader'
import styles from './page.module.scss'
import EditDocumentModal from './edit-document-modal'

const SRCS = ["https://picsum.photos/id/237/200/300", "https://picsum.photos/id/238/200/300", "https://picsum.photos/id/239/200/300"]

const Page = ({ params: { documentId } }: { params: { documentId: string } }) => {
  const [data, setData] = useState<TDocument>()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageTotal, setPageTotal] = useState(0)
  const [initing, setIniting] = useState(true)
  const role = useCompanyRole()
  const editDocumentModalRef: any = useRef()

  const fetchData = useCallback(async () => {
    setIniting(true)

    try {
      const result = await API.getDocument(documentId)
      setData(result)
    } finally {
      setIniting(false)
    }
  }, [documentId])

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

  const onUpdateSuccess = (values: any) => {
    if (data) {
      setData({
        ...data,
        name: values.name,
        notes: values.notes,
        review: values.review.format("DD/MM/YYYY")
      })
    }
  }

  if (initing) return <Loading size="small" />
  if (!data) return

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <BreadCrumbs />
          <FlexBox>
            {role === "company" && (
              <>
                <Button
                  icon={<Icon name="black-edit-icon" size={24} />}
                  onClick={() => editDocumentModalRef.current.open(data)}
                />
                <Space size={16} horizontal />
                <EditDocumentModal
                  onSuccess={onUpdateSuccess}
                  ref={editDocumentModalRef}
                />
              </>
            )}
            <Button
              icon={<Icon name="black-upload-icon" size={24} rotate={180} />}
              onClick={() => openDownloadDialog({ url: data.documentUrl, filename: "document" })}
            />
            <Space size={16} horizontal />
            {role === "company" && (
              <>
                <Button
                  icon={<Icon name="black-delete-icon" size={24} />}
                />
                <Space size={16} horizontal />
              </>
            )}
            <Button
              icon={<Icon name="black-upload-icon" size={24} />}
              onClick={onUpload}
            />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox flexDirection="column" className={styles.infoBox}>
          <FlexBox>
            <FlexBox flexDirection="column">
              <FlexBox>
                <Space size={5} horizontal />
                <Typography gray>Last Edited</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data.lastEdited}</Typography>
            </FlexBox>
            <Space size={150} horizontal />
            <FlexBox flexDirection="column">
              <FlexBox>
                <Space size={5} horizontal />
                <Typography gray>Review</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data.review}</Typography>
            </FlexBox>
          </FlexBox>
          <Space size={25} />
          <FlexBox flexDirection="column">
            <FlexBox>
              <Space size={5} horizontal />
              <Typography gray>Notes</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data.notes}</Typography>
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
            <FlexBox>
              <Avatars sources={SRCS} />
              <Space horizontal size={24} />
              <Status color="yellow" title="In progress" />
            </FlexBox>
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
