'use client';

import React, {
  useEffect,
  useState,
  useMemo,
  Fragment,
  useRef,
  useCallback,
} from 'react';
import { Select, Checkbox, TabsProps, Tabs } from 'antd';
import { useRouter } from 'next/navigation';
import lodash from 'lodash';
import dayjs from 'dayjs';

import ScollablePage from '@/components/scollable-page';
import Container from '@/components/container';
import AddButton from '@/components/add-button';
import Space from '@/components/space';
import Typography from '@/components/typography';
import Clickable from '@/components/clickable';
import Loading from '@/components/loading';
import Icon from '@/components/icon';
import FlexBox from '@/components/flex-box';
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks';
import Status from '@/components/status';
import * as API from '@/api';
import { COMPANY_USER_ACCESS_LEVEL, TAction, TMeeting } from '@/models';
import { useUserName } from '@/hooks';
import styles from './page.module.scss';
import AddActionModal from './add-action-modal';
import AddMeetingModal from './add-meeting-modal';
import ConfirmDelete from '@/shared/confirm-delete';
import Toast from '@/components/toast';
import ViewActionModal from './view-action-modal';
import { MEETING_TYPES } from '@/constants';
import useAmplitudeContext from '@/hooks/amplitude';
import TableComponent from './TableComponent'
import UpdateStatusModal from './update-status-modal'
import ViewLogsModal from './view-logs-modal'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'


const SORT_MEETINGS_OPTIONS = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Date',
    value: 'date',
  },
];

