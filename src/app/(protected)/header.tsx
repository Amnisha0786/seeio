import { useMemo, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import lodash from 'lodash'

import Typography from '@/components/typography'
import Space from '@/components/space'
import Clickable from '@/components/clickable'
import Toast from '@/components/toast'
import * as API from '@/api'
import {
  useAccessLevel,
  useAppDispatch,
  useAppSelector,
  useAuthenticatedUser,
  useSelectedAccountCompany,
  useUserName
} from '@/hooks'
import { getAccountInfo, setSelectedCompanyId } from '@/store/actions'
import * as CompanySetupModal from "@/shared/company-setup-modal"
import styles from './header.module.scss'
import * as AllPlansModal from '@/shared/all-plans-modal';
import FlexBox from '@/components/flex-box'
import Icon from '@/components/icon';
import { accessLevelActions } from '@/store/account/useAcessLevel';
import ConfirmDelete from '@/shared/confirm-delete'

interface Props {
  setOpenAllCompanyModal?: any,
  openAllCompanyModal?: boolean
}

const Header = ({ setOpenAllCompanyModal, openAllCompanyModal }: Props) => {
  let storedCompanyObejct: any
  const router = useRouter()
  const account = useAppSelector(({ account }) => account)
  const selectedCompany = useSelectedAccountCompany()
  const username = useUserName();
  const user = useAuthenticatedUser();
  const dispatch = useAppDispatch();
  const { updateAcessLevel } = accessLevelActions
  const userAccess = useAccessLevel()
  const storedSelectedCompanyId = localStorage.getItem('companyObject');
  const logoutRef = useRef<any>()
  const [loading, setLoading] = useState(false)
  if (storedSelectedCompanyId) {
    storedCompanyObejct = JSON.parse(storedSelectedCompanyId) || {}
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await API.signOutUser()
      localStorage.clear()
      logoutRef?.current?.close()
      AllPlansModal.close()
      router.push("/login")
      setLoading(false)
    } catch (e: any) {
      Toast.error(e.message)
      setLoading(false)
    }
  }
  const items = useMemo<MenuProps['items']>(() => ([{
    label: username || "Profile",
    key: '0',
    onClick: () => router.push("/profile")
  }, {
    label: 'Logout',
    key: '3',
    onClick: () => {
      logoutRef?.current?.open()
    },
  }
  ]), [username, router])

  const companyItems = useMemo(() => (
    [{
      label: "Manage Companies",
      key: '-1',
      onClick: () => {
        if (user) {
          CompanySetupModal.open()
        }
      },
      className: styles.color
    }].concat(account.companies.map(company => ({
      label: company.companyName,
      key: company.companyId,
      className: "",
      disabled: company.companyId === selectedCompany?.companyId,
      onClick: async () => {
        if (company?.companyId) {
          dispatch(setSelectedCompanyId(company.companyId));
          const accessLevel = await API.getAccountAccess(company?.companyId || "")
          const userId = userAccess?.userId ?? user?.sub
          if (userId && storedCompanyObejct[`${userId}`] !== undefined) {
            localStorage.setItem('companyObject', JSON.stringify({
              ...storedCompanyObejct,
              [`${userId}`]: company.companyId,
            }));
          }
          router.push("/dashboard")
          AllPlansModal?.close(true)
          dispatch(updateAcessLevel(accessLevel))
        }
      }
    })))
  ), [dispatch, account.companies, selectedCompany, router, userAccess])

  useEffect(() => {
    async function getCompanyData() {
      const accountInfo = await dispatch(getAccountInfo());
      if (lodash.get(accountInfo, "payload.companies", []).length === 0) {
        setTimeout(() => {
          CompanySetupModal.open(true)
        }, 1000)
      }
    }
    getCompanyData();
  }, [])

  const navigateManageUser = () => {
    router.push("/settings/account-and-billing/manage-users")
    setOpenAllCompanyModal(false)
  }

  return (
    <div className={styles.header}>
      <div className={styles.companyName}>
        <Typography>{selectedCompany?.companyName}</Typography>
      </div>
      {openAllCompanyModal &&
        <FlexBox alignItems='center'>
          <FlexBox alignItems='center'>
            <Icon name='users' />
          </FlexBox>
          <Space horizontal size={5} />
          <Clickable onClick={navigateManageUser}>
            <Typography size="large" color='#000000E0'> Manage Users</Typography>
          </Clickable>
        </FlexBox>
      }
      <Space horizontal size={32} />
      <Dropdown menu={{ items }} trigger={['click']}>
        <Clickable className={styles.button}>
          <Image
            className={styles.image}
            src="/placeholder.png"
            alt="icon"
            width={24}
            height={24}
          />
          <Typography size="large">{username || "Profile"}</Typography>
          <Image
            className={styles.logo}
            src="/icons/chevron-down-icon.svg"
            alt="icon"
            width={22}
            height={22}
          />
        </Clickable>
      </Dropdown>

      <Space horizontal size={32} />
      <Dropdown menu={{ items: companyItems }} trigger={['click']} overlayClassName={styles.dropdown}>
        <Clickable className={styles.button}>
          <Image
            className={styles.image}
            src="/placeholder.png"
            alt="icon"
            width={24}
            height={24}
          />
          <Typography size="large">{selectedCompany?.companyName || "Select a company"}</Typography>
          <Image
            src="/icons/chevron-down-icon.svg"
            alt="icon"
            width={22}
            height={22}
          />
        </Clickable>
      </Dropdown>
      <ConfirmDelete
        ref={logoutRef}
        handleConfirm={handleLogout}
        loading={loading}
        message={`Are you sure you want to logout?`}
      />
    </div>
  )
}

export default Header;
