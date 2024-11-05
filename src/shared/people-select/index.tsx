import { useEffect, useState, useMemo, use, useRef } from 'react'
import { Select, SelectProps } from 'antd'
import lodash from 'lodash'

import * as API from '@/api'
import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Space from '@/components/space'
import { useSelectedAccountCompany } from '@/hooks'
import { TPeople } from '@/models'
import styles from './people-select.module.scss'
import AddPersonModal from '@/app/(protected)/add-company/[companyNumber]/add-person-modal'

interface TProps extends SelectProps {
  value?: string
  placeholder?: string
  addNewOption?:string
  onChange?: (id: string) => void
  companyNumber?: string
  selectFirstPerson?: boolean
}

const PeopleSelect = ({ onChange, value, companyNumber, placeholder = "",addNewOption, selectFirstPerson = false, ...props }: TProps) => {
  const [peoples, setPeoples] = useState<TPeople[]>([])
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId
  const addPersonModalRef = useRef<any>()

  const peopleoptions = useMemo(() => peoples.map(item => ({
    label: `${item.firstName || ''} ${item.lastName || ''}`,
    value: item.id,
    role: item.role,
    firstName: item.firstName,
    lastName: item.lastName,
  })), [peoples])

  const options = addNewOption ? [...peopleoptions ,{
    label: (
      <div 
        className={styles.addOptionBtn} 
        onClick={()=>{addPersonModalRef.current.open()}}> {`+ Add new ${addNewOption}`}  </div>
    ) ,role : "addNew"} ]
    : peopleoptions

  const fetchData = async () => {
    if (!companyId) return

    try {
      setLoading(true)
      let result;
      if (companyNumber) {
        result = await API.getPeoples(companyNumber)
      } else {
        result = await API.getPeoples(companyId)
      }
      setPeoples(result.people)
      if (selectFirstPerson) {
        onChange?.(result.people[0].id)
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
            {option.data.role === "addNew" ? <></>
              : <FlexBox className={styles.nameAvatar} justifyContent="center" alignItems="center">
                <Typography size="huge">
                  {lodash.first(option.data.firstName)}
                  {lodash.first(option.data.lastName)}
                </Typography>
              </FlexBox>
            }
            <Space horizontal size={5} />
            <FlexBox flexDirection="column">
              <Typography size="large">{option.label}</Typography>
              <Typography gray>{option.data.role === "addNew" ? "" :option.data.role}</Typography>
            </FlexBox>
          </FlexBox>
        )}
      />
      <div className={"customPeopleSelect"}>
        <AddPersonModal
          ref={addPersonModalRef}
          type={addNewOption}
          onSuccess={fetchData}
          companyId={companyNumber || companyId}
        />
      </div>
    </>
  )
}

export default PeopleSelect
