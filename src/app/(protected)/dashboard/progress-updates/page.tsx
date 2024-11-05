"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Select, Dropdown } from "antd";
import { useRouter } from 'next/navigation'
import dayjs from "dayjs"

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import Button from "@/components/button";
import { useSelectedAccountCompany } from '@/hooks'
import FlexBox from "@/components/flex-box";
import Table, { TColumn } from "@/components/table";
import * as API from "@/api";
import Field from "@/components/field";
import styles from "./page.module.scss";
import Card from "@/components/card";
import Status from "@/components/status";
import { TProgressUpdate } from '@/models'
import Toast from "@/components/toast";
import { PROGRESS_UPDATE_STATUS } from '@/constants';
import PeopleSelect from '@/shared/people-select';

const TYPE_OPTIONS = [{
  label: "Person",
  value: "person",
}, {
  label: "Company",
  value: "company",
}]

const getStatusColor = (status: string) => {
  if (status === PROGRESS_UPDATE_STATUS.OVERDUE) {
    return "red"
  } else if (status === PROGRESS_UPDATE_STATUS.REQUESTED) {
    return "yellow"
  } else if (status === PROGRESS_UPDATE_STATUS.ABANDONED) {
    return "white"
  }
  return "green"
}

const Page = () => {
  const [data, setData] = useState<TProgressUpdate[]>([]);
  const [initing, setIniting] = useState(false);
  const router = useRouter()
  const companyId = useSelectedAccountCompany()?.companyId
  const [typeFilter, setTypeFilter] = useState<"person" | "company" | null>(null)
  const [personIdFilter, setPersonIdFilter] = useState<string>()
  const [selectedItemKeys, setSelectedItemKeys] = useState<any>([])
  const [isAbandoned, setIsAbandoned] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TProgressUpdate[]>()

  const fetchData = useCallback(async ({ filter, personId }: { filter?: "person" | "company" | null, personId?: string | null }) => {
    setIniting(true);

    if (!companyId) return

    try {
      const result = await API.getProgressUpdates({
        companyId,
        ...(filter && { filter }),
        ...(personId && { personId }),
      });
      setData(result);
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData({});
  }, [fetchData]);


  const handleResetFilters = () => {
    setTypeFilter(null)
    setPersonIdFilter("")
    fetchData({});
  }

  const handleApplyFilter = () => {
    fetchData({ filter: typeFilter, personId: personIdFilter })
  }

  const columns = useMemo<TColumn<TProgressUpdate>[]>(() => [{
    key: "owner",
    title: "Owner",
    render: (record) => `${record.owner?.firstName || ''} ${record.owner?.lastName || ''}`
  }, {
    key: "objectiveName",
    title: "Objective",
  }, {
    key: "keyIndicatorName",
    title: "Key Indicator",
  }, {
    key: "deadline",
    title: "Deadline",
    render: (record) => record?.deadline ? dayjs(record.deadline).format("YYYY-MM-DD") : '-'
  }, {
    key: "lastEdited",
    title: "Last Edited",
    render: (record) => record?.lastEdited ? dayjs(record.lastEdited).format("YYYY-MM-DD") : '-'

  }, {
    key: "status",
    title: "Status",
    width: 180,
    justifyContent: "center",
    render: (record) => (
      <Status
        className={styles.statusBox}
        title={record.status}
        color={getStatusColor(record.status)}
      />
    ),
  }, {
    width: 73,
    render: (record) => (
      <Dropdown
        menu={{
          items:
            record?.status !== PROGRESS_UPDATE_STATUS.COMPLETED ? [{
              label: "Edit",
              key: '0',
              onClick: (e) => {
                e.domEvent.stopPropagation()
                router.push(`/dashboard/progress-updates/${record.objectiveId}/${record.id}/edit`)
              }
            },
            // {
            //   label: "Abandoned",
            //   key: '1',
            //   onClick: (e) => {
            //     e.domEvent.stopPropagation()
            //     handleDropdownClick({ status: "abandoned" }, record)
            //   }
            // },
            {
              style: { color: "orange" },
              label: "Send reminder",
              key: '2',
              onClick: (e) => {
                e.domEvent.stopPropagation()
                handleDropdownClick({ sendEmail: "reminder" }, record)
              }
            }
            ] : [{
              label: "Edit",
              key: '0',
              onClick: (e) => {
                e.domEvent.stopPropagation()
                router.push(`/dashboard/progress-updates/${record.objectiveId}/${record.id}/edit`)
              }
            },
              // {
              //   label: "Abandoned",
              //   key: '1',
              //   onClick: (e) => {
              //     e.domEvent.stopPropagation()
              //     handleDropdownClick({ status: "abandoned" }, record)
              //   }
              // }
              // {
              //   style: { color: "red" },
              //   label: "Delete",
              //   key: '1',
              // }
            ]
        }
        }
        trigger={['click']}
      >
        <Clickable
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisOutlined style={{ fontSize: 22 }} />
        </Clickable>
      </Dropdown>
    )
  }], [router, data]);

  const handleDropdownClick = async ({ status, sendEmail }: { status?: string, sendEmail?: string }, record: TProgressUpdate) => {
    try {
      if (!companyId) return
      setIniting(true)
      await API.saveProgressUpdateDetails({
        companyId,
        objectiveId: record?.objectiveId,
        updateId: record?.id,
        status: status,
        sendEmail: sendEmail
      });
      fetchData({});
      Toast.success("updated successfully!")
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }

  const handleAbandonedClick = async () => {
    if (selectedItemKeys?.length > 0) {
      if (!companyId) return

      try {
        setIsAbandoned(true)
        if (selectedItem && selectedItem?.length > 0) {
          const payloadData: API.payloadData[] = []
          selectedItem?.map((item: TProgressUpdate) => payloadData.push({
            objectiveId: item.objectiveId,
            progressUpdateId: item.id
          }))

          await API.abandonedProgressUpdate({
            companyId,
            data: payloadData
          })
          fetchData({});
          Toast.success("Abandoned successfully!")
        }
      } catch (error: any) {
        Toast.error(error?.message || "Something went wrong.")
      } finally {
        setIsAbandoned(false)
      }
    }
  }

  const handleRowSelect = (select: any, checked: boolean) => {

    if (select === "selectAll") {
      if (checked) {
        setSelectedItemKeys(data.map((item) => item?.id))
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

  useEffect(() => {
    const selectedItemArr = data.filter(item => selectedItemKeys.includes(item.id));
    setSelectedItem(selectedItemArr)
  }, [selectedItemKeys, data])


  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Card>
          <FlexBox justifyContent="space-between" alignItems="center">
            <Typography gray size="huge">
              <SearchOutlined size={32} className={styles.searchIcon} /> Advanced Search
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column">
              <Field label="Type">
                <Select
                  size="large"
                  placeholder="Select"
                  options={TYPE_OPTIONS}
                  onChange={setTypeFilter}
                  value={typeFilter}
                  className={styles.personFilter}
                />
              </Field>
            </FlexBox>
            <Space size={20} horizontal />
            <FlexBox>
              {typeFilter === "person" && (
                <Field label='Person'>
                  <PeopleSelect
                    companyNumber={companyId}
                    size='large'
                    allowClear
                    placeholder='Select'
                    onChange={(value) => setPersonIdFilter(value)}
                    value={personIdFilter}
                    className={styles.personFilter}
                  />
                </Field>
              )}
            </FlexBox>
          </FlexBox>
          <Space size={32} />
          <FlexBox justifyContent="flex-end">
            <Button
              className={styles.width10}
              onClick={handleResetFilters}
              disabled={initing}
            >
              Reset
            </Button>
            <Space size={20} horizontal />
            <Button
              type="primary"
              className={styles.width10}
              disabled={initing}
              loading={initing}
              onClick={handleApplyFilter}
            >
              Apply
            </Button>
          </FlexBox>
        </Card>
        <Space size={32} />
        <Table
          rowKey="id"
          allowSelect
          title="Progress Updates"
          columns={columns}
          items={data}
          loading={initing}
          onRowClick={(record) => router.push(`/dashboard/progress-updates/${record.objectiveId}/${record.id}`)}
          onRowSelect={handleRowSelect}
          selectedItemKeys={selectedItemKeys}
          // headerRight={
          //   <>
          //     <Space horizontal size={35} />

          //     <Space horizontal size={35} />
          //     <Clickable>
          //       <Typography gray size="large">
          //         Select All
          //       </Typography>
          //     </Clickable>
          //     <Space horizontal size={24} />
          //     <Clickable>
          //       <Icon name="gray-delete-icon" size={24} />
          //     </Clickable>
          //   </>
          // }
        />
        <Space size={20} />
        <FlexBox justifyContent="flex-end">
          <Button type="primary" loading={isAbandoned} onClick={handleAbandonedClick}>
            Abandoned
          </Button>
          {/* <Space size={20} horizontal />
          <Button type="primary">
            Send reminder
          </Button> */}
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
