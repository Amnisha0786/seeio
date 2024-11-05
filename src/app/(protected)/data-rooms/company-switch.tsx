import React, { useMemo } from 'react'
import { Dropdown } from 'antd';
import Image from 'next/image'

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import Space from '@/components/space'
import { useAppDispatch } from '@/hooks'
import { setSelectedCompanyId } from '@/store/actions'
import { useAppSelector, useSelectedAccountCompany } from '@/hooks'
import styles from './page.module.scss'

const CompanySwitch = () => {
  const account = useAppSelector(({ account }) => account)
  const selectedCompany = useSelectedAccountCompany()
  const dispatch = useAppDispatch()

  const companyItems = useMemo(() => (
    account.companies.map(company => ({
      label: company.companyName,
      key: company.companyId,
      disabled: company.companyId === selectedCompany?.companyId,
      onClick: () => dispatch(setSelectedCompanyId(company.companyId))
    }))
  ), [dispatch, account.companies, selectedCompany])

  return (
    <FlexBox className={styles.companySwitch} flexDirection="column" alignItems="flex-start">
      <Dropdown menu={{ items: companyItems }} trigger={['click']}>
        <Clickable className={styles.button}>
          <Image
            className={styles.image}
            src="https://picsum.photos/id/238/200"
            alt="icon"
            width={24}
            height={24}
          />
          <Space horizontal size={3} />
          <Typography size="large">{selectedCompany?.companyName || "Select a company"}</Typography>
          <Image
            src="/icons/chevron-down-icon.svg"
            alt="icon"
            width={22}
            height={22}
          />
        </Clickable>
      </Dropdown>
      <Space size={16} />
      <FlexBox>
        <Space horizontal size={43} />
        <Typography size="large" gray>
          0000 0000 0000 0000, Name Lorem, OE006930, 21 Springfield, Bridgnorth, England, WV15 6DN
        </Typography>
      </FlexBox>
    </FlexBox>
  )
}

export default CompanySwitch
