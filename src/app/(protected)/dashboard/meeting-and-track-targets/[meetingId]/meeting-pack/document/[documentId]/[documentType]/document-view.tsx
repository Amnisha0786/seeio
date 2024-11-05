"use client"

import React, { useState } from 'react'
import { Document, Page as PDFPage } from 'react-pdf';

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import styles from "./document-view.module.scss"
import Icon from '@/components/icon';
import { openDownloadDialog, openUploadDialog } from '@/utils/file-reader';
import { TDataRoomDocument } from '@/models';
import GlobalBreadcrumbs from '@/shared/global-breadcrumbs';

interface IProps {
  role?: string
  data: TDataRoomDocument
  breadCrumbs?: React.ReactNode
}

const DocumentView = ({
  role,
  data,
  breadCrumbs
}: IProps) => {

  const [pageTotal, setPageTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setPageTotal(numPages)
  }

  const onUpload = async () => {
    const files = await openUploadDialog("application/pdf")
    setUploadFile(files[0])
  }

  return (
    <>
      <FlexBox justifyContent="space-between">
        {breadCrumbs ? breadCrumbs : <GlobalBreadcrumbs />}
        <FlexBox>
          <Button
            icon={<Icon name="black-upload-icon" size={24} rotate={180} />}
            onClick={() => openDownloadDialog({ url: data.fileUrl, filename: "document" })}
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
          <FlexBox alignItems='center'>
            <FlexBox>
              <Space size={5} horizontal />
              <Typography gray>Name</Typography>
            </FlexBox>
            <Space horizontal size={10} />
            <Typography size="large">{data?.documentType || ""}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox alignItems='center'>
          <FlexBox>
            <Space size={5} horizontal />
            <Typography gray>Description</Typography>
          </FlexBox>
          <Space horizontal size={10} />
          <Typography size="large">{data.description}</Typography>
        </FlexBox>
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
            {data?.documentType || ""}
          </Typography>
        </FlexBox>
        <Space size={20} />
        <Document
          file={uploadFile || data.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <PDFPage
            pageNumber={currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </FlexBox>

    </>
  )
}

export default DocumentView
