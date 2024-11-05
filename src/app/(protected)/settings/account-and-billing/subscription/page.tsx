"use client"

import React, { useMemo, useEffect, useState } from 'react'
import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import Typography from '@/components/typography'
import Table from "@/components/table";
import Clickable from "@/components/clickable";
import Space from "@/components/space";
import Status from "@/components/status";
import { TColumn } from '@/components/table'
import Icon from "@/components/icon";
import * as API from '@/api'
import styles from './page.module.scss'

const Page = () => {
  const [initing, setIniting] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIniting(true)

      try {
        const result = await API.getSubscription()
        setData(result)
      } finally {
        setIniting(false)
      }
    }

    fetchData()
  }, [])

  const columns = useMemo<TColumn<any>[]>(() => ([{
    key: "name",
    title: "Name",
  }, {
    key: "date",
    title: "Date",
  }, {
    key: "cost",
    title: "Cost",
  }, {
    key: "status",
    title: "Status",
    width: 120,
    render: (record) => (
      <Status title={record.status} />
    )
  }]), [])

  return (
    <div className={styles.page}>
      <Table
        rowKey="id"
        allowSelect
        title="Billing History"
        columns={columns}
        items={data}
        loading={initing}
        headerRight={(
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
        )}
      />
      <Space size={50} />
    </div>
  )
}

export default Page