const Page = () => {
  const [actions, setActions] = useState<TAction[]>([]);
  const [meetings, setMeetings] = useState<TMeeting[]>([]);
  const [initingActions, setInitingActions] = useState(true);
  const [initingMeetings, setInitingMeetings] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingMeeting, setDeletingMeeting] = useState(false);
  const [actionToDelete, setActionToDelete] = useState("");
  const [selectedMeetingIds, setSelectedMeetingIds] = useState<string[]>([]);
  const [actionsSort, setActionsSort] = useState<"company" | "user">("company");
  const [meetingsSort, setMeetingsSort] = useState<"name" | "date" | undefined>(
    undefined
  );
  const router = useRouter();
  const addActionModalRef = useRef<any>();
  const viewActionModalRef = useRef<any>();
  const viewLogModalRef = useRef<any>();
  const editActionModalRef = useRef<any>();
  const editStatusModalRef = useRef<any>();
  const deleteModelRef = useRef<any>();
  const addMeetingModalRef = useRef<any>();
  const deleteMeetingModelRef = useRef<any>();
  const userName = useUserName();
  const companyId = useSelectedAccountCompany()?.companyId;
  const [tabId, setTabId] = useState("current");
  const [searchData, setSearchData] = useState<string[]>(["not-started", "in-progress"]);
  const [filter, setFilter] = useState(false);
  const [inputvalue, setInputValue] = useState<any>();
  const url = typeof window !== 'undefined' ? window.location.href : ""
  const userAccess = useAccessLevel()

  const handleEdit = (record: TAction | null) => {
    editActionModalRef.current.open(record)
  }
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const fetchActionData = useCallback(
    async (search?: string[]) => {
      setInitingActions(true);
      const payload: any = {
        companyId,
        linkType: actionsSort,
        status: JSON.stringify(
          search ? search : ["not-started", "in-progress"]
        ),
      };
      if (inputvalue?.meeting) {
        payload["meetingId"] = inputvalue?.meeting;
      }

      if (inputvalue?.owner) {
        payload["ownerId"] = inputvalue?.owner;
      }

      if (inputvalue?.startDate) {
        payload["start_date"] = dayjs(inputvalue?.startDate).format(
          "YYYY-MM-DD"
        );
      }
      if (inputvalue?.endDate) {
        payload["end_date"] = dayjs(inputvalue?.endDate).format("YYYY-MM-DD");
      }
      try {
        if (!companyId) return;

        const result = await API.getActions(payload);
        setActions(result);
      } catch (error) {
        Toast.error('Something went wrong');
      } finally {
        setInitingActions(false);
      }
    },
    [actionsSort, companyId, inputvalue]
  );

  const fetchMeetingData = useCallback(async () => {
    setInitingMeetings(true);

    try {
      if (!companyId) return;

      const result = await API.getMeetings({ companyId });
      setMeetings(result.meetings);
    } catch (error) {
      Toast.error('Something went wrong');
    } finally {
      setInitingMeetings(false);
    }
  }, [companyId]);

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'board_meeting_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  useEffect(() => {
    fetchMeetingData();

    // eslint-disable-next-line
  }, [companyId]);

  useEffect(() => {
    fetchActionData(searchData);
  }, [searchData, fetchActionData]);

  const clearFetchActionData = async (search: string[]) => {
    setInitingActions(true);
    const payload: any = {
      companyId,
      linkType: actionsSort,
      status: JSON.stringify(search ? search : ["not-started", "in-progress"]),
    };

    try {
      if (!companyId) return;

      const result = await API.getActions(payload);
      setActions(result);
    } finally {
      setInitingActions(false);
    }
  };

  const deleteAction = async () => {
    try {
      setDeleting(true);
      if (!companyId || !actionToDelete) return;
      await API.deleteAction({ companyId, actionId: actionToDelete });
      fetchActionData(searchData);
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setDeleting(false);
      deleteModelRef?.current?.close();
    }
  };

  const onClickDeleteOption = (actionId: string) => {
    deleteModelRef.current.open();
    setActionToDelete(actionId);
  };

  const sortedMeetings = useMemo(
    () => lodash.orderBy(meetings, meetingsSort),
    [meetingsSort, meetings]
  );

  const onSelectMeeting = (e: any, meetingId: string) => {
    if (e.target.checked) {
      setSelectedMeetingIds((prevSelectedMeetings) => [
        ...prevSelectedMeetings,
        meetingId,
      ]);
    } else {
      setSelectedMeetingIds((prevSelectedMeetings) =>
        prevSelectedMeetings.filter((id) => id !== meetingId)
      );
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      setDeletingMeeting(true);
      if (!companyId) return;
      if (selectedMeetingIds?.length > 5) {
        Toast.error("Please select upto 5 meetings.");
        return;
      }
      await API.deleteMeeting({ companyId, meetingIds: selectedMeetingIds });
      Toast.success("Meeting Deleted Successfully.");
      fetchMeetingData();
    } catch (error: any) {
      Toast.error(error.message || "Something went wrong.");
    } finally {
      deleteMeetingModelRef.current.close();
      setDeletingMeeting(false);
      setSelectedMeetingIds([]);
    }
  };

  const onChange = (key: string) => {
    setInputValue({})
    if (key === "current") {
      setTabId("current");
      setSearchData(["in-progress", "not-started"]);
    } else if (key === "abandoned") {
      setTabId("abandoned");
      setSearchData(["abandoned"]);
    } else if (key === "completed") {
      setTabId("completed");
      setSearchData(["completed"]);
    }
  };
  const handleFilter = () => {
    setFilter((prev) => !prev);
  };

  const handleInputchange = (key: string, value: any) => {
    setInputValue({
      ...inputvalue,
      [key]: value,
    });
  };

  const applyFilter = () => {
    fetchActionData(searchData);
  };

  const clearFilters = () => {
    setInputValue({
      meeting: null,
      owner: null,
      startDate: null,
      endDate: null,
    });
    clearFetchActionData(searchData);
  };

  const meetingOptions = useMemo(
    () =>
      meetings.map((item) => ({
        label: `${item.name}`,
        value: item.id,
      })),
    [meetings]
  );


  const TABS: TabsProps["items"] = [
    {
      key: "current",
      label: "Current",
      children: (
        <TableComponent
          actions={actions}
          initingActions={initingActions}
          viewActionModalRef={viewActionModalRef}
          viewLogModalRef={viewLogModalRef}
          addActionModalRef={addActionModalRef}
          filter={filter}
          handleFilter={handleFilter}
          applyFilter={applyFilter}
          clearFilters={clearFilters}
          meetingOptions={meetingOptions}
          onClickDeleteOption={onClickDeleteOption}
          editActionModalRef={editActionModalRef}
          editStatusModalRef={editStatusModalRef}
          inputvalue={inputvalue}
          handleInputchange={handleInputchange}
          actionsSort={actionsSort}
          setActionsSort={setActionsSort}
        />
      ),
    },
    {
      key: "completed",
      label: "Completed",
      children: (
        <TableComponent
          actions={actions}
          initingActions={initingActions}
          viewActionModalRef={viewActionModalRef}
          viewLogModalRef={viewLogModalRef}
          addActionModalRef={addActionModalRef}
          filter={filter}
          handleFilter={handleFilter}
          applyFilter={applyFilter}
          clearFilters={clearFilters}
          meetingOptions={meetingOptions}
          onClickDeleteOption={onClickDeleteOption}
          editActionModalRef={editActionModalRef}
          editStatusModalRef={editStatusModalRef}
          inputvalue={inputvalue}
          handleInputchange={handleInputchange}
          actionsSort={actionsSort}
          setActionsSort={setActionsSort}
        />
      ),
    },
    {
      key: "abandoned",
      label: "Abandoned",
      children: (
        <TableComponent
          actions={actions}
          initingActions={initingActions}
          viewActionModalRef={viewActionModalRef}
          viewLogModalRef={viewLogModalRef}
          addActionModalRef={addActionModalRef}
          filter={filter}
          handleFilter={handleFilter}
          applyFilter={applyFilter}
          clearFilters={clearFilters}
          meetingOptions={meetingOptions}
          onClickDeleteOption={onClickDeleteOption}
          editActionModalRef={editActionModalRef}
          editStatusModalRef={editStatusModalRef}
          inputvalue={inputvalue}
          handleInputchange={handleInputchange}
          actionsSort={actionsSort}
          setActionsSort={setActionsSort}
        />
      ),
    },
  ];

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container className='meeting_table'>
        <Typography size="enormous" bold>
          Welcome back, <span>{userName}</span>
        </Typography>
        <Space size={25} />
        {((userAccess?.accessLevel?.toLowerCase() ===
          COMPANY_USER_ACCESS_LEVEL.ADMIN?.toLowerCase()) ||
          (userAccess?.accessLevel?.toLowerCase() ===
            COMPANY_USER_ACCESS_LEVEL.OWNER?.toLowerCase()) || (
          userAccess?.accessLevel?.toLowerCase() ===
            COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER?.toLowerCase()
        )) && (
          <>
            <Tabs
              defaultActiveKey={tabId}
              items={TABS}
              onChange={onChange}
              type="card"
            />
            <Space size={25} />
            <Space size={24} />
          </>
        )}
        <FlexBox className={styles.customTable} flexDirection="column">
          <FlexBox alignItems="center" justifyContent="space-between" flex={1}>
            <Typography size="giant">Meetings</Typography>
            <FlexBox alignItems="center">
              <Typography>Sort by:</Typography>
              <Space horizontal size={16} />
              <Select
                allowClear
                className={styles.sortSelect}
                size="large"
                bordered
                placeholder="Select"
                options={SORT_MEETINGS_OPTIONS}
                onChange={setMeetingsSort}
              />
              <Space horizontal size={24} />
              <Space size={24} horizontal />
              <Clickable
                onClick={() => {
                  if (selectedMeetingIds?.length > 0) {
                    deleteMeetingModelRef.current.open();
                  } else {
                    Toast.warning("Please Select Meeting!");
                  }
                }}
              >
                <Icon name="delete-icon" size={24} />
              </Clickable>
              <Space size={32} horizontal />
              <AddButton onClick={() => addMeetingModalRef.current.open()} />
            </FlexBox>
          </FlexBox>
          <Space size={50} />
          <FlexBox className={styles.recordHeader} alignItems="center">
            <FlexBox flex={1.5} zeroMinWidth>
              <Typography gray>Name</Typography>
            </FlexBox>
            <FlexBox flex={1}>
              <Typography gray>Type</Typography>
            </FlexBox>
            <FlexBox flex={1}>
              <Typography gray>Meeting Date And Time</Typography>
            </FlexBox>
            <FlexBox flex={1}>
              <Typography gray>Link to Meeting Pack</Typography>
            </FlexBox>
            <FlexBox className={styles.statusCell}>
              <Typography gray>Status</Typography>
            </FlexBox>
          </FlexBox>
          <ConfirmDelete
            ref={deleteMeetingModelRef}
            handleConfirm={handleDeleteMeeting}
            loading={deletingMeeting}
            message={"Are you sure you want to delete the meeting?"}
          />
          <Space size={18} />
          {initingMeetings ? (
            <Loading size="small" />
          ) : (
            sortedMeetings.map((meeting) => {
              let meetingType = "Other";
              const type = MEETING_TYPES.filter(
                (type) => type.value === meeting.type
              );
              if (type?.length) {
                meetingType = type[0].label;
              }
              return (
                <Fragment key={meeting.id}>
                  <Clickable
                    className={styles.recordItem}
                    onClick={() => {
                      if (meeting?.status === "open") {
                        router.push(
                          `/dashboard/meeting-and-track-targets/${meeting.id}/status/started`
                        );
                      } else if (meeting?.status === "closed") {
                        router.push(
                          `/dashboard/meeting-and-track-targets/${meeting.id}/status/ended`
                        );
                      } else {
                        router.push(
                          `/dashboard/meeting-and-track-targets/${meeting.id}/status/planned`
                        );
                      }
                    }}
                  >
                    <FlexBox flex={1.5} zeroMinWidth>
                      <FlexBox alignItems="center" flex={1} zeroMinWidth>
                        <Checkbox
                          checked={selectedMeetingIds.includes(meeting.id)}
                          onChange={(e) => onSelectMeeting(e, meeting.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Space size={16} horizontal />
                        <Typography size="huge" ellipsis>
                          {meeting.name}
                        </Typography>
                        <Space size={5} horizontal />
                      </FlexBox>
                    </FlexBox>
                    <FlexBox flex={1}>
                      <Typography size="large">{meetingType}</Typography>
                    </FlexBox>
                    <FlexBox flex={1}>
                      <Typography size="large" gray>
                        {dayjs(meeting.date).format("MMM DD YYYY h:mm a")}
                      </Typography>
                    </FlexBox>
                    <FlexBox flex={1}>
                      <Clickable
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/dashboard/meeting-and-track-targets/${meeting.id}/meeting-pack`
                          );
                        }}
                      >
                        <Typography primary size="large">
                          {" "}
                          Meeting Pack
                        </Typography>
                      </Clickable>
                    </FlexBox>
                    <FlexBox className={styles.statusCell} alignItems="center">
                      <Status
                        color={
                          meeting.status === "planned"
                            ? "green"
                            : meeting.status === "open"
                              ? dayjs(meeting.date) < dayjs(new Date()).subtract(3, 'day') ? "red" : 'yellow'
                              : "white"
                        }
                        title={lodash.upperFirst(meeting.status)}
                        className={styles.statusWidth}
                      />
                    </FlexBox>
                  </Clickable>
                  <Space size={24} />
                </Fragment>
              );
            })
          )}
        </FlexBox>
        <Space size={25} />
      </Container>
      <AddMeetingModal onSuccess={fetchMeetingData} ref={addMeetingModalRef} />
      <ViewActionModal handleEdit={handleEdit} ref={viewActionModalRef} />
      <ViewLogsModal ref={viewLogModalRef} />
      <AddActionModal
        isEdit={true}
        ref={editActionModalRef}
        onSuccess={fetchActionData}
        searchData={searchData}
      />
      <UpdateStatusModal
        isEdit={true}
        ref={editStatusModalRef}
        onSuccess={fetchActionData}
        searchData={searchData}
      />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteAction}
        loading={deleting}
        message={"Are you sure you want to delete the action?"}
      />
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
