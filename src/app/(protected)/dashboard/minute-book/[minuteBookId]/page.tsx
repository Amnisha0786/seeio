"use client"

import { useState, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Document, Page as PDFPage } from 'react-pdf';
import { useSearchParams } from 'next/navigation'

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Breadcrumbs from '@/components/breadcrumbs'
import Button from '@/components/button'
import Icon from '@/components/icon'
import FlexBox from '@/components/flex-box'
import Toast from '@/components/toast'
import DownloadFileView from '@/shared/download-file-view';
import { openDownloadDialog, openUploadDialog } from '@/utils/file-reader'
import * as API from "@/api";
import { COMPANY_USER_ACCESS_LEVEL, TMinuteBookDetails } from '@/models'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import styles from './page.module.scss'
import BreadCrumbs from "@/shared/global-breadcrumbs";

interface Props { params: { minuteBookId: string } }

const Page = ({ params: { minuteBookId } }: Props) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [initing, setIniting] = useState(true)
  const [pageTotal, setPageTotal] = useState(0)
  const [minuteBookDetails, setMinuteBookDetails] = useState<TMinuteBookDetails | null>(null)
  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()
  const globalBreadcrumbs = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return

      setIniting(true)
      try {
        const result = await API.getMinuteBookDetails({
          minuteBookId,
          companyId
        })

        if (result.message) {
          Toast.error(result.message)
        } else {
          setMinuteBookDetails(result)
        }
      } finally {
        setIniting(false)
      }
    }

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

  if (!minuteBookDetails || initing) return

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          {globalBreadcrumbs?.get("breadcrumbs") ?
            <Breadcrumbs
              items={[{
                title: "Minute Book",
                link: "/dashboard/minute-book"
              }, {
                title: minuteBookDetails?.meeting?.name
              }]}
            />
            :
            <BreadCrumbs />
          }
          {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <FlexBox>
            <Button onClick={onUpload} icon={<Icon name="black-upload-icon" size={24} />} />
            <Space horizontal size={10} />
            <Button
              icon={<Icon name='black-upload-icon' size={24} rotate={180} />}
              onClick={() => {
                if (minuteBookDetails?.fileUrl) {
                  openDownloadDialog({
                    url: minuteBookDetails?.fileUrl,
                    filename: "minutes_document"
                  })
                }
              }} />
          </FlexBox>}
        </FlexBox>
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
        <Space size={24} />
        <FlexBox className={styles.previewBox} flexDirection="column">
          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography size="giant">
              {uploadFile ? uploadFile.name : minuteBookDetails?.meeting?.name}
            </Typography>
          </FlexBox>
          <Space size={20} />
          {minuteBookDetails.fileType === "application/pdf" || (uploadFile && uploadFile.type === "application/pdf") ? (
            <Document
              file={uploadFile || minuteBookDetails.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <PDFPage
                pageNumber={currentPage}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <DownloadFileView url={minuteBookDetails.fileUrl} />
          )}
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page
