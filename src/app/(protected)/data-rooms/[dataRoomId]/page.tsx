"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Button, Dropdown, Table } from "antd";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from "@ant-design/icons";

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Clickable from "@/components/clickable";
import FlexBox from "@/components/flex-box";
import BreadCrumbs from "@/shared/global-breadcrumbs";
import * as API from "@/api";
import {
  TDocumentRecord,
  TStorageObject,
  USER_TYPE,
  VDR_METADATA_STATUS,
  VDR_RECORD_TYPE,
} from "@/models";
import {
  useAccessLevel,
  useBreadcrumbs,
  useSelectedAccountCompany,
} from "@/hooks";
import styles from "./page.module.scss";
import Toast from "@/components/toast";
import { openDownloadDialog } from "@/utils/file-reader";
import Status from "@/components/status";
import Icon from "@/components/icon";
import { getArray } from "../addDataRoomForm";
import Loading from "@/components/loading";
import AddFolderModal from "../../documents/records/[recordCategoryId]/add-folder-modal";
import AddDocumentModal from "../../documents/records/[recordCategoryId]/add-document-modal";
import AddMemberModal from "./access-permision-modal";
import DocumentPreviewModal from "@/shared/document-preview-modal";
import { getVDRStatus } from "@/utils/misc";
import ConfirmDelete from "@/shared/confirm-delete";
import AddUserModal from "../../settings/account-and-billing/manage-users/add-user-modal";
import StartTour from "@/shared/start-tour";
import TourComponent from "@/components/TourComponent";
import { DATA_ROOM_STEPS } from "@/constants";

const getEditUrl = (type: string) => {
  switch (type) {
  case VDR_RECORD_TYPE.OBJECTIVES:
    return "/dashboard/business-health/corporate-objectives";
  case VDR_RECORD_TYPE.RISK:
    return "/dashboard/business-health/strategic-risks";
  case VDR_RECORD_TYPE.VISION_AND_PURPOSE:
    return "/dashboard/business-health/vision-purpose";
  default:
    return "";
  }
};

