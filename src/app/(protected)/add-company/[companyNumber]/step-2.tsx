import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import moment from 'moment';
import { EllipsisOutlined} from '@ant-design/icons'
import Typography from '@/components/typography'
import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import styles from './page.module.scss'
import { TColumn } from '@/components/table';
import TableWithControls from './table';
import * as API from '@/api'
import Toast from '@/components/toast';
import Loading from '@/components/loading';
import { TDepartment } from '@/models'
import AddDepartmentModal from './add-department-modal';
import { Dropdown } from 'antd';
import Clickable from '@/components/clickable';
import Confirmable from '@/components/confirmable';
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks/account';
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

const Step2 = ({ onNext, companyNumber }: { onNext: () => void, companyNumber: string }) => {
  const [initing, setIniting] = useState(false)
  const [departments, setDepartments] = useState<TDepartment[]>([])
  const companyId = useSelectedAccountCompany()?.companyId
  const addDepartmentModalRef = useRef<any>()

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url =  typeof window !== 'undefined' ? window.location.href: ""
  const useAccess = useAccessLevel()
  
  useEffect(()=>{
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, { 
      page_or_modal_name:'signup_departments',
      page_url:url,
      user_id :useAccess?.userId && useAccess?.userId,
      viewed_at : new Date().valueOf(),
      platform:PLATFORM.WEB,
    });
  },[])

  const fetchData = useCallback(async () => {
    setIniting(true)
    try {
      const result = await API.getCompanyDepartments({
        companyId: companyNumber
      })

      setDepartments(result.departments)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }, [companyNumber])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyNumber])

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
  }, {
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
  }]), [onDeleteDepartment]);

  const onSuccess = () => fetchData()

  if (initing) return <Loading size="small" />

  return (
    <>
      <Typography gray size="large" className={styles.stepTWO}>
        Add your employees.
        Roster of employees and key contacts, conveniently linked to your messaging and notification tool, as well as to your HR module (when added).
      </Typography>
      <Space size={24} />
      <TableWithControls
        title='Departments'
        columns={columns}
        data={departments}
        initing={false}
        showTableHeaders
      />
      <Space size={40} />
      <FlexBox justifyContent="space-between">
        <Button
          className={styles.nextButton}
          onClick={() => addDepartmentModalRef.current.open()}
        >
          Add Department
        </Button>
        <Button
          type="primary"
          className={styles.nextButton}
          onClick={onNext}
        >
          Next
        </Button>
      </FlexBox>
      <AddDepartmentModal
        ref={addDepartmentModalRef}
        onSuccess={onSuccess}
        companyId={companyNumber}
      />
    </>
  )
}

export default Step2
