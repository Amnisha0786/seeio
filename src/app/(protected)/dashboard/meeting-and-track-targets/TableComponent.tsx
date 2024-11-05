import dayjs from "dayjs";
import { EllipsisOutlined } from "@ant-design/icons";

import Clickable from "@/components/clickable";
import FlexBox from "@/components/flex-box";
import Icon from "@/components/icon";
import Space from "@/components/space";
import Table, { TColumn } from "@/components/table";
import PeopleSelect from "@/shared/people-select";
import { DatePicker, Dropdown, Select, Typography } from "antd";
import React, { useMemo } from "react";
import styles from "./page.module.scss";
import { TAction } from "@/models";
import Button from "@/components/button";
import Status from "@/components/status";
import { MEETING_TYPES } from "@/constants"

interface Props {
  actions: TAction[];
  initingActions: boolean;
  viewActionModalRef: any;
  viewLogModalRef: any;
  addActionModalRef: any;
  filter: boolean;
  handleFilter: () => void;
  applyFilter: () => void;
  clearFilters: () => void;
  meetingOptions: any;
  onClickDeleteOption: (actionId: string) => void;
  editActionModalRef: any
  editStatusModalRef: any
  inputvalue: any,
  handleInputchange: (key: string, value: any) => void
  actionsSort: "company" | "user"
  setActionsSort: React.Dispatch<React.SetStateAction<"company" | "user">>
}

const SORT_ACTIONS_OPTIONS = [
  {
    label: "Company",
    value: "company",
  },
  {
    label: "User",
    value: "user",
  },
];

const TableComponent = ({
  actions,
  initingActions,
  viewActionModalRef,
  viewLogModalRef,
  filter,
  handleFilter,
  applyFilter,
  clearFilters,
  meetingOptions,
  onClickDeleteOption,
  editActionModalRef,
  editStatusModalRef,
  inputvalue,
  handleInputchange,
  actionsSort,
  setActionsSort
}: Props) => {

  const getStatusColor = (record: TAction) => {
    let status = {
      label: "Due",
      color: "green"
    }
    if (dayjs(record.dueDate) < dayjs(new Date())) {
      status = {
        label: "Overdue",
        color: "red"
      }
    } else if (dayjs(record.dueDate) < dayjs(new Date()).add(5, 'day')) {
      status = {
        label: "Pending",
        color: "yellow"
      }
    } else {
      status = {
        label: "Due",
        color: "green"
      }
    }
    return status;
  }
  const columns = useMemo<TColumn<TAction>[]>(
    () => [
      {
        key: "name",
        title: "Name",
      },
      {
        key: "dueDate",
        title: "Due by Date",
        render: (record) => dayjs(record.dueDate).format("MMM DD YYYY"),
      },
      {
        key: "type",
        title: "Type",
        render: (record) => {
          let meetingType = "Other";
          const type = MEETING_TYPES.filter(
            (type) => type.value === record?.meeting?.type
          );
          if (type?.length) {
            meetingType = type[0].label;
          }
          return <Typography>{meetingType || '-'}</Typography>},
      },
      {
        key: "meeting",
        title: "Meeting",
        width: 200,
        render: (record) => <>{record.meeting?.name || "-"} </>,
      },
      {
        key: "owner",
        title: "Owner",
        width: 200,
        render: (record) => <>{`${record.owner?.firstName || ""} ${record.owner?.lastName || ""}`} </>,
      },
      {
        key: "state",
        title: "State",
        width: 170,
        justifyContent: "center",
        render: (record) => (
          <Status
            color={getStatusColor(record).color}
            className={styles.statusWidth}
            title={getStatusColor(record).label}
          />
        ),
      },
      {
        key: "dropdown",
        width: 100,
        render: (record) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "0",
                    onClick: () => viewActionModalRef.current.open(record),
                  },
                  {
                    label: "View Logs",
                    key: "2",
                    onClick: () => viewLogModalRef.current.open(record),
                  },
                  {
                    label: "Update Status",
                    key: "3",
                    onClick: () => editStatusModalRef.current.open(record),
                  },
                  {
                    label: "Edit",
                    key: "4",
                    onClick: () => editActionModalRef.current.open(record),
                  },
                  {
                    label: "Delete",
                    key: "5",
                    onClick: () => onClickDeleteOption(record.id),
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
          </div>
        ),
      },
    ],
    []
  );
  return (
    <Table
      className="riskMeetingTable"
      rowKey="id"
      title="Actions before next Meeting..."
      columns={columns}
      items={actions}
      loading={initingActions}
      onRowClick={(record: TAction) => viewActionModalRef.current.open(record)}
      noDataProps={{
        title: "There are no Actions yet",
      }}
      headerRight={
        <>
          <Clickable
            className={`${styles.filterIcon} ${filter ? styles.filterActive : ""
            }`}
            onClick={() => {
              handleFilter();
            }}
          >
            <Icon name="filterIcon" className={styles.filterIconSize} />
          </Clickable>
          <Space horizontal size={24} />

          <FlexBox alignItems="center">
            <Typography>Sort by:</Typography>
            <Space horizontal size={16} />
            <Select
              className={styles.sortSelect}
              size="large"
              bordered
              placeholder="Select"
              value={actionsSort}
              options={SORT_ACTIONS_OPTIONS}
              onChange={setActionsSort}
            />
          </FlexBox>
        </>
      }
      headerBottom={
        filter && (
          <FlexBox alignItems="center">
            <Space horizontal size={62} />

            <FlexBox flex={1} gap={10}>
              <PeopleSelect
                className={styles.optionsSelect}
                size="large"
                bordered
                allowClear
                placeholder="Select owner"
                value={inputvalue?.owner}
                onChange={(val) => {
                  handleInputchange("owner", val);
                }}
              />

              <Select
                size="large"
                className={styles.optionsSelect}
                bordered
                allowClear
                placeholder="Select meeting"
                value={inputvalue?.meeting}
                options={meetingOptions}
                onChange={(val) => {
                  handleInputchange("meeting", val);
                }}
              />

              <DatePicker
                size="large"
                placeholder="Start date"
                value={inputvalue?.startDate}
                format="DD/MM/YYYY"
                onChange={(val) => {
                  handleInputchange("startDate", val);
                }}
              />
              <DatePicker
                size="large"
                placeholder="End date"
                value={inputvalue?.endDate}
                format="DD/MM/YYYY"
                onChange={(val) => {
                  handleInputchange("endDate", val);
                }}
              />

              <Button
                onClick={() => {
                  applyFilter();
                }}
                className={styles.applyBtn}
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                className={styles.clearBtn}
              >
                Clear
              </Button>
            </FlexBox>
          </FlexBox>
        )
      }
    />
  );
};

export default TableComponent;
