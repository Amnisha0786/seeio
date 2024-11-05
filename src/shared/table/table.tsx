"use client";

import { Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import Typography from "@/components/typography";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Clickable from "@/components/clickable";
import Table from "@/components/table";
import styles from "./table.module.scss";
import { SORT_OPTIONS } from '@/constants';

interface TProps {
  title: string;
  onRowClick?: (row: any) => void;
  data: any[];
  initing: boolean;
  search: string;
  selectedSortValue?: string | undefined;
  setSearch: (newValue: string) => void;
  setSelectedSortValue?: (newValue: string) => void;
  handleDelete?: () => void;
  columns: any[];
  showTableHeaders?: boolean
  showDeleteIcon?: boolean
  id?: string;
}

const TableWithHeaderControls = ({
  title,
  onRowClick,
  data,
  initing,
  search,
  setSearch,
  columns,
  showTableHeaders,
  selectedSortValue,
  setSelectedSortValue,
  handleDelete,
  id,
  showDeleteIcon = false
}: TProps) => {
  return (
    <>
      <div className={styles.table}>
        <Table
          rowKey="id"
          // allowSelect
          id={id}
          title={title}
          columns={columns}
          items={data}
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
                value={selectedSortValue}
                onChange={setSelectedSortValue}
                options={[{
                  label: "Recently",
                  value: SORT_OPTIONS.RECENTLY
                }, {
                  label: "Name",
                  value: SORT_OPTIONS.NAME
                }]}
              />
              {/* <Space horizontal size={35} />
              <Clickable>
                <Typography gray size="large">
                  Select All
                </Typography>
              </Clickable>
              */}
              {showDeleteIcon && (
                <>
                  <Space horizontal size={24} />
                  <Clickable onClick={handleDelete}>
                    <Icon name="gray-delete-icon" size={24} />
                  </Clickable>
                </>
              )}
            </>
          }
        />
      </div>
    </>
  );
};

export default TableWithHeaderControls;
