"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Badge, Dropdown, } from "antd";
import { useSelector } from "react-redux"
import moment from "moment";
import { useRouter } from "next/navigation";

import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Button from "@/components/button";
import Status from "@/components/status";
import FlexBox from "@/components/flex-box";
import BreadCrumbs from "@/shared/global-breadcrumbs";
import { TColumn } from "@/components/table";
import * as API from "@/api";
import {
  COMPANY_USER_ACCESS_LEVEL,
  DOCUMENT_STATUS_TYPES,
  FOLDER_STATUS_TYPES,
  REGULATION_COMPLIANCE_STATUS_TYPE,
  TDocumentRecord,
  TRecordDocumentDetails,
  TStorageObject,
  TVdr,
  VDR_RECORD_TYPE,
} from "@/models";
import { useAccessLevel, useBreadcrumbs, useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import AddFolderModal from "./add-folder-modal";
import AddDocumentModal from "./add-document-modal";
import TableWithHeaderControls from "@/shared/table/table";
import Misc from "@/utils/misc";
import { DOCUMENT_TYPE } from "./records-validation-schemas";
import Clickable from "@/components/clickable";
import ConfirmDelete from "@/shared/confirm-delete";
import Toast from "@/components/toast";
import TourComponent from "@/components/TourComponent";
import Loading from "@/components/loading";
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import AddToDataRoomModal from "../../registers/[registerCategoryId]/add-to-data-room-modal";

const Page = ({ params: { recordCategoryId } }: { params: { recordCategoryId: string } }) => {
  const [data, setData] = useState<TRecordDocumentDetails[]>([]);
  const [record, setRecord] = useState<TDocumentRecord>();
  const [search, setSearch] = useState("");
  const [initing, setIniting] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState("");
  const [onAddingData, setOnAddingData] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<TVdr[]>([]);
  const [loadFolder, setLoadFolder] = useState<boolean>(false)
  const [recordData, setRecordData] = useState<any>({});
  const [folderData, setFolderData] = useState<TStorageObject[]>([]);
  const [selectedSortValue, setSelectedSortValue] = useState<
    string | undefined
  >();

  const router = useRouter();
  const addFolderModalRef = useRef<any>();
  const addDocumentModalRef = useRef<any>();
  const addDataRoomModalRef = useRef<any>();
  const deleteModelRef: any = useRef();
  const userAccess = useAccessLevel()
  const url = typeof window !== 'undefined' ? window.location.href : ""
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const breadcrumbs = useBreadcrumbs();
  const companyId = useSelectedAccountCompany()?.companyId;
  const config = useSelector((state: any) => state.config)

  useEffect(() => {
    if (record?.name !== undefined) {
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'record_page',
        page_url: url,
        detail_category: record?.name,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
    }
  }, [record?.name, trackAmplitudeEvent]);

  const parsedData = useMemo(() => {
    return Misc.getFilteredData(data, search, selectedSortValue);
  }, [data, search, selectedSortValue]);

  const onSuccessDataRoom = (value: { parentId: string, folder: string }) => {
    onAddDataRoom(value);
  };

  async function onAddDataRoom(value: { parentId: string, folder: string }) {
    setOnAddingData(true);
    try {
      const apiData = {
        parentId: value?.folder || value.parentId,
        docType: 'registers',
        name: recordData?.name,
        fileType: recordData?.type,
        categoryId: recordCategoryId,
        documentId: recordData.id
      }
      await API.addDataRoom(companyId, value.parentId, apiData)
      addDataRoomModalRef.current.close()
      Toast.success(`Document moved to dataroom ${value?.folder ? "folder" : ""} successfully.`);
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setOnAddingData(false);
    }
  }

  const getFolders = async (dataRoomId: string) => {
    setLoadFolder(true)
    try {
      if (!companyId || !dataRoomId) return
      const result = await API.getVdr({ companyId, vdrId: dataRoomId })
      const folders = result.items.filter((item: any) => item?.type === 'FOLDER')
      setFolderData(folders)
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.")
    } finally {
      setLoadFolder(false)
    }
  }

  const fetchDataRoom = useCallback(async () => {
    setIniting(true);

    try {
      if (companyId) {
        const result = await API.getVdrFolder({ companyId });
        if (result) {
          setRoomData(result)
        }
      }
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.")
    }
  }, [companyId]);

  useEffect(() => {
    fetchDataRoom();
  }, [companyId]);

  const fetchData = useCallback(async () => {
    setIniting(true);

    if (!companyId || !recordCategoryId) {
      return;
    }

    try {
      const result = await API.getRecordDocumentList(companyId, recordCategoryId);
      const details = await API.getRecordDocumentDetails(companyId, recordCategoryId);
      setData(result.items);
      setRecord(details);
    } finally {
      setIniting(false);
    }
  }, [recordCategoryId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteDocument = async () => {
    try {
      setDeleting(true);
      await API.deleteRecordDocument(recordCategoryId, documentToDelete, companyId);
      fetchData();
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setDeleting(false);
      deleteModelRef?.current?.close();
    }
  };

  const onRowClick = (recordItem: TStorageObject) => {
    if (recordItem.type === "folder") {
      router.push(`/documents/records/${record?.id}/${recordItem.id}`);

      breadcrumbs.add({
        title: `${recordItem.name}`,
        link: `/documents/records/${record?.id}/${recordItem.id}`,
      });
    } else if (recordItem.type === "document") {
      router.push(`/documents/records/${record?.id}/document/${recordItem.id}`);

      breadcrumbs.add({
        title: `${recordItem.name}`,
        link: `/documents/records/${record?.id}/document/${recordItem.id}`,
      });
    }
  };

  const onSuccess = () => {
    fetchData();
  };

  const columns = useMemo<TColumn<TStorageObject>[]>(
    () => (record?.docType !== DOCUMENT_TYPE.REGULATION &&
      record?.docType !== DOCUMENT_TYPE.REGULATION_COMPLIANCE &&
      record?.docType !== DOCUMENT_TYPE.FINANCE_DOCUMENT && record?.docType !== DOCUMENT_TYPE.FINANCE) ? [
        {
          key: "type",
          width: 60,
          noPadding: true,
          render: (record) => (
            <Icon name={`gray-${record.type}-icon`} alt="icon" size={24} className={styles.marginLeft16} />
          ),
        },
        {
          key: "name",
          title: "Name",
          width: 250,
        },
        {
          key: "dateCreated",
          title: "Date Created",
          render: (record) => moment(record.dateCreated).format("DD/MM/YYYY"),
        },
        {
          key: "avatars",
          title: "Users",
          render: () => <Badge count={'All Users'} title={'Individual User Selection coming in a future update.'} showZero color='#52c41a' />,
        },
        {
          key: "statusLabel",
          title: "Status",
          width: 170,
          render: (record) => {
            let colors;
            if (record?.type === "folder") {
              if (record?.status === FOLDER_STATUS_TYPES.UP_TO_DATE) {
                colors = "green"
              } else if (record?.status === FOLDER_STATUS_TYPES.ATTENTION) {
                colors = "red"
              } else {
                colors = "yellow"
              }
              return record?.status ? <Status title={record.status} className={styles.statusWidth} color={colors} /> : "-"

            } else {
              if (record.statusLabel === DOCUMENT_STATUS_TYPES.REVIEW_DUE) {
                colors = "yellow"
              } else if (record.statusLabel === DOCUMENT_STATUS_TYPES.UP_TO_DATE) {
                colors = "green"
              } else {
                colors = "red"
              }
              return record?.statusLabel ? <Status title={record.statusLabel || ""} className={styles.statusWidth} color={colors} /> : "-"
            }
          },
        },
        (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) ? {
          width: 73,
          render: (record) => record?.type === "document" && (
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Data rooms",
                    key: "1",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setRecordData(record);
                      addDataRoomModalRef?.current?.open({
                        recordId: record?.id,
                        categoryId: record?.recordCategoryId,
                        recordType: VDR_RECORD_TYPE.RECORD,
                        parentId: record?.parentId
                      });
                    },
                  },
                  {
                    label: "Delete",
                    key: "2",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setDocumentToDelete(record?.id);
                      deleteModelRef?.current?.open();
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Clickable
                className={styles.optionButton}
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined />
              </Clickable>
            </Dropdown>
          ),
        } : {},
      ] : [
        {
          key: "type",
          width: 60,
          noPadding: true,
          render: (record) => (
            <Icon name={`gray-${record.type}-icon`} alt="icon" size={24} className={styles.marginLeft16} />
          ),
        },
        {
          key: "name",
          title: "Name",
          width: 250,
        },
        (record?.docType === DOCUMENT_TYPE.FINANCE_DOCUMENT || record?.docType === DOCUMENT_TYPE.FINANCE) ? {
          key: "documentDate",
          title: "Document Date",
          render: (record) => record?.documentDate ? moment(record?.documentDate).format("DD/MM/YYYY") : "-"
        } : {
          key: "dateCreated",
          title: "Date Created",
          render: (record) => moment(record.dateCreated).format("DD/MM/YYYY"),
        },
        {
          key: "referenceNumber",
          title: "Reference Number",
          render: (record) => record?.referenceNumber ? record?.referenceNumber : "-",
        },
        {
          key: "secondReferenceNumber",
          title: "Second Reference Number",
          render: (record) => record?.secondReferenceNumber ? record?.secondReferenceNumber : "-",

        },
        {
          key: "avatars",
          title: "Users",
          render: () => <Badge count={'All Users'} title={'Individual User Selection coming in a future update.'} showZero color='#52c41a' />,
        },
        {
          key: "statusLabel",
          title: "Status",
          width: 170,
          render: (record) => {
            let colors;
            if (record?.type === "folder") {
              if (record?.status === FOLDER_STATUS_TYPES.UP_TO_DATE) {
                colors = "green"
              } else if (record?.status === FOLDER_STATUS_TYPES.ATTENTION) {
                colors = "red"
              } else {
                colors = "yellow"
              }
              return record?.status ? <Status title={record.status} className={styles.statusWidth} color={colors} /> : "-"
            } else {
              if (record.statusLabel === DOCUMENT_STATUS_TYPES.REVIEW_DUE) {
                colors = "yellow"
              } else if (record.statusLabel === DOCUMENT_STATUS_TYPES.UP_TO_DATE ||
              record.statusLabel === REGULATION_COMPLIANCE_STATUS_TYPE.CURRENT) {
                colors = "green"
              } else if (record.statusLabel === REGULATION_COMPLIANCE_STATUS_TYPE.STATIC) {
                colors = "white"
              } else {
                colors = "red"
              }
              return record?.statusLabel ? <Status title={record?.statusLabel || ""} className={styles.statusWidth} color={colors} /> : "-"
            }
          },
        },
        (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) ? {
          width: 73,
          render: (record) => record?.type === "document" && (
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Data rooms",
                    key: "1",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setRecordData(record);
                      addDataRoomModalRef?.current?.open({
                        recordId: record?.id,
                        categoryId: record?.recordCategoryId,
                        recordType: VDR_RECORD_TYPE.RECORD,
                        parentId: record?.parentId
                      });
                    },
                  },
                  {
                    label: "Delete",
                    key: "2",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setDocumentToDelete(record?.id);
                      deleteModelRef?.current?.open();
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Clickable
                className={styles.optionButton}
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined />
              </Clickable>
            </Dropdown>
          ),
        } : {},
      ],
    [record?.docType, userAccess]
  );

  if (!userAccess) {
    return <Loading size="small" />
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <BreadCrumbs />
        <Space size={32} />
        <TableWithHeaderControls
          onRowClick={onRowClick}
          title={(record && record.name) || ""}
          data={parsedData}
          initing={initing}
          search={search}
          setSearch={setSearch}
          columns={columns}
          selectedSortValue={selectedSortValue}
          setSelectedSortValue={setSelectedSortValue}
          id="row0"
        />
        <Space size={20} />
        {(
          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && (
          <div id="buttons">
            <FlexBox justifyContent="flex-end">
              <Button id="add_folder" onClick={() => addFolderModalRef.current.open()}>
                  Add Folder
              </Button>
              <Space size={20} horizontal />
              <Button
                type="primary"
                onClick={() => addDocumentModalRef.current.open()}
                disabled={initing}
                id="add_document"
              >
                  Add Document
              </Button>
            </FlexBox>
          </div>
        )}
        <AddFolderModal
          ref={addFolderModalRef}
          onSuccess={onSuccess}
          companyId={companyId || ""}
          recordId={record?.id || ""}
        />
        <AddDocumentModal
          ref={addDocumentModalRef}
          onSuccess={onSuccess}
          record={record || null}
        />
        <ConfirmDelete
          ref={deleteModelRef}
          handleConfirm={deleteDocument}
          loading={deleting}
          message={"Are you sure you want to delete the document?"}
        />
        <AddToDataRoomModal
          ref={addDataRoomModalRef}
          onSuccess={onSuccessDataRoom}
          roomData={roomData}
          getFolders={getFolders}
          folderData={folderData}
          loadFolder={loadFolder}
          onAddingData={onAddingData}
        />
        <TourComponent
          start={!initing && config.config}
          setBreadcrumbs={() => {
            if (parsedData[0]?.type === "folder") {
              breadcrumbs.add({
                title: `${parsedData[0]?.name}`,
                link: `/documents/records/${record?.id}/${parsedData[0]?.id}`,
              });
            } else if (parsedData[0]?.type === "document") {
              breadcrumbs.add({
                title: `${parsedData[0]?.name}`,
                link: `/documents/records/${record?.id}/document/${parsedData[0]?.id}`,
              });
            }
          }}
          onRouteChange={record?.id && parsedData[0]?.id ? `/documents/records/${record?.id}/document/${parsedData[0]?.id}` : ""}
        />
      </Container >
      <Space size={50} />
    </ScollablePage >
  );
};

export default Page;
