"use client"

import { useState,  useMemo } from 'react'
import { Select, Dropdown, Input } from 'antd'
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd';
import Image from 'next/image'
import moment from 'moment'

import Typography from '@/components/typography'
import Space from '@/components/space'
import Clickable from '@/components/clickable'
import GlobalBreadcrumbs from '../global-breadcrumbs';
import Table, { TColumn } from '@/components/table'
import { TStorageObject } from '@/models'
import styles from './page.module.scss'
import { SORT_OPTIONS } from '@/constants';

const actionOptions: MenuProps['items'] = [{
  label: "Update",
  key: '0',
}, {
  label: "Delete",
  key: '1',
}];

interface IProps {
  data: any[],
  title: string
  initing: boolean
  onRowClick: (record: TStorageObject) => void
}

const FolderView = ({
  data,
  title,
  initing,
  onRowClick,
}: IProps) => {

  const [search, setSearch] = useState("")
  const [selectedSortValue, setSelectedSortValue] = useState<string>("");

  const parsedData = useMemo(() => {
    if (!data) return [];
    let newData = [...data];
    
    newData = newData.filter(item => item.name.toLowerCase().includes(search.trim().toLowerCase()))
    if (selectedSortValue) {
      if (selectedSortValue === SORT_OPTIONS.NAME) {
        newData = newData.sort(function (current, accumulator) {
          if (current.name.toLocaleLowerCase() < accumulator.name.toLocaleLowerCase()) { return -1; }
          if (current.name.toLocaleLowerCase() > accumulator.name.toLocaleLowerCase()) { return 1; }
          return 0;
        })
      } else {
        newData = newData.sort(function (current, accumulator) {
          if (new Date(current.dateCreated).getTime() < new Date(accumulator.dateCreated).getTime()) { return 1; }
          if (new Date(current.dateCreated).getTime() > new Date(accumulator.dateCreated).getTime()) { return -1; }
          return 0;
        })
      }
    }
    return newData;
  }, [data, search, selectedSortValue])

  const columns = useMemo<TColumn<TStorageObject>[]>(() => ([{
    key: "type",
    title: "",
    width: 24,
    noPadding: true,
    render: (record) => (
      <Image
        src={`/icons/gray-${record.type ?? "document"}-icon.svg`}
        alt="icon"
        width={24}
        height={24}
      />
    )
  }, {
    key: "name",
    title: "Name",
    width: 250,
  }, {
    key: "dateCreated",
    title: "Date",
    render: (record) => (moment(record.dateCreated).format("DD/MM/YYYY"))
  }, {
    key: "description",
    title: "Description",
  }, {
    width: 73,
    render: () => (
      <Dropdown menu={{ items: actionOptions }} trigger={['click']}>
        <Clickable
          className={styles.optionButton}
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisOutlined />
        </Clickable>
      </Dropdown>
    )
  }]), [])

  return (
    <>
      <GlobalBreadcrumbs />
      <Space size={32} />
      <Table
        rowKey="id"
        allowSelect
        title={title}
        columns={columns}
        items={parsedData}
        onRowClick={onRowClick}
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
              onChange={e => setSearch(e.target.value)}
              value={search}
            />
            <Space horizontal size={115} />
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
                value: SORT_OPTIONS.RECENTLY
              }, {
                label: "Name",
                value: SORT_OPTIONS.NAME
              }]}
              onChange={setSelectedSortValue}
            />
          </>
        )}
      />
      <Space size={20} />
    </>
  )
}

export default FolderView