const Page = ({
  params: { dataRoomId },
}: {
  params: { dataRoomId: string };
}) => {
  const [data, setData] = useState<TStorageObject[]>([]);
  const [dataRoomdetails, setDataRoomDetails] = useState<any>({
    name: "",
    status: "",
    id: "",
  });
  const [initing, setIniting] = useState(true);
  const [tourStart, setTourStart] = useState<boolean>(false);
  const companyId = useSelectedAccountCompany()?.companyId;
  const addFolderModalRef = useRef<any>();
  const addDocumentModalRef = useRef<any>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<TDocumentRecord | null>(null);
  const breadcrumbs = useBreadcrumbs();
  const addMemberModalRef = useRef<any>(null);
  const previewDocumentModalRef: any = useRef();
  const [recordId, setRecordId] = useState("");
  const deleteModelRef = useRef<any>(null);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [peoples, setPeoples] = useState<any>([]);
  const user = useAccessLevel();
  const [userAccess, setUserAccess] = useState<{
    id?: string;
    permission?: string;
  }>({});
  const addUserModalRef = useRef<any>();
  const openStartTourModalRef = useRef<any>();

  useEffect(() => {
    const accessuser = peoples?.filter(
      (item: any) => item?.id === user?.userId
    );
    if (accessuser?.length) {
      setUserAccess(accessuser[0]);
    }
  }, [peoples, user]);

  const getData = useCallback((array: any) => {
    if (!array.length) return
    if (user?.userType?.toLowerCase() === USER_TYPE.INVESTOR?.toLowerCase()) {
      return array?.filter((item: any) => item?.isVisible === true)
    } else {
      return array
    }
  }, [user, data])

  const fetchData = useCallback(async () => {
    if (!companyId) {
      return;
    }
    try {
      getVdrAccess();
      setIniting(true);
      const result = await API.getVdr({ companyId, vdrId: dataRoomId });
      setData(result?.items);
      setDataRoomDetails({
        name: result?.parent?.name,
        status: result?.parent?.status,
        id: result?.parent?.id,
      });
      setIniting(false);
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
      setIniting(false);
    }
  }, [dataRoomId, companyId]);

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
          permission: "view",
        }));
        const editArray = result?.editAccess?.map((item: any) => ({
          id: item,
          permission: "edit",
        }));

        setPeoples([...viewArray, ...editArray]);
        setLoading(false);
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
      setLoading(false);
    }
  }, [dataRoomId, companyId]);

  const getReportVdr = async (type: string) => {
    if (!companyId) {
      return;
    }
    try {
      setLoading(true);
      const response = await API.getReportVdr({
        companyId,
        vdrId: dataRoomId,
        recordType: type,
      });
      if (response) {
        previewDocumentModalRef.current.open({
          fileUrl: response,
          fileType: "application/pdf",
          showEdit: true,
          editUrl: getEditUrl(type),
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const onDelete = (
    e: any,
    status: string,
    vdrId: string,
    type: string,
    isVisible: boolean
  ) => {
    e.domEvent.stopPropagation();
    setRecordId(vdrId);
    setType(type);
    setIsVisible(isVisible);
    setStatus(status);
    deleteModelRef?.current?.open();
  };

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
        deleteModelRef.current?.close();
        fetchData();
        setLoading(false);
      }
    } catch (error) {
      Toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId, dataRoomId]);

  const onSuccess = () => {
    fetchData();
  };

  const handleClick = (record: any) => {
    if (record?.type === "FOLDER") {
      router.push(`/data-rooms/${dataRoomId}/${record?.id}`);
      breadcrumbs.add({
        title: record?.name,
        link: `/data-rooms/${dataRoomId}/${record?.id}`,
      });
    } else if (record?.type === "DOCUMENT") {
      if (record?.name === VDR_RECORD_TYPE?.VISION_AND_PURPOSE) {
        getReportVdr(record?.name);
      } else if (record?.name === VDR_RECORD_TYPE?.OBJECTIVES) {
        getReportVdr(record?.name);
      } else if (record?.name === VDR_RECORD_TYPE?.RISK) {
        getReportVdr(record?.name);
      } else {
        return;
      }
    }
  };

  const getUserAcccess = (isVisible?: boolean, access?: string) => {
    if (isVisible === false) {
      return "isvisible";
    }
    if (access !== "edit") {
      return "view";
    }
  };

  const onClickOption = async () => {
    setIniting(true);
    try {
      const data = await API.getVdrDownloadLink({
        companyId,
        vdrId: dataRoomId,
      });
      if (data) {
        openDownloadDialog({ url: data.url, filename: "dataroom" });
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  };

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
                src={
                  record?.isVisible === true
                    ? `/icons/green-${record.type === "FOLDER" ? "folder" : "document"
                    }-icon.svg`
                    : `/icons/gray-${record.type === "FOLDER" ? "folder" : "document"
                    }-icon.svg`
                }
                alt="icon"
                width={24}
                height={24}
              />
              <Typography
                className={record?.isVisible ? styles?.activeText : ""}
              >
                {record?.name}
              </Typography>
            </FlexBox>
          </Clickable>
        ),
      },
      {
        key: "dateCreated",
        title: "created_at",
        render: (record: any) => (
          <div
            className={
              styles[
                `${getUserAcccess(record?.isVisible, userAccess?.permission)}`
              ]
            }
          >
            {" "}
            {moment(record.created_at).format("DD/MM/YYYY")}
          </div>
        ),
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
              className={
                styles[
                  `${getUserAcccess(cell?.isVisible, userAccess?.permission)}`
                ]
              }
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
                    size="medium"
                  />
                </div>
              </Clickable>
            </Dropdown>
          </>
        ),
        width: 180,
      },
      {
        render: (record: any) =>
          userAccess?.permission === "edit" ? (
            <Dropdown
              menu={{
                items: [
                  record?.isVisible === true
                    ? {
                      label: "Remove from data room",
                      key: "0",
                      onClick: (e) => {
                        onDelete(
                          e,
                          VDR_METADATA_STATUS.DELETED,
                          record?.id,
                          record?.type,
                          !record?.isVisible
                        );
                      },
                    }
                    : {
                      label: "Add Item",
                      key: "1",
                      onClick: (e) =>
                        onDelete(
                          e,
                          VDR_METADATA_STATUS.NOT_STARTED,
                          record?.id,
                          record?.type,
                          !record?.isVisible
                        ),
                    },
                ],
              }}
              trigger={["click"]}
            >
              <Clickable onClick={(e) => e.stopPropagation()}>
                <EllipsisOutlined style={{ fontSize: 24 }} />
              </Clickable>
            </Dropdown>
          ) : (
            <></>
          ),
      },
    ],
    [companyId, userAccess]
  );

  const handleConfirm = () => {
    setTourStart((prev) => !prev);
    openStartTourModalRef?.current?.close();
  };

  // const getWidth = () => {
  //   return (
  //     (data?.filter((item) => item?.status === dataRoomdetails?.status)
  //       ?.length /
  //       data?.length) *
  //     100
  //   );
  // };
  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <BreadCrumbs />
          {peoples?.length > 0 && userAccess?.permission === "edit" && (
            <FlexBox alignItems="center" justifyContent="center" gap={5}>
              <Button
                className={styles.accessButton}
                onClick={() => {
                  addMemberModalRef?.current?.open();
                }}
                id="access_permissions"
              >
                Access Permissions
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
                {getStatus(dataRoomdetails?.status)?.title}
              </Typography>
            </div>
          </FlexBox> */}
          {!loading && (
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              className={styles.header}
            >
              <FlexBox gap={8} alignItems="center">
                <Typography size="huge" darkBlue>
                  {dataRoomdetails?.name}
                </Typography>
                <Clickable
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
              </FlexBox>

              <FlexBox className={styles.headerBar}>
                <FlexBox gap={12}>
                  <div className={styles.iconStyles}>
                    <Clickable
                      onClick={(e) => {
                        onClickOption();
                      }}
                    >
                      <Icon name="downloadIcon" size={15} />
                    </Clickable>
                  </div>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          )}
          <Table
            className={styles.table}
            columns={columns}
            dataSource={getData(getArray(data.length > 0 ? data : []))}
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

        <AddMemberModal
          addUserModalRef={addUserModalRef}
          onSuccess={fetchData}
          dataRoomId={dataRoomId}
          ref={addMemberModalRef}
          peoplesValue={peoples}
        />
      </Container>
      <Space size={50} />
      <DocumentPreviewModal ref={previewDocumentModalRef} />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={() => {
          updateVdrStatus(status, recordId, isVisible, type);
        }}
        loading={loading}
        message={`Are you sure you want to ${status === "DELETED" ? "remove" : "add"
        } the item?`}
      />
      <AddUserModal
        ref={addUserModalRef}
        onSuccess={fetchData}
        companyId={companyId!}
        invitedVdrId={dataRoomId}
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
        onGoingStep={DATA_ROOM_STEPS.DATA_ROOM}
      />
    </ScollablePage>
  );
};

export default Page;
