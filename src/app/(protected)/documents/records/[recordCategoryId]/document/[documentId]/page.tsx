"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "antd";
import { useSelector } from "react-redux"
import Image from "next/image";

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import {
  useAccessLevel,
  useBreadcrumbs,
  useCompanyRole,
  useSelectedAccountCompany,
} from "@/hooks";
import * as API from "@/api";
import Loading from "@/components/loading";
import { COMPANY_USER_ACCESS_LEVEL, TRecordDocument, TVdrs, VDR_RECORD_TYPE } from "@/models";
import Toast from "@/components/toast";
import FlexBox from "@/components/flex-box";
import GlobalBreadcrumbs from "@/shared/global-breadcrumbs";
import Button from "@/components/button";
import Icon from "@/components/icon";
import EditDocumentModal from "./edit-document-modal";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import { openDownloadDialog, openUploadDialog } from "@/utils/file-reader";
import ConfirmDelete from "@/shared/confirm-delete";
import TransactionBiblesViewCard from "../../../record-view-cards/transaction-bibles-view-card";
import SharedDocumentsViewCard from "../../../record-view-cards/shared-document-view-card";
import OtherDocumentViewCard from "../../../record-view-cards/other-documents-view-card";
import RegulationComplianceViewCard from "../../../record-view-cards/regulation-compliance-view-card";
import { DOCUMENT_TYPE } from '../../records-validation-schemas';
import Clickable from "@/components/clickable";
import DocumentPreviewModal from "@/shared/document-preview-modal";
import TourComponent from "@/components/TourComponent";
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import StartTour from "@/shared/start-tour";
import { DATA_ROOM_STEPS } from "@/constants";

