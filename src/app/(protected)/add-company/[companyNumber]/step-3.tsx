import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Dropdown } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'

import Typography from "@/components/typography";
import Space from "@/components/space";
import Button from "@/components/button";
import Clickable from "@/components/clickable";
import FlexBox from "@/components/flex-box";
import styles from "./page.module.scss";
import Table, { TColumn } from '@/components/table';
import moment from 'moment';
import Confirmable from "@/components/confirmable";
import Toast from '@/components/toast';
import * as API from '@/api'
import AddPersonModal, { roleOptions } from './add-person-modal';
import Loading from '@/components/loading';
import { TPeople } from '@/models'
import useAmplitudeContext from "@/hooks/amplitude"
import { useAccessLevel } from "@/hooks"
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"

const Step3 = ({ onNext, companyNumber }: { onNext: () => void, companyNumber: string }) => {
  const [loading] = useState(false);
  const [initing, setIniting] = useState(false)
  const [people, setPeople] = useState<TPeople[]>([])
  const addPersonModalRef = useRef<any>()

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url =  typeof window !== 'undefined' ? window.location.href: ""
  const useAccess = useAccessLevel()

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_officers',
      page_url: url,
      user_id: useAccess?.userId && useAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, [])


  const fetchData = useCallback(async () => {

    try {
      setIniting(true)
      const result = await API.getCompanyPeople({
        companyId: companyNumber
      })

      setPeople(result.people)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }, [companyNumber])

  const onDeletePeople = useCallback(async (personId: string) => {
    if (!companyNumber) return

    const ok = await Confirmable.open({
      content: "Are you sure to delete this Person?"
    })

    if (!ok) return

    try {
      await API.deleteCompanyPeople({
        companyId: companyNumber,
        personId
      })

      fetchData()
    } finally {
    }
  }, [companyNumber, fetchData])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyNumber])

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
    key: "dateOfCreation",
    title: "Date of Creation",
    render: (record) => (moment(record.createdAt).format("DD/MM/YYYY"))
  }, {
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
  }]), [onDeletePeople])

  const onSuccess = () => fetchData()

  if (initing) return <Loading size="small" />

  return (
    <>
      <Table
        showToolbar={false}
        columns={columns}
        items={people}
        showTableHeaders
        className={styles.tableaddCompany}
      />
      <Space size={40} />
      <FlexBox justifyContent="space-between">
        <Button onClick={() => addPersonModalRef.current.open()}>
          Add People
        </Button>
        <Button
          type="primary"
          loading={loading}
          className={styles.nextButton}
          onClick={onNext}
        >
          Next
        </Button>
      </FlexBox>

      <AddPersonModal
        ref={addPersonModalRef}
        onSuccess={onSuccess}
        companyId={companyNumber}
      />
    </>
  );
};

export default Step3;
