"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Checkbox } from "antd";
import { useSelector } from "react-redux"
import Image from "next/image";

import {
  useAccessLevel,
  useBreadcrumbs,
  useCompanyRole,
  useSelectedAccountCompany,
} from "@/hooks";
import * as API from "@/api";
import { openDownloadDialog, openUploadDialog } from "@/utils/file-reader";
import { Update } from "@/models/registers/register";
import GlobalBreadcrumbs from "@/shared/global-breadcrumbs";
import ConfirmDelete from "@/shared/confirm-delete";
import Loading from "@/components/loading";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Container from "@/components/container";
import Toast from "@/components/toast";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Icon from "@/components/icon";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import EditDocumentModal from "./edit-document-modal";
import ApprovedSupliersCard from "../../../register-view-cards/approved-supliers-card";
import IncidentRegisterCard from "../../../register-view-cards/incidents-register-card";
import PoliciesProcedureCard from "../../../register-view-cards/policies-procedures-card";
import ContractRegisterCard from "../../../register-view-cards/contract-register-card";
import ResolutionRegisterCard from "../../../register-view-cards/resolution-register-card";
import InsurancesRegisterCard from "../../../register-view-cards/insurances-register-card";
import ComplaintsRegisterCard from "../../../register-view-cards/complaint-register-card";
import GoverningDocumentViewCard from "../../../register-view-cards/governing-document-view-card";
import { DOCUMENT_TYPE } from "../../../registers-validation-schemas";
import Clickable from "@/components/clickable";
import DocumentPreviewModal from "@/shared/document-preview-modal";
import TourComponent from "@/components/TourComponent";
import { COMPANY_USER_ACCESS_LEVEL, TVdrs, VDR_RECORD_TYPE } from "@/models";
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import { DATA_ROOM_STEPS } from "@/constants";
import StartTour from "@/shared/start-tour";

