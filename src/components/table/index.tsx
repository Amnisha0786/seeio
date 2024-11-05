import React, { useCallback, Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import { Checkbox, Pagination, PaginationProps, Radio } from 'antd'
import lodash from 'lodash'

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Icon from '@/components/icon'
import Space from '@/components/space'
import Loading from '@/components/loading'
import Button from '@/components/button'
import styles from './table.module.scss'

export type TColumn<T> = {
  key?: string
  title?: string
  width?: number
  justifyContent?: "center" | "flex-start" | undefined;
  noPadding?: boolean
  render?: (record: T) => React.ReactNode
}

type TSubTable = {
  title?: string
  headerRight?: React.ReactNode
  expandedItemKey?: string | number | null
  columns: TColumn<any>[]
  accessKey?: string
  allowSelect?: boolean
}

interface IProps<T> {
  className?: string
  title?: string
  tabElement?: any
  headerRight?: React.ReactNode
  headerBottom?: React.ReactNode
  items: T[]
  rowKey?: keyof T
  columns: TColumn<T>[]
  allowSelect?: boolean
  onRowClick?: (record: T) => void
  onRowSelect?: (record: T | string, checked: boolean) => void
  loading?: boolean
  showTableHeaders?: boolean
  showToolbar?: boolean
  selectedItemKeys?: (keyof T)[]
  subTable?: TSubTable
  disabledRecord?: string
  disableKey?: string
  id?: string
  pagination?: boolean
  tabs?: string[]
  onTabClick?: (e?: any) => void
  currentTab?: number
  noDataProps?: {
    title?: string
    actionButton?: {
      title: string
      onClick: () => void
    }
  }
}

const Table = <T extends object>({
  className,
  title,
  tabElement,
  headerRight,
  headerBottom,
  tabs,
  onTabClick,
  currentTab,
  columns,
  items = [],
  rowKey,
  allowSelect,
  onRowClick,
  onRowSelect,
  loading,
  showTableHeaders = true,
  subTable,
  selectedItemKeys: propSelectedItemKeys,
  showToolbar = true,
  noDataProps,
  disabledRecord,
  disableKey,
  id,
  pagination
}: IProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false)
  const [selectedItemKeys, setSelectedItemKeys] = useState<(keyof T)[]>([])

  useEffect(() => {
    if (propSelectedItemKeys) {
      onRowSelect && onRowSelect("selectAll", isSelectedAll)
    } else {
      if (isSelectedAll) {
        setSelectedItemKeys(items.map((item: any) => item[rowKey]))
      } else {
        setSelectedItemKeys([])
      }
    }
    // eslint-disable-next-line
  }, [isSelectedAll])

  const renderCell = useCallback((value: any) => {
    return lodash.isString(value) ? (
      <Typography>
        {value}
      </Typography>
    ) : value
  }, [])

  const renderHeader = useCallback((paramColumn: TColumn<any>[], paramSubTable?: TSubTable) => {
    return (
      <FlexBox
        className={styles.row}
      >
        {(subTable && !paramSubTable ? subTable.allowSelect : allowSelect) && (
          <FlexBox
            className={styles.cell}
            alignItems="center"
          >
            <Checkbox
              checked={isSelectedAll}
              onChange={(e) => setIsSelectedAll(e.target.checked)}
            />
          </FlexBox>
        )}
        {paramColumn.map((column: any, columnIndex: number) => {
          return (
            <FlexBox
              key={columnIndex}
              className={classnames(styles.cell, styles.th, column.noPadding && styles.noPadding)}
              flex={!column.width && 1}
              width={column.width}
              alignItems="center"
              justifyContent={column?.justifyContent || ""}
            >
              {renderCell(column.title)}
            </FlexBox>
          )
        })}
      </FlexBox>
    )
  }, [subTable, isSelectedAll, renderCell, allowSelect])

  const renderRow = useCallback((item: any, index: number, paramColumns: TColumn<any>[], paramSubTable?: TSubTable) => {
    return (
      <Fragment key={rowKey ? item[rowKey] : index}>
        <FlexBox
          className={classnames(styles.row, { [styles.canClick]: !!onRowClick })}
          onClick={onRowClick ? () => onRowClick(item) : undefined} id={id}
        >
          {(subTable && !paramSubTable ? subTable.allowSelect : allowSelect) && (
            <FlexBox
              className={styles.cell}
              alignItems="center"
            >
              <Checkbox
                checked={propSelectedItemKeys ? propSelectedItemKeys.includes(item[rowKey]) : selectedItemKeys.includes(item[rowKey])}
                onClick={e => e.stopPropagation()}
                disabled={disableKey ? item[disableKey] === disabledRecord : false}
                onChange={(e) => {
                  if (propSelectedItemKeys) {
                    onRowSelect && onRowSelect(item, e.target.checked)
                  } else {
                    if (e.target.checked) {
                      setSelectedItemKeys(selectedItemKeys.concat(item[rowKey]))
                    } else {
                      setSelectedItemKeys(selectedItemKeys.filter(i => i !== item[rowKey]))
                    }
                  }
                }}
              />
            </FlexBox>
          )}
          {paramColumns.map((column, columnIndex) => (
            <FlexBox
              key={columnIndex}
              className={classnames(styles.cell, column.noPadding && styles.noPadding)}
              flex={!column.width && 1}
              width={column.width}
              alignItems="center"
              justifyContent={column?.justifyContent || undefined}
            >
              {renderCell(column.render ? column.render(item) : column.key ? item[column.key] : null)}
            </FlexBox>
          ))}
        </FlexBox>
        {paramSubTable && paramSubTable.expandedItemKey === (rowKey ? item[rowKey] : index) && (
          <FlexBox flexDirection="column" className={styles.subTable}>
            <FlexBox className={styles.header} justifyContent="space-between">
              <FlexBox alignItems="center">
                <Typography size="huge">{paramSubTable.title}</Typography>
              </FlexBox>
              <FlexBox alignItems="center">
                {paramSubTable.headerRight}
              </FlexBox>
            </FlexBox>
            <FlexBox className={styles.body} flexDirection="column">
              {renderHeader(paramSubTable.columns)}
              {item[paramSubTable.accessKey || "items"]?.map((item: any, childIndex: number) => renderRow(item, childIndex, paramSubTable.columns))}
            </FlexBox>
          </FlexBox>
        )}
      </Fragment>
    )
  }, [subTable, selectedItemKeys, onRowSelect, propSelectedItemKeys, renderCell, onRowClick, rowKey, allowSelect, renderHeader])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a className={styles.pages}>Prev</a>;
    }
    if (type === 'next') {
      return <a className={styles.pages}>Next</a>;
    }
    return originalElement;
  };

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={items?.length}
        onChange={handlePageChange}
        itemRender={itemRender}
        hideOnSinglePage={true}
      />
    );
  }, [items, currentPage, pageSize])

  return (
    <>
      <FlexBox className={classnames(styles.table, className)} flexDirection="column">
        {showToolbar && (
          <FlexBox className={styles.header} justifyContent="space-between">
            <FlexBox alignItems="center">
              {title && <Typography size="huge">{title}</Typography>}
              {tabElement}
            </FlexBox>
            <FlexBox alignItems="center">
              {headerRight}
            </FlexBox>
          </FlexBox>

        )}
        {headerBottom && (
          <FlexBox className={styles.header} justifyContent="space-between">
            <FlexBox alignItems="center">
              <Radio.Group onChange={onTabClick} defaultValue={1} style={{ marginBottom: 8 }}>
                {tabs?.map((tab: string, index) => (
                  <Radio.Button value={index + 1} className={styles.radio} key={index}>{tab}</Radio.Button>
                ))}
              </Radio.Group>
            </FlexBox>
            <FlexBox alignItems="center">
              {headerBottom}
            </FlexBox>
          </FlexBox>)}
        <FlexBox className={styles.body} flexDirection="column">
          {showTableHeaders && renderHeader(columns, subTable)}
          {Array.isArray(items) && items?.map((item, index) => renderRow(item, index, columns, subTable))}
          {(items.length === 0 && !loading && noDataProps) && (
            <FlexBox flexDirection="column" alignItems="center">
              <Space size={50} />
              <Icon name="white-file" size={60} />
              <Space size={16} />
              <Typography color="#005F73" size="giant" bold>
                {noDataProps.title || 'No data'}
              </Typography>
              {noDataProps.actionButton && (
                <>
                  <Space size={16} />
                  <Button type="primary" onClick={noDataProps.actionButton.onClick}>
                    {noDataProps.actionButton.title}
                  </Button>
                </>
              )}
              <Space size={50} />
            </FlexBox>
          )}
          {loading && (
            <FlexBox className={styles.loading}>
              <Loading size="small" />
            </FlexBox>
          )}
        </FlexBox>
      </FlexBox>
      {pagination && <><Space size={14} />
        <FlexBox>
          {renderPagination()}
        </FlexBox>
      </>}
    </>
  )
}

export default Table
