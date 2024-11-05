"use client"

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { Dropdown, Select } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';

import Table from "@/components/table";
import Clickable from "@/components/clickable";
import Space from "@/components/space";
import { TColumn } from '@/components/table'
import Icon from "@/components/icon";
import * as API from '@/api'
import styles from './page.module.scss'
import { useAuthenticatedUser, useSelectedAccountCompany } from '@/hooks'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import ConfirmDelete from '@/shared/confirm-delete'
import Toast from '@/components/toast'
import AddButton from '@/components/add-button'
import StatusDot from '@/components/status-dot'
import Container from '@/components/container'
import ScollablePage from '@/components/scollable-page'
import { TAction, TMeeting } from '@/models'
import { INDICATOR_STATUS } from '../business-health/corporate-objectives/add-action-form'
import AddActionModal from '../meeting-and-track-targets/add-action-modal'
import PeopleSelect from '@/shared/people-select';

const ActionsReport = () => {
  const [initing, setIniting] = useState(false)
  const [data, setData] = useState<TAction[]>()
  const [selectedItemKeys, setSelectedItemKeys] = useState<any>([])
  const [deleting, setDeleting] = useState(false)
  const addActionModalRef = useRef<any>();
  const editActionModalRef = useRef<any>();
  const [actionsSort, setActionsSort] = useState<'company' | 'user'>('company');
  const [statusSort, setStatusSort] = useState([]);
  const deleteModelRef = useRef<any>();
  const [actionToDelete, setActionToDelete] = useState('');
  const user = useAuthenticatedUser()
  const [filter, setFilter] = useState(false)
  const [meetings, setMeetings] = useState<TMeeting[]>([]);
  const companyId = useSelectedAccountCompany()?.companyId
  const [meeting, setMeeting] = useState<string>()
  const [owner, setOwner] = useState<string>()


  const handleFilter = () => {
    setFilter((prev) => !prev)
  }

  const fetchActionData = async () => {
    try {
      if (!companyId) return;

      const payload: any = {
        companyId,
        status: JSON.stringify(statusSort)
      }

      if (actionsSort) {
        payload["linkType"] = actionsSort
      }
      if (meeting) {
        payload["meetingId"] = meeting
      }

      if (owner) {
        payload["ownerId"] = owner
      }
      setIniting(true);
      const result = await API.getActions(payload);
      setData(result);
    } catch (err) {
      Toast.error("Something went wrong.")
    } finally {
      setIniting(false);
    }

  }

  useEffect(() => {
    fetchActionData()
  }, [statusSort, meeting, owner, companyId])

  const onClickDeleteOption = (actionId: string) => {
    deleteModelRef.current.open();
    setActionToDelete(actionId);
  };

  const handleRowSelect = (select: any, checked: boolean) => {
    if (select == "selectAll") {
      if (checked) {
        setSelectedItemKeys(data?.map((item) => item?.id))
      } else {
        setSelectedItemKeys([])
      }
    } else {
      const updatedKeys = checked
        ? [...selectedItemKeys, select?.id]
        : selectedItemKeys?.filter((key: any) => key !== select?.id);
      setSelectedItemKeys(updatedKeys);
    }
  }

  const deleteAction = async () => {
    try {
      setDeleting(true);
      if (!companyId || !actionToDelete) return;
      await API.deleteAction({ companyId, actionId: actionToDelete });
      fetchActionData();
    } catch (err: any) {
      Toast.error(err.message || 'Something went wrong.');
    } finally {
      setDeleting(false);
      deleteModelRef?.current?.close();
    }
  };

  const fetchMeetingData = useCallback(async () => {
    setIniting(true);

    try {
      if (!companyId) return;

      const result = await API.getMeetings({ companyId });
      setMeetings(result.meetings);
    } catch (err: any) {
      Toast.error(err.message || 'Something went wrong.');
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchMeetingData()
  }, [fetchMeetingData]);

  const columns = useMemo<TColumn<TAction>[]>(() => ([{
    key: "owner",
    title: "Owner",
    width: 253.5,
    render: (record) => record?.owner?.firstName + " " + record?.owner?.lastName
  }, {
    key: "id",
    title: "Id",
    width: 253.5,
  }, {
    key: "dueDate",
    title: "Due by Date",
    width: 253.5,
    render: (record) => dayjs(record.dueDate).format('MMM DD YYYY'),
  }, {
    key: "name",
    title: "Meeting",
    width: 253.5,
  },
  {
    key: "status",
    title: "Status",
    width: 106,
    render: (record) => <StatusDot color={
      record.status === INDICATOR_STATUS.COMPLETED ?
        "green"
        : record.status === INDICATOR_STATUS.NOT_STARTED ?
          "red" : "yellow"
    } />,
  },
  {
    key: 'dropdown',
    width: 100,
    render: (record) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown
          menu={{
            items: [
              {
                label: 'Edit',
                key: '1',
                onClick: () => editActionModalRef.current.open(record),
              },
              {
                label: 'Delete',
                key: '2',
                onClick: () => onClickDeleteOption(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Clickable
            className={styles.optionButton}
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisOutlined />
          </Clickable>
        </Dropdown>
      </div>
    ),
  },
  ]), [])

  const clearFilters = () => {
    setStatusSort([])
    setMeeting("")
    setOwner("")
  }

  const meetingOptions = useMemo(() => meetings.map(item => ({
    label: `${item.name}`,
    value: item.id,
  })), [meetings])

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <div className={styles.page}>
          <Table
            rowKey='id'
            title="Board Actions report"
            columns={columns}
            items={data || []}
            loading={initing}
            noDataProps={{
              title: 'There are no Actions yet',
              actionButton: {
                title: 'Add new Action',
                onClick: () => addActionModalRef.current.open(),
              },
            }}
            onRowSelect={handleRowSelect}
            selectedItemKeys={selectedItemKeys}
            disabledRecord={user?.email}
            disableKey={"email"}

            headerRight={(
              <>
                <Clickable className={`${styles.filterIcon} ${filter ? styles.filterActive : ""}`} onClick={() => {
                  handleFilter()
                }}>
                  <Icon name="filterIcon" className={styles.filterIconSize} />
                </Clickable>
                <Space horizontal size={24} />

                <Select
                  mode="multiple"
                  className={styles.sortCompanySelect}
                  options={[{
                    label: 'Completed',
                    value: 'completed',
                  },
                  {
                    label: 'Pending',
                    value: 'in-progress',
                  },
                  ]}
                  size="middle"
                  placeholder="Enter here"
                  onChange={setStatusSort}
                  value={statusSort}
                />
                <Space horizontal size={24} />

                <Button
                  onClick={clearFilters}
                  className={styles.clearBtn}>Clear</Button>
              </>
            )}
            headerBottom={
              filter && (

                <FlexBox alignItems='center' >
                  <Space horizontal size={62} />

                  <PeopleSelect
                    className={styles.userActionSelect}
                    size='large'
                    bordered
                    allowClear
                    placeholder='Select owner'
                    value={owner}
                    onChange={setOwner}
                  />

                  <Space horizontal size={38} />

                  <Select
                    className={styles.sortSelect}
                    size='large'
                    bordered
                    allowClear
                    placeholder='Select meeting'
                    value={meeting}
                    options={meetingOptions}
                    onChange={setMeeting}
                  />
                </FlexBox>
              )
            }

          />
          <Space size={50} />
          <FlexBox justifyContent="flex-end">
            <AddButton onClick={() => addActionModalRef.current.open()} />
          </FlexBox>


        </div>
      </Container>
      <AddActionModal onSuccess={fetchActionData} ref={addActionModalRef} />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteAction}
        loading={deleting}
        message={'Are you sure you want to delete the action?'}
      />
      <AddActionModal
        isEdit={true}
        ref={editActionModalRef}
        onSuccess={fetchActionData}
      />
    </ScollablePage >
  )
}

export default ActionsReport;

