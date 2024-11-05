import React, { useMemo, useState } from 'react'
import { Input, Select } from 'antd'
import { SearchOutlined } from "@ant-design/icons";

import Table from '@/components/table';
import styles from './page.module.scss'
import Space from '@/components/space';
import Typography from '@/components/typography';
import { SORT_OPTIONS } from '@/constants';

interface IProps {
  title: string
  onRowClick?: (row: any) => void;
  data: any[];
  initing: boolean;
  columns: any[];
  showTableHeaders?: boolean
}

const TableWithControls = ({
  title,
  columns,
  data,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRowClick = () => { },
  initing = false,
  showTableHeaders
}: IProps) => {
  const [search, setSearch] = useState("")
  const [selectedSortValue, setSelectedSortValue] = useState<string>("");

  const parsedData = useMemo(() => {
    if (!data) return [];
    let newData = [...data];

    newData = newData.filter(item => item?.name?.toLowerCase().includes(search.trim().toLowerCase()))
    if (selectedSortValue) {
      if (selectedSortValue === SORT_OPTIONS.NAME) {
        newData = newData.sort(function (current, accumulator) {
          if (current?.name?.toLocaleLowerCase() < accumulator?.name?.toLocaleLowerCase()) { return -1; }
          if (current?.name?.toLocaleLowerCase() > accumulator?.name?.toLocaleLowerCase()) { return 1; }
          return 0;
        })
      } else {
        newData = newData.sort(function (current, accumulator) {
          if (new Date(current?.appointed_on).getTime() < new Date(accumulator?.appointed_on).getTime()) { return 1; }
          if (new Date(current?.appointed_on).getTime() > new Date(accumulator?.appointed_on).getTime()) { return -1; }
          return 0;
        })
      }
    }
    return newData;
  }, [data, search, selectedSortValue])

  return (
    <>
      <Table
        rowKey="id"
        title={title}
        columns={columns}
        items={parsedData}
        className={styles.tableaddCompany}
        onRowClick={onRowClick}
        loading={initing}
        showTableHeaders={showTableHeaders}
        headerRight={
          <>
            <Input
              allowClear
              className={styles.searchInput}
              bordered
              size="large"
              placeholder="Type to search..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Space horizontal size={35} />
            <Typography gray>Sort by:</Typography>
            <Space horizontal size={16} />
            <Select
              allowClear
              className={styles.sortSelect}
              size="large"
              bordered
              placeholder="Select"
              options={[
                {
                  label: "Date of Appointment",
                  value: SORT_OPTIONS.RECENTLY,
                },
                {
                  label: "Name",
                  value: SORT_OPTIONS.NAME,
                },
              ]}
              onChange={setSelectedSortValue}
            />
          </>
        }
      />
    </>
  )
}

export default TableWithControls