const Page = ({
  params: { documentId, recordCategoryId },
}: {
  params: { documentId: string; recordCategoryId: string };
}) => {
  const [data, setData] = useState<TRecordDocument | undefined>();
  const [initing, setIniting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [selectedVdr, setSelectedVdr] = useState<TVdrs[]>([])
  const companyId = useSelectedAccountCompany()?.companyId;
  const [tourStart, setTourStart] = useState<boolean>(false);

  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();

  const openStartTourModalRef = useRef<any>();
  const editDocumentModalRef: any = useRef();
  const openDocumentPreviewModal: any = useRef()
  const deleteModelRef: any = useRef();
  const deleteFileModalRef: any = useRef()

  const fetchDataRoom = useCallback(async (data?: TRecordDocument | undefined) => {
    setIniting(true);
    try {
      if (companyId) {
        const result = await API.getVdrFolder({ companyId });
        if (result && data) {
          const options = result?.map((item) => ({
            value: item?.id,
            label: item?.name,
          }));
          fetchVdr({
            categoryId: data?.recordCategoryId || '',
            documentId: data?.id,
            recordType: VDR_RECORD_TYPE?.RECORD,
            options: options
          })
        }
      }
    } catch (err: any) {
      setIniting(false);
      Toast.error(err?.message || "Something went wrong.")
    }
  }, [companyId, data]);

  const fetchVdr = useCallback(async ({
    categoryId,
    documentId,
    recordType,
    options,
  }: {
    categoryId?: string;
    documentId?: string;
    recordType?: string;
    options?: TVdrs[]
  }) => {
    try {
      if (!companyId) {
        return;
      }
      setIniting(true);

      const response = await API.getSelectedVdr({
        companyId,
        payload: {
          [recordType === VDR_RECORD_TYPE?.RECORD ? "record" : "register"]: {
            categoryId,
            documentId,
          },
          recordType,
        },
      });
      const array: string[] = []
      if (response?.length > 0) {
        response?.forEach((item) => {
          array?.push(item)
        });
        if (array?.length > 0 && options?.length) {
          setSelectedVdr(options?.filter((element) => array.includes(element.value || '')));
        }
      } else {
        setSelectedVdr([]);
      }
      setIniting(false);
    } catch (error) {
      Toast.error("Something went wrong");
      setIniting(false);
    }
  }, [selectedVdr, companyId]);

  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'record_document_page',
      page_url: typeof window !== 'undefined' ? window.location.href : "",
      user_id: userAccess?.userId && userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const onUpload = async () => {
    const files = await openUploadDialog("application/pdf");
    const reader = new FileReader();
    if (files?.length > 0) {
      setUploading(true)
      reader.readAsArrayBuffer(files?.[0]);
      reader.onload = async () => {
        uploadDocument({ additionalFileNames: [files?.[0]?.name] }, [reader.result])
      };
    }
  };
  const role = useCompanyRole();

  const userAccess = useAccessLevel()
  const config = useSelector((state: any) => state.config)

  const uploadDocument = useCallback(async (payload: API.TRecordDocumentUpload, fileBinary: any) => {

    if (!companyId || !recordCategoryId || !documentId) {
      return;
    }

    try {
      await API.uploadAdditionalDocuments(
        companyId,
        recordCategoryId,
        documentId,
        payload,
        fileBinary
      )
      fetchData()
      Toast.success("Document uploaded successfully.");
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.");
    } finally {
      setUploading(false)
    }
  }, [companyId, documentId, recordCategoryId])

  const deleteAdditionalDocuments = useCallback(async () => {

    if (!companyId || !recordCategoryId || !documentId || selectedDocumentIds?.length === 0) {
      return;
    }
    try {
      setDeleting(true)
      await API.deleteRecordDocuments(
        companyId,
        recordCategoryId,
        documentId,
        { additionalFileIds: selectedDocumentIds }
      )
      fetchData()
      Toast.success("Document(s) deleted successfully.");
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.");
    } finally {
      setDeleting(false)
      setSelectedDocumentIds([])
    }
  }, [companyId, documentId, recordCategoryId, selectedDocumentIds])

  const fetchData = useCallback(async () => {
    setIniting(true);
    if (!companyId) {
      return;
    }
    try {
      const result = await API.getRecordDocument({
        companyId: companyId,
        documentId,
        recordCategoryId,
      });
      setData(result);
      fetchDataRoom(result)
    } catch (err: any) {
      setIniting(false);
      Toast.error(err.message || "Something went wrong.");
    }
  }, [documentId, companyId]);

  const deleteDocument = async () => {
    try {
      setDeleting(true);
      await API.deleteRecordDocument(recordCategoryId, documentId, companyId);
      breadcrumbs.pop();
      router.push(`/documents/records/${recordCategoryId}`);
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDocumentUpdate = useCallback(
    async (data: any, callback: () => void) => {
      setLoading(true);
      try {
        if (data?.additionalFiles) {
          delete data?.additionalFiles
        }
        await API.updateRecordDocument(
          {
            name: data.name,
            description: data.description,
            fileName: data?.fileName || "",
            fileBinary: data?.fileBinary || "",
            ...data?.metadata,
          },
          documentId,
          recordCategoryId,
          companyId
        );
        Toast.success("Document updated successfully.");
        fetchData();
      } catch (err: any) {
        Toast.error(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
        callback();
      }
    },
    [companyId]
  );

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, [documentId, companyId]);

  if (initing) return <Loading size="small" />;
  if (!data) return;

  const getCardComponent = (docType: string, vdrList?: TVdrs[]) => {
    if (docType === DOCUMENT_TYPE.DEAL_BIBLES_DOCUMENT) {
      return <TransactionBiblesViewCard data={data} vdrList={vdrList} />;
    } else if (
      docType === DOCUMENT_TYPE.REGULATION_COMPLIANCE ||
      docType === DOCUMENT_TYPE.FINANCE_DOCUMENT
    ) {
      return <RegulationComplianceViewCard data={data} vdrList={vdrList} />;
    } else if (
      docType === DOCUMENT_TYPE.REAL_ESTATE_DOCUMENT ||
      docType === DOCUMENT_TYPE.HR_PERSONNEL_DOCUMENT ||
      docType === DOCUMENT_TYPE.PRODUCTS_DOCUMENT ||
      docType === DOCUMENT_TYPE.BUSINESS_PLANNING
    ) {
      return <SharedDocumentsViewCard data={data} vdrList={vdrList} />;
    } else {
      return <OtherDocumentViewCard data={data} vdrList={vdrList} />;
    }
  };

  const onSelectDocument = (e: any, additionalUploadId: string) => {
    if (e.target.checked) {
      setSelectedDocumentIds((prevDocuments) => [
        ...prevDocuments,
        additionalUploadId,
      ]);
    } else {
      setSelectedDocumentIds((prevDocuments) =>
        prevDocuments.filter((id) => id !== additionalUploadId)
      );
    }
  };

  const handleConfirm = () => {
    setTourStart(true)
    openStartTourModalRef?.current?.close();
  };

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <div id="view_document">
          <FlexBox justifyContent="space-between">
            <GlobalBreadcrumbs />
            {(
              userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
              userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && (
              <FlexBox>
                {role === "company" && <> <Button
                  icon={<Image
                    src="/icons/help-icon.svg"
                    alt="App Logo"
                    width={24}
                    height={24}
                  />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openStartTourModalRef?.current?.open();
                  }}
                />
                <Space size={16} horizontal /></>}
                {role === "company" && (
                  <>
                    <Button
                      icon={<Icon name="black-edit-icon" size={24} />}
                      onClick={() => editDocumentModalRef.current.open(data)}
                      id="edit-document"
                    />
                    <Space size={16} horizontal />
                    <EditDocumentModal
                      handleDocumentUpdate={handleDocumentUpdate}
                      loading={loading}
                      ref={editDocumentModalRef}
                      record={data}
                    />
                  </>
                )}
                <Button
                  icon={<Icon name="black-upload-icon" size={24} rotate={180} />}
                  onClick={() => {
                    if (data?.additionalFiles?.length) {
                      data?.additionalFiles?.forEach(
                        (uploadedDocument: any, index: number) => {
                          setTimeout(() => {
                            openDownloadDialog({
                              url: uploadedDocument.fileUrl,
                              filename: `document_${index + 1}`,
                            })
                          }, index * 1000)
                        }
                      )

                      if (data?.fileUrl) {
                        setTimeout(() => {
                          openDownloadDialog({
                            url: data?.fileUrl,
                            filename: 'document',
                          })
                        }, data?.additionalFiles?.length * 1000)
                      }
                    } else {
                      openDownloadDialog({
                        url: data.fileUrl,
                        filename: 'document',
                      })
                    }
                  }}
                />
                <Space size={16} horizontal />
                <Button
                  icon={<Icon name="black-upload-icon" size={24} />}
                  onClick={onUpload}
                  loading={uploading}
                  id="upload-document"
                />
                <Space size={16} horizontal />
                <Button
                  icon={<Icon name="black-delete-icon" size={24} />}
                  onClick={() => deleteModelRef?.current?.open()}
                  id="delete-document"
                />
              </FlexBox>
            )}
          </FlexBox>
          <Space size={24} />
          {getCardComponent(data?.docType, selectedVdr)}
          <Space size={24} />
          <FlexBox className={styles.previewBox} flexDirection="column">
            <FlexBox justifyContent="space-between" alignItems="center">
              <Typography size="giant">{data.name}</Typography>
              {data?.additionalFiles &&
                data?.additionalFiles?.length > 0 &&
                (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) &&
                <Clickable onClick={() => {
                  if (selectedDocumentIds?.length === 0) {
                    Toast.warning("Please select documents.")
                  } else {
                    deleteFileModalRef.current.open()
                  }
                }}>
                  <Icon name="delete-icon" size={24} />
                </Clickable>
              }
            </FlexBox>
            <Space size={20} />
            {data?.additionalFiles &&
              data?.additionalFiles?.map(
                (uploadedDocument: any, index: number) =>
                  uploadedDocument.fileUrl && uploadedDocument.fileUrl !== "error" &&
                  <>
                    <Space size={20} />
                    <FlexBox flex={1.5} zeroMinWidth>
                      <FlexBox alignItems='center' flex={1} zeroMinWidth>
                        {(userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && <Checkbox
                          checked={
                            selectedDocumentIds.includes(uploadedDocument?.id)
                          }
                          onChange={(e) => onSelectDocument(e, uploadedDocument?.id)}
                          onClick={(e) => e.stopPropagation()}
                        />}
                        <Space size={16} horizontal />



                        <Clickable
                          key={index}
                          onClick={() =>
                            openDocumentPreviewModal.current.open(uploadedDocument)
                          }
                        >
                          <FlexBox alignItems='center'>
                            <Icon name='green-pdf-icon' size={34} />
                            <Space horizontal size={5} />
                            <Typography gray size='large'>
                              {uploadedDocument?.fileName || "View Document"}
                            </Typography>
                          </FlexBox>
                        </Clickable>
                      </FlexBox>
                    </FlexBox>
                  </>

              )}

          </FlexBox>

          <Space size={100} />
          <TourComponent start={!initing && config.config} />
        </div>
      </Container>
      <DocumentPreviewModal ref={openDocumentPreviewModal} />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteDocument}
        loading={deleting}
        message={"Are you sure you want to delete the document?"}
      />
      <ConfirmDelete
        ref={deleteFileModalRef}
        handleConfirm={deleteAdditionalDocuments}
        loading={deleting}
        message={"Are you sure you want to delete the document(s)?"}
      />
      <StartTour
        setTourStart={setTourStart}
        ref={openStartTourModalRef}
        handleConfirm={handleConfirm}
        title="Follow the guide to Data Rooms"
        message="This is the section of the platform that helps with operational alignment and includes Vision, Mission, objectives and risks."
      />
      <TourComponent
        start={tourStart}
        onGoingStep={DATA_ROOM_STEPS.VIEW_DOCUMENT}
      />
    </ScollablePage>
  );
};

export default Page;