const Page = ({
  params: { documentId, registerCategoryId },
}: {
  params: { documentId: string; registerCategoryId: string };
}) => {
  const [data, setData] = useState<any | undefined>();
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [initing, setIniting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [tourStart, setTourStart] = useState<boolean>(false);

  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();
  const userAccess = useAccessLevel()
  const config = useSelector((state: any) => state.config)

  const openStartTourModalRef = useRef<any>();
  const editDocumentModalRef: any = useRef();
  const openDocumentPreviewModal: any = useRef()
  const deleteModelRef: any = useRef();
  const deleteFileModalRef: any = useRef()
  const [selectedVdr, setSelectedVdr] = useState<TVdrs[]>([])
  const companyId = useSelectedAccountCompany()?.companyId;
  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'record_ocument_page',
      page_url: typeof window !== 'undefined' ? window.location.href : "",
      user_id: userAccess?.userId && userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const fetchDataRoom = useCallback(async (data?: any | undefined) => {
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
            categoryId: data?.registerCategoryId || '',
            documentId: data?.id,
            recordType: VDR_RECORD_TYPE?.REGISTER,
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
  }, [companyId]);

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

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      const result = await API.viewRegisterDocument(
        registerCategoryId,
        documentId,
        companyId
      );

      setData(result);
      fetchDataRoom(result)
    } catch (err: any) {
      setIniting(false);
      Toast.error(err.message || "Something went wrong.");
    }
  }, [documentId, companyId, registerCategoryId]);

  const uploadDocument = useCallback(async (payload: API.TRecordDocumentUpload, fileBinary: any) => {

    if (!companyId || !registerCategoryId || !documentId) {
      return;
    }

    try {
      await API.uploadAdditionalDocument(
        companyId,
        registerCategoryId,
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
  }, [companyId, documentId, registerCategoryId])

  const deleteAdditionalDocuments = useCallback(async () => {

    if (!companyId || !registerCategoryId || !documentId || selectedDocumentIds?.length === 0) {
      return;
    }
    try {
      setDeleting(true)
      await API.deleteRegisterDocuments(
        companyId,
        registerCategoryId,
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
  }, [companyId, documentId, registerCategoryId, selectedDocumentIds])


  const deleteDocument = async () => {
    try {
      setDeleting(true);
      await API.deleteRegisterDocument(
        registerCategoryId,
        documentId,
        companyId
      );
      breadcrumbs.pop();
      router.push(`/documents/registers/${registerCategoryId}`);
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
        if (data?.docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT || data?.docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT) {
          const oldUpdates = data?.metadata?.updates
            ?.filter((update: Update) => !!update?.id)
            ?.map((update: Update) => ({
              id: update.id,
              notes: update.notes,
              dateOfAcknowledgement: update?.dateOfAcknowledgement,
            }));

          const newUpdates = data?.metadata?.updates?.filter(
            (update: Update) => !update?.id
          );

          data.metadata.updates = oldUpdates;
          data.metadata.newUpdates = newUpdates;
        }

        if (data?.additionalFiles) {
          delete data?.additionalFiles
        }

        await API.updateRegisterDocument(
          {
            name: data.name,
            description: data.description,
            fileName: data?.fileName || "",
            fileBinary: data?.fileBinary || "",
            ...data?.metadata,
          },
          registerCategoryId,
          documentId,
          companyId
        );
        Toast.success("Document updated successfully.");

        setTimeout(() => {
          fetchData();
        }, 1000)
      } catch (err: any) {
        Toast.error(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
        callback();
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [documentId, registerCategoryId, companyId]);

  if (initing) return <Loading size="small" />;
  if (!data) return;

  const getCardComponent = (docType: string, vdrList?: TVdrs[]) => {
    if (docType === DOCUMENT_TYPE.SUPPLIER_DOCUMENT) {
      return <ApprovedSupliersCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT) {
      return <IncidentRegisterCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.INSURANCE_DOCUMENT) {
      return <InsurancesRegisterCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT) {
      return <ComplaintsRegisterCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.POLICIES_DOCUMENT) {
      return <PoliciesProcedureCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.CONTRACT_DOCUMENT) {
      return <ContractRegisterCard data={data} vdrList={vdrList} />;
    } else if (docType === DOCUMENT_TYPE.GOVERNING_DOCUMENT) {
      return <GoverningDocumentViewCard data={data} vdrList={vdrList} />;
    } else {
      return <ResolutionRegisterCard data={data} vdrList={vdrList} />;
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
    setTourStart((prev) => !prev)
    openStartTourModalRef?.current?.close();
  };

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <div id="view_document">
          <FlexBox justifyContent='space-between'>
            <GlobalBreadcrumbs />
            {(
              userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && (
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER ||
                (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.USER && (
                  data?.docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT || data?.docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT
                ))
              )) && <FlexBox>
              {role === "company" &&  (
                <> 
                  <Button
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
                  <Space size={16} horizontal />
                </>
              )}
              {role === 'company' && (
                <>
                  <Button
                    icon={<Icon name='black-edit-icon' size={24} />}
                    onClick={() => editDocumentModalRef.current.open(data)}
                  />
                  <Space size={16} horizontal />
                  <EditDocumentModal
                    docType={data?.docType}
                    handleDocumentUpdate={handleDocumentUpdate}
                    loading={loading}
                    registerCategoryId={registerCategoryId}
                    ref={editDocumentModalRef}
                  />
                </>
              )}
              <Button
                icon={<Icon name='black-upload-icon' size={24} rotate={180} />}
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
              />
              <Space size={16} horizontal />
              <Button
                icon={<Icon name='black-delete-icon' size={24} />}
                onClick={() => deleteModelRef?.current?.open()}
              />
            </FlexBox>}
          </FlexBox>
          <Space size={24} />
          {getCardComponent(data?.docType, selectedVdr)}

          {data?.complaintUpdates && data?.complaintUpdates?.length > 0 ? (
            <>
              {data?.complaintUpdates?.map((update: Update, index: number) => {
                return (
                  <>
                    <Space size={24} />
                    <FlexBox className={styles.infoBox} flexDirection='column'>
                      <FlexBox justifyContent='space-between' alignItems='center'>
                        <FlexBox>
                          <Typography size='giant'>Update {index + 1}</Typography>
                        </FlexBox>
                      </FlexBox>

                      <Space size={25} />

                      <FlexBox
                        justifyContent='space-between'
                        className={styles.content}
                      >
                        <FlexBox
                          flexDirection='column'
                          className={styles.content}
                        >
                          <FlexBox>
                            <Typography gray>Date of Acknowledgement</Typography>
                          </FlexBox>
                          <Space size={5} />
                          <Typography size='large'>
                            {moment(update?.dateOfAcknowledgement).format(
                              'DD/MM/YYYY'
                            )}
                          </Typography>
                        </FlexBox>
                      </FlexBox>
                      <Space size={25} />

                      <FlexBox justifyContent='space-between'>
                        <FlexBox flexDirection='column'>
                          <FlexBox>
                            <Typography gray>Notes</Typography>
                          </FlexBox>
                          <Space size={5} />
                          <Typography size='large'>{update?.notes}</Typography>
                        </FlexBox>
                      </FlexBox>

                      <Space size={25} />

                      <FlexBox
                        justifyContent='space-between'
                        className={styles.borderBottom}
                      >
                        <FlexBox
                          flexDirection='row'
                          alignItems='center'
                          className={styles.cursorPointer}
                          onClick={() => window.open(update?.fileUrl, '_blank')}
                        >
                          <Icon
                            name={`gray-document-icon`}
                            alt='icon'
                            size={24}
                            className={styles.marginLeft16}
                          />
                          <Space size={5} />
                          <Typography size='large'>{update?.fileName}</Typography>
                        </FlexBox>
                      </FlexBox>

                      <Space size={25} />
                    </FlexBox>
                  </>
                )
              })}
            </>
          ) : (
            <></>
          )}

          <Space size={24} />

          <Space size={24} />
          <FlexBox className={styles.previewBox} flexDirection='column'>
            <FlexBox justifyContent='space-between' alignItems='center'>
              <Typography size='giant'>{data.name}</Typography>
              <FlexBox alignItems="center">
                <Space size={16} horizontal />
                {
                  data?.additionalFiles &&
                  data?.additionalFiles?.length > 0 && (
                    userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && (
                      userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER ||
                      (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.USER && (
                        data?.docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT || data?.docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT)))) &&
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
                        {(
                          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && (
                            userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER ||
                            (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.USER && (
                              data?.docType === DOCUMENT_TYPE.COMPLAINT_DOCUMENT || data?.docType === DOCUMENT_TYPE.INCIDENT_DOCUMENT)))) && (
                          <Checkbox
                            checked={
                              selectedDocumentIds.includes(uploadedDocument?.id)
                            }
                            onChange={(e) => onSelectDocument(e, uploadedDocument?.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
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
        message={'Are you sure you want to delete the document?'}
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
  )
};

export default Page;
