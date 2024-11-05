"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons'
import { Dropdown, Input, Select } from "antd";
import { useRouter } from 'next/navigation'

import Typography from "@/components/typography";
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import Table, { TColumn } from "@/components/table";
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import * as API from "@/api";
import styles from "./page.module.scss";
import Status from "@/components/status";
import { COMPANY_USER_ACCESS_LEVEL, TMinuteBook } from '@/models'

const Page = () => {
  const [data, setData] = useState<TMinuteBook[]>([]);
  const [initing, setIniting] = useState(true);
  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()
  const router = useRouter()

  const fetchData = useCallback(async () => {
    if (!companyId) return
    setIniting(true);

    try {
      const result = await API.getMinuteBook({ companyId });
      setData(result.minutes);
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<TColumn<TMinuteBook>[]>(() => [{
    key: "meetingName",
    title: "Meeting",
    render: (record) => record?.meeting?.name
  }, {
    key: "dateCreated",
    title: "Date of Minutes",
  }, {
    key: "status",
    title: "Status",
    width: 180,
    render: (record) => (
      <Status
        className={styles.statusBox}
        title={record.status}
      />
    ),
  }, 
  userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER ? {
    width: 73,
    render: () => (
      <Dropdown
        menu={{
          items: [{
            label: "Edit",
            key: '0',
          }, {
            style: { color: "red" },
            label: "Delete",
            key: '1',
          }]
        }}
        trigger={['click']}
      >
        <Clickable
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisOutlined style={{ fontSize: 22 }} />
        </Clickable>
      </Dropdown>
    )
  }:{}], [userAccess]);

  const onRowClick = (record: TMinuteBook) => {
    router.push(`/dashboard/minute-book/${record.meetingId}?breadcrumbs=true`)
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Space size={32} />
        <Table
          rowKey="meetingId"
          allowSelect
          title="Minute Book"
          columns={columns}
          items={data}
          loading={initing}
          onRowClick={onRowClick}
          headerRight={
            <>
              <Input
                allowClear
                className={styles.searchInput}
                bordered
                size="large"
                placeholder="Type to search..."
                prefix={<SearchOutlined />}
              />
              <Space horizontal size={24} />
              <Typography gray>
                Sort by:
              </Typography>
              <Space horizontal size={16} />
              <Select
                allowClear
                className={styles.sortSelect}
                size="large"
                bordered
                placeholder="Select"
                options={[{
                  label: "Recently",
                  value: 1
                }, {
                  label: "Name",
                  value: 2
                }]}
              />
              <Space horizontal size={24} />
              <Clickable>
                <Typography gray size="large">
                  Select All
                </Typography>
              </Clickable>
              <Space horizontal size={24} />
              <Clickable>
                <Icon name="gray-delete-icon" size={24} />
              </Clickable>
            </>
          }
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
