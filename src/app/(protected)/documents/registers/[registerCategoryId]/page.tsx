"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Badge, Dropdown } from "antd";
import { useSelector } from "react-redux"

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
import { COMPANY_USER_ACCESS_LEVEL, TItems, TStorageObject, TVdr, VDR_RECORD_TYPE } from "@/models";
import { useAccessLevel, useBreadcrumbs, useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import AddDocumentModal from "./add-document-modal";
import TableWithHeaderControls from "@/shared/table/table";
import Misc from "@/utils/misc";
import Clickable from "@/components/clickable";
import ConfirmDelete from "@/shared/confirm-delete";
import Toast from "@/components/toast";
import AddToDataRoomModal from "./add-to-data-room-modal";
import { DOCUMENT_TYPES } from '../register-forms/common-fields-form';
import { DOCUMENT_TYPE, RESOLUTION_STATUS } from '../registers-validation-schemas';
import { StatusDetail, getStatusDetails } from "@/utils/document";
import TourComponent from "@/components/TourComponent";
import Loading from "@/components/loading";
import useAmplitudeContext from "@/hooks/amplitude";
import { SORT_OPTIONS } from "@/constants"
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"

export interface OwnerOption {
  label: string;
  value: string
}

const Page = ({
  params: { registerCategoryId },
}: {
  params: { registerCategoryId: string };
}) => {
  const [data, setData] = useState<TItems[]>([]);
  const [register, setRegister] = useState<any>();
  const [search, setSearch] = useState("");
  const [initing, setIniting] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [roomData, setRoomData] = useState<TVdr[]>([]);
  const [recordData, setRecordData] = useState<any>({});
  const [folderData, setFolderData] = useState<TStorageObject[]>([]);
  const [onAddingData, setOnAddingData] = useState<boolean>(false);
  const [loadFolder, setLoadFolder] = useState<boolean>(false)
  const [documentToDelete, setDocumentToDelete] = useState("");


  const router = useRouter();
  const addDocumentModalRef = useRef<any>();
  const addDataRoomModalRef = useRef<any>();
  const userAccess = useAccessLevel()

  const [selectedSortValue, setSelectedSortValue] = useState<
    string | undefined
  >();
  const breadcrumbs = useBreadcrumbs();
  const companyId = useSelectedAccountCompany()?.companyId;
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""
  const config = useSelector((state: any) => state.config)

  const deleteModelRef: any = useRef();

  const parsedData = useMemo(() => {
    if (data?.length > 0) {
      if (register?.docType === DOCUMENT_TYPE.RESOLUTION) {
        return Misc.getFilteredData(data, search, SORT_OPTIONS.RECENTLY, "resolutionNumber")
      }
      return Misc.getFilteredData(data, search, selectedSortValue);
    }
  }, [data, search, selectedSortValue]);

  useEffect(() => {
    if (register?.name !== undefined) {

      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'Registers_page',
        detail_category: register?.name,
        page_url: url,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
    }
  }, [register?.name]);

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      if (!companyId || !registerCategoryId) return
      const result = await API.getRegisterRecords(
        companyId,
        registerCategoryId
      );
      const details = await API.getRegisterDetails(
        companyId,
        registerCategoryId
      );
      setData(result.items);
      setRegister(details);
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.")
    } finally {
      setIniting(false);
    }
  }, [companyId, registerCategoryId]);
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
    fetchData();
    // eslint-disable-next-line
  }, [companyId, registerCategoryId]);

  useEffect(() => {
    fetchDataRoom();

    // eslint-disable-next-line
  }, [companyId]);

  const deleteDocument = async () => {
    try {
      setDeleting(true);
      await API.deleteRegisterDocument(
        registerCategoryId,
        documentToDelete,
        companyId
      );
      fetchData();
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setDeleting(false);
      deleteModelRef?.current?.close();
    }
  };

  const onRowClick = (recordItem: TStorageObject) => {
    router.push(
      `/documents/registers/${register?.id}/document/${recordItem.id}`
    );
    breadcrumbs.add({
      title: `${recordItem.name}`,
      link: `/documents/registers/${register?.id}/document/${recordItem.id}`,
    });
  };

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
        categoryId: registerCategoryId,
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

  const onClickStatus = (record: TStorageObject) => {
    const statusDetails: StatusDetail = getStatusDetails(record);
    return statusDetails;
  };

  const columns = useMemo<TColumn<TStorageObject>[]>(
    () => [
      {
        key: "type",
        width: 60,
        noPadding: true,
        render: (record) => (
          <Icon
            name={`gray-${record.type}-icon`}
            alt="icon"
            size={24}
            className={styles.marginLeft16}
          />
        ),
      },
      {
        key: "name",
        title: "Name",
        width: 250,
      },
      (register?.docType === DOCUMENT_TYPES.APPROVED.TYPE || register?.docType === DOCUMENT_TYPES.APPROVED.NAME
        || register?.docType === DOCUMENT_TYPES.GOVERNING.NAME || register?.docType === DOCUMENT_TYPES.GOVERNING.TYPE) ?
        {
          key: "reviewDate",
          title: "Review Date",
          render: (record) => record?.reviewDate ? moment(record?.reviewDate).format("DD/MM/YYYY") : "-",
        } : {
          key: "dateCreated",
          title: "Date Created",
          render: (record) => moment(record?.dateCreated).format("DD/MM/YYYY"),
        },
      (register?.docType === DOCUMENT_TYPES.GOVERNING.NAME || register?.docType === DOCUMENT_TYPES.GOVERNING.TYPE) ? {
        key: "date",
        title: "Document date",
        render: (record) => record?.documentDate ? moment(record?.documentDate).format("DD/MM/YYYY") : "-"
      } : {
        key: "avatars",
        title: "Users",
        render: () => <Badge count={'All Users'} title={'Individual User Selection coming in a future update.'} showZero color='#52c41a' />,
      },
      {
        key: "statusLabel",
        title: "Status",
        width: 210,
        render: (record) => {
          const { color, label } = onClickStatus(record);
          return <Status title={label} color={color} className={styles.statusWidth} />
        }
      },
      (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && (
        userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER ||
        (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.USER && (
          register?.docType === DOCUMENT_TYPES.COMPLAINTS.NAME ||
          register?.docType === DOCUMENT_TYPES.INCIDENTS.NAME ||
          register?.docType === DOCUMENT_TYPES.COMPLAINTS.TYPE ||
          register?.docType === DOCUMENT_TYPES.INCIDENTS.TYPE)
        )
      )) ? {
          width: 73,
          render: (record) => (
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Data rooms",
                    key: "1",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setRecordData(record);
                      addDataRoomModalRef?.current?.open(
                        {
                          recordId: record?.id,
                          categoryId: record?.registerCategoryId,
                          recordType: VDR_RECORD_TYPE.REGISTER,
                          parentId: record?.parentId
                        }
                      );
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
    [register, userAccess]
  );

  const resolutionColumns = useMemo<TColumn<TStorageObject>[]>(
    () => [
      {
        key: "type",
        width: 60,
        noPadding: true,
        render: (record) => (
          <Icon
            name={`gray-${record.type}-icon`}
            alt="icon"
            size={24}
            className={styles.marginLeft16}
          />
        ),
      },

      {
        key: "resolutionNumber",
        title: "Resolution Number",
        width: 190,
      },
      {
        key: "name",
        title: "Name",
        width: 170,
      },
      {
        key: "typeOfResolution",
        title: "Resolution Type",
        width: 170,
      },
      {
        key: "circulationDate",
        title: "Circulation date",
        width: 170,
        render: (record) => record?.circulationDate ? moment(record?.circulationDate).format("DD/MM/YYYY") : "-",
      },
      {
        key: "passedDate",
        title: "Passed date",
        width: 170,
        render: (record) => record?.dateApproved ? moment(record?.dateApproved).format("DD/MM/YYYY") : "-",
      },
      {
        key: "status",
        title: "Status",
        width: 190,
        justifyContent: "center",
        render: (record) => {
          let colors;
          if (record.status === RESOLUTION_STATUS.PENDING_BOARD_APPROVAL || record.status === RESOLUTION_STATUS.APPROVED_FOR_CIRCULATION ||
            record.status === RESOLUTION_STATUS.CIRCULATED || record.status === RESOLUTION_STATUS.PENDING) {
            colors = "yellow"
          } else if (record.status === RESOLUTION_STATUS.OVERDUE) {
            colors = "red"
          } else if (record.status === RESOLUTION_STATUS.DEFUNCT || record.status === RESOLUTION_STATUS.CANCELLED) {
            colors = "white"
          } else {
            colors = "green"
          }
          return (
            <Status
              color={colors}
              title={record.status}
              className={styles.statusWidth}
            />
          )
        },
      },
      (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER
        && userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) ? {
          width: 73,
          render: (record) => (
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Data rooms",
                    key: "1",
                    onClick: (e) => {
                      e.domEvent.stopPropagation();
                      setRecordData(record);
                      addDataRoomModalRef?.current?.open(
                        {
                          recordId: record?.id,
                          categoryId: record?.registerCategoryId,
                          recordType: VDR_RECORD_TYPE.REGISTER,
                          parentId: record?.parentId
                        }
                      );
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
    [userAccess]
  );

  const highestResolutionNumber = useMemo(() => {
    if (register?.docType === DOCUMENT_TYPE.RESOLUTION || register?.docType === DOCUMENT_TYPE.RESOLUTION_DOCTYPE ||
      register?.docType === DOCUMENT_TYPE.RESOLUTION_DOCUMENT) {
      const allNumbers =
        data?.flatMap(item => item?.additionalResolutionNumbers && item?.additionalResolutionNumbers?.length > 0 ? [
          Number(item?.resolutionNumber),
          ...(item?.additionalResolutionNumbers?.map(Number))
        ] : Number(item?.resolutionNumber))
      const filteredNumbers = allNumbers?.filter(num => !isNaN(num))
      return filteredNumbers?.length > 0 && Math.max(...filteredNumbers);
    }
  }, [data, register?.docType])

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
          title={(register && register.name) || ""}
          data={parsedData || []}
          initing={initing}
          search={search}
          setSearch={setSearch}
          columns={
            register?.docType === DOCUMENT_TYPE.RESOLUTION ? resolutionColumns : columns
          }
          selectedSortValue={selectedSortValue}
          setSelectedSortValue={setSelectedSortValue}
          id="row0"
        />
        <Space size={20} />
        {(
          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && (
            userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER ||
            (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.USER &&
              register?.docType === DOCUMENT_TYPES.COMPLAINTS.NAME ||
              register?.docType === DOCUMENT_TYPES.INCIDENTS.NAME ||
              register?.docType === DOCUMENT_TYPES.COMPLAINTS.TYPE ||
              register?.docType === DOCUMENT_TYPES.INCIDENTS.TYPE)
          )) && (
          <div id="buttons">
            <FlexBox justifyContent="flex-end">
              <Space size={20} horizontal />
              <Button
                type="primary"
                onClick={() => addDocumentModalRef.current.open()}
                disabled={initing}
                id="add_document"
              >
                {(
                  register?.docType === DOCUMENT_TYPES.INCIDENTS.TYPE ||
                    register?.docType === DOCUMENT_TYPES.INCIDENTS.NAME
                ) ?
                  "Add Incident" : "Add Document"
                }
              </Button>
            </FlexBox>
          </div>
        )}
        <AddDocumentModal
          ref={addDocumentModalRef}
          onSuccess={fetchData}
          register={register || null}
          highestResolutionNumber={highestResolutionNumber || 0}
        />
      </Container>
      <Space size={50} />

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
          breadcrumbs.add({
            title: `${parsedData && parsedData[0]?.name}`,
            link: `/documents/registers/${register?.id}/document/${parsedData && parsedData[0]?.id}`,
          });
        }}
        onRouteChange={parsedData && parsedData[0]?.id ? `/documents/registers/${register?.id}/document/${parsedData[0]?.id}` : ""}

      />
    </ScollablePage>
  );
};

export default Page;
