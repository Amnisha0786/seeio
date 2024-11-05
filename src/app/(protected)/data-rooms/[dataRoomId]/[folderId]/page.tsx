"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Button, Dropdown, Table } from "antd";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from '@ant-design/icons'

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Clickable from "@/components/clickable";
import FlexBox from "@/components/flex-box";
import BreadCrumbs from "@/shared/global-breadcrumbs";
import * as API from "@/api";
import { TDocumentRecord, TRecords, TStorageObject, USER_TYPE, VDR_METADATA_STATUS, VDR_RECORD_TYPE } from "@/models";
import {
  useAccessLevel,
  useBreadcrumbs,
  useSelectedAccountCompany,
} from "@/hooks";
import styles from "../page.module.scss";
import Toast from "@/components/toast";
import Status from "@/components/status";
import Loading from "@/components/loading";
import { getArray } from "../../addDataRoomForm";
import { getVDRStatus } from '@/utils/misc';
import ConfirmDelete from "@/shared/confirm-delete";
import { TRegister } from "@/models/registers/register";
import StartTour from "@/shared/start-tour";
import TourComponent from "@/components/TourComponent";
import { DATA_ROOM_STEPS } from "@/constants";

const Page = ({
  params: { dataRoomId, folderId },
}: {
  params: { dataRoomId: string; folderId: string };
}) => {
  const [data, setData] = useState<TStorageObject[]>([]);
  const [records, setRecords] = useState<TRecords[] | TRegister[]>([]);
  const [dataRoomdetails, setDataRoomDetails] = useState<any>({
    name: "",
    status: "",
    id: ""
  });
  const [initing, setIniting] = useState(true);
  const companyId = useSelectedAccountCompany()?.companyId;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<TDocumentRecord | null>(null);
  const breadcrumbs = useBreadcrumbs();
  const [recordId, setRecordId] = useState('')
  const deleteModelRef = useRef<any>(null)
  const [status, setStatus] = useState('')
  const [type, setType] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [peoples, setPeoples] = useState<any>([])
  const user = useAccessLevel()
  const [userAccess, setUserAccess] = useState<{ id?: string, permission?: string }>({})
  const [tourStart, setTourStart] = useState<boolean>(false);
  const openStartTourModalRef = useRef<any>();

  useEffect(() => {
    const accessuser = peoples?.filter((item: any) => item?.id === user?.userId)
    if (accessuser?.length) {
      setUserAccess(accessuser[0])
    }
  }, [peoples, user])

  const getData = useCallback((array: any) => {
    if (!array.length) return
    if (user?.userType?.toLowerCase() === USER_TYPE.INVESTOR?.toLowerCase()) {
      return array?.filter((item: any) => item?.isVisible === true)
    } else {
      return array
    }
  }, [user, data])

  const fetchRecordData = useCallback(async () => {
    try {
      if (companyId) {
        setIniting(true);
        if (dataRoomdetails?.type === VDR_RECORD_TYPE.RECORD) {

          const result = await API.getRecords(companyId);
          if (result) {
            setRecords(result);
          }
        } else if (dataRoomdetails?.type === VDR_RECORD_TYPE?.REGISTER) {

          const result = await API.getRegisters(companyId);
          if (result) {
            setRecords(result);
          }
        }
      }
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId, dataRoomdetails]);

  const handleAddDocument = useCallback(() => {
    if (!dataRoomdetails?.referenceId && records?.length < 1) {
      return;
    }
    if (dataRoomdetails?.type === VDR_RECORD_TYPE?.REGISTER) {
      router?.push(`/documents/registers/${dataRoomdetails?.folderId}`);
    } else if (dataRoomdetails?.type === VDR_RECORD_TYPE?.RECORD) {

      if (dataRoomdetails?.parentId !== undefined) {
        router?.push(
          `/documents/records/${dataRoomdetails?.referenceId}/${dataRoomdetails?.folderId}`
        );
      } else {
        router?.push(`/documents/records/${dataRoomdetails?.folderId}`);
      }
    }
  }, [dataRoomdetails, records, companyId]);


  const getFilesVdr = async () => {
    if (!companyId || !folderId) return;
    setIniting(true);
    try {
      const result = await API.getFilesVdr({
        companyId,
        vdrId: dataRoomId,
        parentId: folderId,
        recordType: "FOLDER"
      });
      if (result) {
        setData(result?.items);
        setDataRoomDetails({
          name: result?.parent?.name,
          status: result?.parent?.status,
          id: result?.parent?.id,
          type: result?.parent?.vdrRecordType,
          // eslint-disable-next-line max-len
          referenceId: result?.parent?.referenceDetail?.[`${result?.parent?.vdrRecordType === VDR_RECORD_TYPE.RECORD ? 'recordCategoryId' : 'registerCategoryId'}`],
          folderId: result?.parent?.referenceDetail?.id,
          parentId: result?.parent?.referenceDetail?.parentId
        });
        setIniting(false);
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
      setIniting(false);
    }
  };

  const getVdrAccess = useCallback(async () => {
    if (!companyId) {
      return;
    }
    try {
      setLoading(true);
      const result = await API.getVdrAccess({ companyId, vdrId: dataRoomId });
      if (result) {

        const viewArray = result?.viewAccess?.map((item: any) => ({
          id: item,
          permission: "view"
        }))
        const editArray = result?.editAccess?.map((item: any) => ({
          id: item,
          permission: "edit"
        }))

        setPeoples([...viewArray, ...editArray]);
        setLoading(false);
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
      setLoading(false);
    }
  }, [dataRoomId, companyId]);

  const onDelete = (e: any, status: string, vdrId: string, isVisible: boolean, type: string) => {
    e.domEvent.stopPropagation();
    setRecordId(vdrId)
    setStatus(status)
    setIsVisible(isVisible)
    setType(type)
    deleteModelRef?.current?.open();
  }

  const updateVdrStatus = async (
    status: string,
    parentId: string,
    isVisible: boolean,
    recordType: string
  ) => {
    if (!companyId || !recordType) {
      return;
    }
    try {
      setLoading(true);
      const response = await API.updateVdrStatus({
        companyId,
        vdrId: dataRoomId,
        parentId,
        payload: {
          status,
          isVisible,
          recordType,
        },
      });
      if (response) {
        deleteModelRef.current?.close()
        getFilesVdr();
        setLoading(false);
      }
    } catch (error) {
      Toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataRoomdetails?.type) {
      fetchRecordData()
    }
  }, [dataRoomdetails])

  useEffect(() => {
    getVdrAccess();
    getFilesVdr();
  }, [companyId, dataRoomId]);

  const handleClick = (record: any) => {
    if (record?.type === "FOLDER") {
      router.push(`/data-rooms/${dataRoomId}/${record?.id}`);
      breadcrumbs.add({
        title: record?.name,
        link: `/data-rooms/${dataRoomId}/${record?.id}`,
      });
    } else if (record?.type === "DOCUMENT" && record?.referenceDetail?.id) {

      if (record?.referenceDetail?.recordCategoryId !== undefined) {
        router.push(
          `/documents/records/${record?.referenceDetail?.recordCategoryId}/document/${record?.referenceDetail?.id}`
        );
        breadcrumbs.add({
          title: record?.name,
          link: `/documents/records/${record?.referenceDetail?.recordCategoryId}/document/${record?.referenceDetail?.id}`,
        });
      } else if (record?.referenceDetail?.registerCategoryId !== undefined) {
        router.push(
          `/documents/registers/${record?.referenceDetail?.registerCategoryId}/document/${record?.referenceDetail?.id}`
        );
        breadcrumbs.add({
          title: record?.name,
          link: `/documents/registers/${record?.referenceDetail?.registerCategoryId}/document/${record?.referenceDetail?.id}`,
        });
      } else if (record?.referenceDetail?.minuteId !== undefined) {
        router.push(`/dashboard/minute-book/${record?.referenceDetail?.minuteId}`)
        breadcrumbs.add({
          title: record?.name,
          link: `/dashboard/minute-book/${record?.referenceDetail?.minuteId}`,
        });
      }
    }
  };

  const getUserAcccess = (isVisible?: boolean, access?: string) => {
    if (isVisible === false) {
      return 'isvisible'
    }
    if (access !== 'edit') {
      return 'view'
    }
  }

  const columns = useMemo<any>(
    () => [
      {
        key: "name",
        title: "Name",
        render: (record: any) => (
          <Clickable
            onClick={() => {
              handleClick(record);
            }}
            className={record?.isVisible === false ? styles.isvisible : ""}
          >
            <FlexBox alignItems="center" gap={3}>
              <Image
                src={record?.isVisible === true ? `/icons/green-${record.type === "FOLDER" ? "folder" : "document"
                }-icon.svg` :
                  `/icons/gray-${record.type === "FOLDER" ? "folder" : "document"
                  }-icon.svg`
                }
                alt="icon"
                width={24}
                height={24}
              />
              <Typography className={record?.isVisible ? styles?.activeText : ""}>{record?.name}</Typography>
            </FlexBox>
          </Clickable>
        ),
      },
      {
        key: "dateCreated",
        title: "created_at",
        render: (record: any) => <div className={styles[`${getUserAcccess(record?.isVisible, userAccess?.permission)}`]}>
          {" "}
          {moment(record.created_at).format("DD/MM/YYYY")}
        </div>,
      },
      {
        key: "description",
        title: "Description",
      },
      {
        key: "status",
        title: "Status",
        render: (cell: any) => (
          <>
            <Dropdown
              className={styles[`${getUserAcccess(cell?.isVisible, userAccess?.permission)}`]}
              menu={{
                items: [
                  {
                    label: "Not Started",
                    key: "1",
                    onClick: (e) => {
                      setRecord(record);
                      updateVdrStatus(
                        VDR_METADATA_STATUS.NOT_STARTED,
                        cell?.id,
                        cell?.isVisible,
                        cell?.type
                      );
                    },
                  },
                  {
                    label: "In progress",
                    key: "2",
                    onClick: (e) => {
                      setRecord(record);
                      updateVdrStatus(
                        VDR_METADATA_STATUS.IN_PROGRESS,
                        cell?.id,
                        cell?.isVisible,
                        cell?.type
                      );
                    },
                  },
                  {
                    label: "Ready",
                    key: "3",
                    onClick: (e) => {
                      setRecord(record);
                      updateVdrStatus(
                        VDR_METADATA_STATUS.READY,
                        cell?.id,
                        cell?.isVisible,
                        cell?.type
                      );
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
                <div id={"change-status"}>
                  <Status
                    title={getVDRStatus(cell?.status)?.title || ""}
                    color={getVDRStatus(cell?.status)?.color}
                    showArrow={userAccess?.permission === "edit" ? true : false}
                    size='medium'
                  />
                </div>
              </Clickable>
            </Dropdown>
          </>
        ),
        width: 180,
      },
      {
        width: 73,
        render: (record: any) => (
          userAccess?.permission === "edit" ? (
            <Dropdown
              menu={{
                items: [
                  record?.isVisible === true ? {
                    label: "Remove from data room",
                    key: '0',
                    onClick: (e) => {
                      onDelete(e,
                        VDR_METADATA_STATUS.DELETED,
                        record?.id,
                        !record?.isVisible,
                        record?.type
                      );
                    }
                  } : {
                    label: "Add Item",
                    key: '1',
                    onClick: (e) => onDelete(e,
                      VDR_METADATA_STATUS.NOT_STARTED,
                      record?.id,
                      !record?.isVisible,
                      record?.type
                    )
                  }]
              }} trigger={['click']}>
              <Clickable
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisOutlined style={{ fontSize: 24 }} />
              </Clickable>
            </Dropdown>
          ) : <></>
        )
      }
    ],
    [companyId, dataRoomdetails, userAccess]
  );

  // const getWidth = () => {
  //   return (
  //     (data?.filter((item) => item?.status === dataRoomdetails?.status)
  //       ?.length /
  //       data?.length) *
  //     100
  //   );
  // };

  const docId = useMemo(() => {
    return dataRoomdetails?.referenceId || ''
  }, [dataRoomdetails])

  const handleConfirm = () => {
    setTourStart((prev) => !prev)
    openStartTourModalRef?.current?.close();
  };

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <BreadCrumbs />

          {
            (peoples?.length > 0) &&
            (userAccess?.permission === "edit") &&
            (!loading || !initing) &&
            records?.filter((item) => item?.id === docId)?.length > 0
            &&
            (
              <FlexBox alignItems="center" justifyContent="center" gap={5}>
                <Button
                  onClick={handleAddDocument}
                  type="primary"
                  className={styles.accessButton}
                  id="add_document"
                >
                  Add Document
                </Button>
              </FlexBox>
            )}

        </FlexBox>
        <Space size={32} />
        <FlexBox className={styles.tableBody} gap={20} flexDirection="column">
          {/* <FlexBox
            justifyContent="space-between"
            gap={10}
            alignItems="center"
            className={styles.barStyle}
          >
            <div className={styles.progressBar}>
            <div
                className={`${styles.innerProgressBar} ${
                  styles[getStatus(dataRoomdetails?.status)?.color || ""]
                }`}
                style={{ width: `${getWidth()}` + "%" }}
              ></div>
            </div>
            <div>
              <Typography className={styles.heading} darkBlue>
                In Progress
              </Typography>
            </div>
          </FlexBox> */}
          <FlexBox
            justifyContent="space-between"
            alignItems="center"
            className={styles.header}
          >
            <FlexBox gap={8} alignItems="center">
              <Typography size="huge" darkBlue>
                {dataRoomdetails?.name}
              </Typography>
              {records?.filter((item) => item?.id === docId)?.length > 0 && <Clickable
                className={styles.absolute}
                onClick={(e) => {
                  e.stopPropagation();
                  openStartTourModalRef?.current?.open();
                }}
              >
                <Image
                  src="/icons/help-icon.svg"
                  alt="App Logo"
                  width={20}
                  height={20}
                />
              </Clickable>
              }
            </FlexBox>

          </FlexBox>
          <Table
            className={styles.table}
            columns={columns}
            dataSource={getData(getArray(data.length > 0 ? getArray(data) : []))}
            showHeader={false}
            loading={{
              spinning: loading || initing,
              indicator: <Loading size="small" />,
            }}
            pagination={false}
            id="row0"
          />
        </FlexBox>
        <Space size={20} />
      </Container>
      <Space size={50} />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={() => {
          updateVdrStatus(status, recordId, isVisible, type);
        }}
        loading={loading}
        message={`Are you sure you want to ${status === "DELETED" ? "remove" : "add"} the item?`}
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
        onGoingStep={DATA_ROOM_STEPS.DOCUMENT_LEVEL}
      />
    </ScollablePage>
  );
};

export default Page;
