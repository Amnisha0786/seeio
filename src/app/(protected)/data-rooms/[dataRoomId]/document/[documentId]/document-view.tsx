"use client"

import React, { useRef, useState } from 'react'
import { Document, Page as PDFPage } from 'react-pdf';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import styles from "./document-view.module.scss"
import Icon from '@/components/icon';
import { openDownloadDialog, openUploadDialog } from '@/utils/file-reader';
import EditDocumentModal from './edit-document-modal';
import { TDataRoomDocument } from '@/models';
import GlobalBreadcrumbs from '@/shared/global-breadcrumbs';
import DownloadFileView from '@/shared/download-file-view';

interface IProps {
  role?: string
  data: TDataRoomDocument
  loading: boolean
  handleDocumentUpdate: (data: any, callback: () => void) => void
}

const DocumentView = ({
  role,
  data,
  handleDocumentUpdate,
  loading
}: IProps) => {

  const [pageTotal, setPageTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const editDocumentModalRef: any = useRef()

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
        <GlobalBreadcrumbs />
        <FlexBox>
          {role === "company" && (
            <>
              <Button
                icon={<Icon name="black-edit-icon" size={24} />}
                onClick={() => editDocumentModalRef.current.open(data)}
              />
              <Space size={16} horizontal />
              <EditDocumentModal
                handleDocumentUpdate={handleDocumentUpdate}
                loading={loading}
                ref={editDocumentModalRef}
              />
            </>
          )}
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
          <FlexBox flexDirection="column">
            <FlexBox>
              <Space size={5} horizontal />
              <Typography gray>Name</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data.name}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox flexDirection="column">
          <FlexBox>
            <Space size={5} horizontal />
            <Typography gray>Description</Typography>
          </FlexBox>
          <Space size={5} />
          <Typography size="large">{data.description}</Typography>
        </FlexBox>
      </FlexBox>
      <Space size={24} />
      <FlexBox className={styles.previewBox} flexDirection="column">
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="giant">
            {data.name}
          </Typography>
        </FlexBox>
        <Space size={20} />
        {data.fileType === "application/pdf" ? (
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
        ) : (
          <DownloadFileView url={data.fileUrl} />
        )}
      </FlexBox>
      <Space size={30} />
      <FlexBox justifyContent="space-between" alignItems="center">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage < 2}
          icon={(
            <>
              <Space size={3} />
              <LeftOutlined />
            </>
          )}
        />
        {pageTotal > 0 && (
          <Typography size="large">{currentPage}/{pageTotal}</Typography>
        )}
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageTotal}
          icon={(
            <>
              <Space size={3} />
              <RightOutlined />
            </>
          )}
        />
      </FlexBox>
    </>
  )
}

export default DocumentView
