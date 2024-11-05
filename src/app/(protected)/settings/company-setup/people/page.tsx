"use client"

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { Select, Input, Dropdown } from 'antd'
import { SearchOutlined, EllipsisOutlined } from '@ant-design/icons'
import moment from 'moment'

import Typography from '@/components/typography'
import Table from "@/components/table";
import Clickable from "@/components/clickable";
import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Confirmable from "@/components/confirmable";
import Button from "@/components/button";
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import { TColumn } from '@/components/table'
import * as API from '@/api'
import { COMPANY_USER_ACCESS_LEVEL, TPeople } from '@/models'
import AddPersonModal, { roleOptions } from '@/app/(protected)/add-company/[companyNumber]/add-person-modal';
import styles from './page.module.scss'
import Loading from '@/components/loading'

const Page = () => {
  const [initing, setIniting] = useState(true)
  const [people, setPeople] = useState<TPeople[]>([])
  const companyId = useSelectedAccountCompany()?.companyId
  const addPersonModalRef = useRef<any>()
  const userAccess = useAccessLevel()

  const fetchData = useCallback(async () => {
    if (!companyId) return

    setIniting(true)

    try {
      const result = await API.getCompanyPeople({
        companyId
      })

      setPeople(result.people)
    } finally {
      setIniting(false)
    }
  }, [companyId])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyId])

  const onDeletePeople = useCallback(async (personId: string) => {
    if (!companyId) return

    const ok = await Confirmable.open({
      content: "Are you sure to delete this Person?"
    })

    if (!ok) return

    try {
      await API.deleteCompanyPeople({
        companyId,
        personId
      })

      fetchData()
    } finally {
    }
  }, [companyId, fetchData])

  const columns = useMemo<TColumn<TPeople>[]>(() => ([{
    key: "name",
    title: "Name",
    width: 250,
    render: (record) => `${record?.firstName} ${record?.lastName}`
  }, {
    key: "email",
    title: "Email",
  }, {
    key: "role",
    title: "Role",
    render: (record) => roleOptions.find(item => item.value === record.role)?.label
  }, {
    key: "createdAt",
    title: "Date Created",
    render: (record) => (moment(record.createdAt).format("DD/MM/YYYY"))
  }, userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER?{
    width: 73,
    render: (record) => (
      <Dropdown menu={{
        items: [{
          label: "Edit",
          key: '0',
          onClick: () => addPersonModalRef.current.open(record)
        }, {
          label: "Delete",
          key: '1',
          onClick: () => onDeletePeople(record.id)
        }]
      }} trigger={['click']}>
        <Clickable
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisOutlined style={{ fontSize: 24 }} />
        </Clickable>
      </Dropdown>
    )
  }:{}]), [onDeletePeople,userAccess])

  
  if(!userAccess){
    return <Loading size="small"/>
  }

  return (
    <div className={styles.page}>
      <Table
        rowKey="id"
        title="People"
        columns={columns}
        items={people}
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
          </>
        )}
      />
      <Space size={24} />
      {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <FlexBox justifyContent="flex-end">
        <Button type="primary" onClick={() => addPersonModalRef.current.open()}>
          Add People
        </Button>
      </FlexBox>}
      <AddPersonModal
        ref={addPersonModalRef}
        onSuccess={fetchData}
        companyId={companyId}
      />
    </div>
  )
}

export default Page
