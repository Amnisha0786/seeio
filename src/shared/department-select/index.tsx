import { useEffect, useState, useMemo, useRef } from 'react'
import { Select, SelectProps } from 'antd'

import * as API from '@/api'
import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Space from '@/components/space'
import { useSelectedAccountCompany } from '@/hooks'
import { TDepartment } from '@/models'
import styles from './people-select.module.scss'
import AddDepartmentModal from '@/app/(protected)/add-company/[companyNumber]/add-department-modal'

interface TProps extends SelectProps {
  value?: string
  placeholder?: string
  addNewOption?:string
  onChange?: (id: string) => void
  companyNumber?: string
  selectFirstPerson?: boolean
}

const DepartmentSelect = ({ onChange, value, companyNumber, placeholder = "", addNewOption, selectFirstPerson = false, ...props }: TProps) => {
  const [peoples, setPeoples] = useState<TDepartment[]>([])
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId
  const addPersonModalRef = useRef<any>()

  const peopleoptions = useMemo(() => peoples?.map(item => ({
    label: item.name,
    value: item.id,
  })), [peoples])

  const options = addNewOption ? [...peopleoptions ,{
    label: <div className={styles.addOptionBtn} onClick={()=>{addPersonModalRef.current.open()}}> {`+ Add new ${addNewOption}`}  </div>} ]
    : peopleoptions

  const fetchData = async () => {
    if (!companyId) return

    try {
      setLoading(true)
      let result;
      if (companyNumber) {
        result = await API.getPeoplesByDepartment(companyNumber)
      } else {
        result = await API.getPeoplesByDepartment(companyId)
      }
      if(result?.departments) {
        setPeoples(result?.departments)
        if (selectFirstPerson) {
          onChange?.(result.departments[0].id)
        }
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {

    fetchData()
  }, [companyId, selectFirstPerson])

  return (
    <>
      <Select
        {...props}
        loading={loading}
        onChange={(value) => onChange?.(value)}
        value={loading ? [] : value}
        options={options}
        placeholder={placeholder}
        optionRender={(option) => (
          <FlexBox alignItems="center">
            <Space horizontal size={5} />
            <FlexBox flexDirection="column">
              <Typography size="large">{option.label}</Typography>
            </FlexBox>
          </FlexBox>
        )}
      />
      <AddDepartmentModal
        ref={addPersonModalRef}
        onSuccess={fetchData}
        companyId={companyNumber || companyId}
      />
    </>
  )
}

export default DepartmentSelect
