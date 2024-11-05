"use client"

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { Select, Dropdown } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import moment from 'moment'
import Typography from '@/components/typography'
import Table from "@/components/table";
import Clickable from "@/components/clickable";
import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import { TColumn } from '@/components/table'
import * as API from '@/api'
import { COMPANY_USER_ACCESS_LEVEL, TCorporateDirector, TDepartment } from '@/models'
import AddDepartmentModal from '@/app/(protected)/add-company/[companyNumber]/add-department-modal';
import styles from './page.module.scss'
import Confirmable from "@/components/confirmable";
import Loading from '@/components/loading'

const Page = () => {
  const [initing, setIniting] = useState(true)
  const [departments, setDepartments] = useState<TDepartment[]>([])
  const [fetchingCorporates, setFetchingCorporate] = useState(true);
  const [directors, setDirectors] = useState<TCorporateDirector[]>([]);

  const companyId = useSelectedAccountCompany()?.companyId
  const addDepartmentModalRef = useRef<any>()
  const userAccess = useAccessLevel()

  const fetchCorporates = useCallback(async () => {
    if (!companyId) return;

    setFetchingCorporate(true);

    try {
      const result = await API.getCorporateDirectors({
        companyId,
      });

      setDirectors(result);
    } finally {
      setFetchingCorporate(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCorporates();
  }, [companyId]);

  const fetchData = useCallback(async () => {
    if (!companyId) return;

    setIniting(true)

    try {
      const result = await API.getCompanyDepartments({
        companyId
      })

      setDepartments(result.departments)
    } finally {
      setIniting(false)
    }
  }, [companyId]);

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyId])


  const onDeleteDepartment = useCallback(async (departmentId: string) => {
    if (!companyId) return

    const ok = await Confirmable.open({
      content: "Are you sure to delete this deparment?"
    })

    if (!ok) return

    try {
      await API.deleteCompanyDepartment({
        companyId,
        departmentId
      })

      fetchData()
    } finally {
    }
  }, [companyId, fetchData])

  const columns = useMemo<TColumn<TDepartment>[]>(() => ([{
    key: "name",
    title: "Name",
    width: 250,
  }, {
    key: "description",
    title: "Description",
  }, {
    key: "appointedOn",
    title: "Date of Creation",
    render: (record) => (moment(record.createdAt).format("DD/MM/YYYY"))
  }, userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER ? {
    width: 73,
    render: (record) => (
      <Dropdown menu={{
        items: [{
          label: "Edit",
          key: '0',
          onClick: () => addDepartmentModalRef.current.open(record)
        }, {
          label: "Delete",
          key: '1',
          onClick: () => onDeleteDepartment(record.id)
        }]
      }} trigger={['click']}>
        <Clickable
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisOutlined style={{ fontSize: 24 }} />
        </Clickable>
      </Dropdown>
    )
  } : {}]), [onDeleteDepartment, userAccess]);

  const columnsForCorporateEntities = useMemo<TColumn<TCorporateDirector>[]>(
    () => [
      {
        key: "name",
        title: "Name",
      },
      {
        key: "registrationNumber",
        title: "Register number",
      },
      {
        key: "description",
        title: "Registered office",
        render: (record) => record?.registeredOffice?.addressLine1,
      },
    ],
    [directors]
  );


  if (!userAccess) {
    return <Loading size="small" />
  }

  return (
    <div className={styles.page}>
      <Table
        rowKey="id"
        title="Departments"
        columns={columns}
        items={departments}
        loading={initing}
        headerRight={(
          <>
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
          </>
        )}
      />
      <Space size={24} />
      {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <FlexBox justifyContent="flex-end">
        <Button type="primary" onClick={() => addDepartmentModalRef.current.open()}>
          Add Department
        </Button>
      </FlexBox>}
      <AddDepartmentModal
        ref={addDepartmentModalRef}
        onSuccess={fetchData}
        companyId={companyId}
      />
      <Space size={24} />

      <Table
        rowKey="id"
        title="Corporate Entities"
        columns={columnsForCorporateEntities}
        items={directors}
        loading={fetchingCorporates}
        noDataProps={{
          title: "There are no Records yet",
        }}
      />
    </div>
  )
}

export default Page
