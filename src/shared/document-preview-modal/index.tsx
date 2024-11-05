'use client'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Document, Page as PDFPage } from 'react-pdf'
import { useRouter } from 'next/navigation'

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'
import DownloadFileView from '../download-file-view'
import variables from '@/theme/variables.module.scss'
import { TMeetingDetailsTopicRecord, TMeetingDetailsTopicRegisters } from '@/models'
import styles from "./document-preview.module.scss"
import { openDownloadDialog } from '@/utils/file-reader'
import Icon from '@/components/icon'

const DocumentPreviewModal = forwardRef(
  (
    props,
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [documentDetails, setDocumentDetails] = useState<TMeetingDetailsTopicRegisters | TMeetingDetailsTopicRecord | null>(null)
    const [activeDocument, setActiveDocument] = useState([{ currentPage: 0, numPages: 0 }])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageTotal, setPageTotal] = useState(0)

    const router = useRouter()

    useImperativeHandle(
      ref,
      () => ({
        open: (data: any) => {
          if (data) {
            setDocumentDetails(data)
          }
          setOpen(true)
        },
        close: () => setOpen(false),
      }),
      []
    )

    const handleCancel = () => {
      setOpen(false)
    }

    const onDocumentLoadSuccess = (numPages: number, documentIndex: number) => {
      setActiveDocument((prevDocuments: any) =>
        prevDocuments?.map((doc: any, index: number) =>
          index == documentIndex ? { ...doc, numPages } : doc
        )
      )
    }

    useEffect(() => {
      if (documentDetails?.additionalFiles) {
        const initialDocuments = documentDetails?.additionalFiles?.map(() => ({
          currentPage: 1,
          numPages: 0,
        }))
        setActiveDocument(initialDocuments)
      }
    }, [documentDetails?.additionalFiles])

    const handlePrevPage = (documentIndex: number) => {
      setActiveDocument((prevDocuments: any) =>
        prevDocuments.map((doc: any, index: number) =>
          index === documentIndex
            ? { ...doc, currentPage: doc.currentPage - 1 }
            : doc
        )
      )
    }

    const handleNextPage = (documentIndex: number) => {
      setActiveDocument((prevDocuments: any) =>
        prevDocuments.map((doc: any, index: number) =>
          index === documentIndex
            ? { ...doc, currentPage: doc.currentPage + 1 }
            : doc
        )
      )
    }

    useEffect(() => {
      if (open) {
        setCurrentPage(1)
      }
    }, [open])

    return (
      <Modal open={open} width={900} onCancel={handleCancel}>
        <FlexBox flexDirection='column'>
          <Typography size='giant' color={variables.primaryColor} center>
            Document Preview
          </Typography>
          {documentDetails?.fileUrl && <FlexBox alignItems='center' justifyContent='flex-end'>
            <Button color={variables.primaryColor}
              onClick={() => openDownloadDialog({
                url: documentDetails?.fileUrl,
                filename: "minutes_document"
              })}>
              <FlexBox alignItems='center' justifyContent='center' >
                <Icon name='black-upload-icon' size={24} rotate={180} />
                <Space horizontal size={10} />
                Download
              </FlexBox>
            </Button>
            {documentDetails?.editUrl && (
              <>
                <Space size={16} horizontal />
                <Button color={variables.primaryColor}
                  onClick={() => {
                    if (documentDetails?.editUrl) {
                      router.push(documentDetails?.editUrl)
                    }
                  }}>
                  <FlexBox alignItems='center' justifyContent='center' >
                    <Icon name='black-edit-icon' size={24} rotate={180} />
                    <Space horizontal size={10} />
                    Edit
                  </FlexBox>
                </Button>
              </>
            )}
          </FlexBox>}
          <Space size={20} />
          <div className={styles.maxHeight}>
            {documentDetails?.additionalFiles &&
              documentDetails?.additionalFiles?.map(
                (uploadedDocument: any, index: number) => (
                  <>
                    {uploadedDocument?.fileType === 'application/pdf' ? (
                      <>
                        <Space size={30} />
                        <FlexBox justifyContent='space-around' alignItems='center'>
                          {uploadedDocument.fileType === 'application/pdf' && (
                            <Button
                              onClick={() => handlePrevPage(index)}
                              disabled={activeDocument[index]?.currentPage < 2}
                            >
                              Previous Page
                            </Button>
                          )}
                          {(uploadedDocument.fileType === 'application/pdf' && activeDocument?.[index]?.numPages > 0) ? (
                            <Typography size='large'>
                              {activeDocument?.[index]?.currentPage}/
                              {activeDocument?.[index]?.numPages}
                            </Typography>
                          ) : <Space horizontal size={30} />}
                          {uploadedDocument?.fileType === 'application/pdf' && (
                            <Button
                              onClick={() => handleNextPage(index)}
                              disabled={
                                activeDocument?.[index]?.currentPage ==
                                activeDocument?.[index]?.numPages
                              }
                            >Next Page</Button>
                          )}
                        </FlexBox>

                        <Document
                          key={index}
                          file={uploadedDocument?.fileUrl}
                          onLoadSuccess={({ numPages }) =>
                            onDocumentLoadSuccess(numPages, index)
                          }
                        >
                          <PDFPage
                            pageNumber={activeDocument[index]?.currentPage}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      </>
                    ) : (
                      <DownloadFileView
                        key={index}
                        url={uploadedDocument?.fileUrl}
                      />
                    )}

                  </>
                )
              )}
            {documentDetails?.fileType && (
              <>
                <Space size={30} />
                <FlexBox justifyContent='space-around' alignItems='center'>
                  {documentDetails?.fileType === 'application/pdf' && (
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage < 2}
                    >
                      Previous Page
                    </Button>
                  )}
                  {(documentDetails?.fileType === 'application/pdf' && pageTotal > 0) ? (
                    <Typography size='large'>
                      {currentPage}/{pageTotal}
                    </Typography>
                  ) : <Space horizontal size={30} />}
                  {documentDetails?.fileType === 'application/pdf' && (
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pageTotal}
                    >Next Page</Button>
                  )}
                </FlexBox>
                <Space size={30} />
                {documentDetails.fileType === 'application/pdf' ? (
                  <Document
                    file={documentDetails?.fileUrl}
                    onLoadSuccess={({ numPages }) => {
                      setPageTotal(numPages)
                    }}
                  >
                    <PDFPage
                      pageNumber={currentPage}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                ) : (
                  <DownloadFileView url={documentDetails?.fileUrl || ""} />
                )}{' '}

              </>
            )}
          </div>
          <Space size={30} />
        </FlexBox>
      </Modal>
    )
  }
)

DocumentPreviewModal.displayName = 'DocumentPreviewModal'

export default DocumentPreviewModal
