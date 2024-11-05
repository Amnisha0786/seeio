import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// import Image from 'next/image';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import classnames from 'classnames'
import Link from "next/link";

import Typography from '@/components/typography'
import Icon from '@/components/icon'
import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import Clickable from '@/components/clickable'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import styles from './side-bar.module.scss'
import Toast from '@/components/toast'
import * as API from '@/api'
// import Button from '@/components/button';
import { USER_TYPE } from '@/models'

type TItem = {
  icon: string
  title: string
  path: string
  goDirectToChildIndex?: number
  hideFrom?: string[]
  role?: "company" | "investor" // unset means both
  showInvestor?: boolean,
  items?: {
    title: string
    path: string
    hideFrom?: string[]
  }[]
}

enum COMPANY_USER_ACCESS_LEVEL_LOWER {
  OWNER = "owner",
  ADMIN = "admin",
  BOARD_MEMBER = "board_member",
  USER = "user",
  DATA_ROOM_ACCESS_USER = "data_room_access_user",
  BILLING_ADMIN = "billing_admin"
}

const TOP_MENU_ITEMS: TItem[] = [
  {
    icon: "dashboard-icon",
    title: "Dashboard",
    path: "/dashboard",
    role: "company",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN],
    showInvestor: true,
    items: [
      {
        title: "Meetings",
        path: "/dashboard/meeting-and-track-targets",
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
      },
      {
        title: "Progress Updates",
        path: "/dashboard/progress-updates",
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
      },
      {
        title: "Minute Book",
        path: "/dashboard/minute-book",
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.USER, COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN],
      },
      {
        title: 'Template Policies',
        path: '/dashboard/template-policies',
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
      },
      {
        title: "Actions Report",
        path: "/dashboard/actions-report",
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
      }
    ],
  },
  {
    icon: "black-folder-icon",
    title: "Corporate Records",
    path: "/documents",
    goDirectToChildIndex: 0,
    role: "company",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN],
    items: [
      {
        title: "Records",
        path: "/documents/records",
      },
      {
        title: "Registers",
        path: "/documents/registers",
      },
      {
        title: "Key information",
        path: "/documents/key-information",
      },
      {
        title: "Shares",
        path: "/documents/shares",
      },
    ],
  },
  {
    icon: "business-health",
    title: "Business Health",
    path: "/dashboard/business-health",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN],
    items: [
      {
        title: "Vision and Purpose",
        path: "/dashboard/business-health/vision-purpose",
      },
      {
        title: "Corporate Objectives",
        path: "/dashboard/business-health/corporate-objectives",
      },
      {
        title: "Strategic Risks",
        path: "/dashboard/business-health/strategic-risks",
      },
      {
        title: "Cash Burn/Runway Calculator",
        path: "/dashboard/business-health/cash-burn-and-runway-calculator",
      },
    ],
  },
  {
    icon: "governance-timetable",
    title: "Governance Timetable",
    path: "/dashboard/governance-timetable",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.USER, COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
  },
  {
    icon: "company-setup-icon",
    title: "Company Information",
    path: "/settings/company-setup/outline-of-the-company",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.USER, COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
  },
  {
    icon: "black-folder-icon",
    title: "Data Rooms",
    path: "/data-rooms",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.USER, COMPANY_USER_ACCESS_LEVEL_LOWER.BILLING_ADMIN]
  },
  {
    icon: "black-settings-icon",
    title: "Billing and Users",
    path: "",
    hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.BOARD_MEMBER, COMPANY_USER_ACCESS_LEVEL_LOWER.USER],
    items: [
      {
        title: "Billing And Subscription",
        path: "/billing-subscription",
        hideFrom: [COMPANY_USER_ACCESS_LEVEL_LOWER.ADMIN]
      },
      {
        title: "Manage Users",
        path: "/settings/account-and-billing/manage-users",
      }
    ]
  }
]
const BOTTOM_MENU_ITEMS: TItem[] = []

const SideBar = (props: {
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>
}) => {

  const [openedPath, setOpenedPath] = useState<string | null>(null)
  const [dropDownItem, setDropDownItem] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const selectedCompany = useSelectedAccountCompany()
  const companyId = useSelectedAccountCompany()?.companyId;
  const userAccess = useAccessLevel()
  const [collapse, setCollapse] = useState(false)

  const redriectBillingUrl = async () => {
    if (!companyId) {
      return
    }
    try {
      props.setLoading(true)
      const result = await API.getBillingUrl(companyId)

      if (result?.url) {
        window.open(result?.url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      Toast.error("No active subscription")
    } finally {
      props.setLoading(false)
    }
  }

  useEffect(() => {
    const childPaths: string[] = []
    TOP_MENU_ITEMS.forEach(item => {
      (item.items || []).forEach(childItem => {
        if (childItem.path) childPaths.push(childItem.path)
      })
    })
    BOTTOM_MENU_ITEMS.forEach(item => {
      (item.items || []).forEach(childItem => {
        if (childItem.path) childPaths.push(childItem.path)
      })
    })

    if (childPaths.includes(pathname as string)) {
      const topMenuItem = TOP_MENU_ITEMS.find(item => pathname?.includes(item.path))
      const bottomMenuItem = BOTTOM_MENU_ITEMS.find(item => pathname?.includes(item.path))

      if (topMenuItem) setOpenedPath(topMenuItem.path)
      else if (bottomMenuItem) setOpenedPath(bottomMenuItem.path)
    }

    // eslint-disable-next-line
  }, [])

  const handleMenuClick = (item: TItem) => {
    if (item.goDirectToChildIndex || item.goDirectToChildIndex === 0) {
      router.push(item.items?.[item.goDirectToChildIndex].path as any)
      setOpenedPath(item.path)
    } else {
      router.push(item.path as any)
    }
  }

  const renderMenuBox = (paramItems: TItem[]) => {
    const paramsItems = paramItems.filter(item => (
      (item.showInvestor === true && userAccess?.userType?.toLowerCase() === USER_TYPE.INVESTOR) ?
        true :
        item?.role ? (item?.role?.toLowerCase() === selectedCompany?.userType?.toLowerCase()) : true
    ))
    const filteredItems = paramsItems?.filter(item =>
      ((item?.showInvestor === true && userAccess?.userType?.toLowerCase() === USER_TYPE.INVESTOR) ?
        item :
        !item?.hideFrom || !item?.hideFrom?.includes(userAccess?.accessLevel?.toLowerCase() || "")))

    return (
      <div className={styles.menuBox}>
        {filteredItems.map((item, index) => {
          const filteredItem = item?.items?.filter(item => (
            !item?.hideFrom || !item?.hideFrom?.includes(userAccess?.accessLevel?.toLowerCase() || "")
          ))
          return (
            <div 
              key={index} 
              className={classnames(styles.menuItemOuter, { [styles.menuDropDown]: dropDownItem === item.title || openedPath === item.path })}
            >
              <div
                key={index}
                className={classnames(styles.menuItem, { [styles.active]: pathname === item.path })}
              >
                <Clickable
                  className={styles.menuItemLeft}
                  onClick={() => handleMenuClick(item)}
                >
                  <Icon
                    className={styles.menuItemIcon}
                    name={item.icon}
                    alt="side bar item icon"
                    size={30}
                  />
                  <Space horizontal size={8} />
                  <Typography
                    className={styles.menuItemTitle}
                    size="large"
                    bold
                  >
                    {item.title}
                  </Typography>
                </Clickable>
                {(filteredItem || []).length > 0 && (
                  <Clickable onClick={() => {
                    if (openedPath === item.path) {
                      setDropDownItem('')
                      setOpenedPath(null)
                    } else {
                      setOpenedPath(item.path)
                      setDropDownItem(item?.title)
                    }
                  }}>
                    <Icon
                      className={classnames(styles.openButton, { [styles.reverse]: openedPath === item.path })}
                      name="chevron-down-icon"
                      alt="icon"
                      size={24}
                      color='white'
                    />
                  </Clickable>
                )}
              </div>
              <div className={classnames(styles.colapse, { [styles.open]: openedPath === item.path })}>
                {(filteredItem || []).map((subItem, subIndex) => (
                  <>
                    {subItem.path === "/billing-subscription" ?
                      <Clickable
                        key={subIndex}
                        className={classnames(styles.menuSubItem, { [styles.active]: pathname?.startsWith(subItem.path) })}
                        onClick={redriectBillingUrl}
                      >
                        <Typography size="large" className={styles.menuSubItemTitle}>
                          {subItem.title}
                        </Typography>
                      </Clickable> :

                      <Clickable
                        key={subIndex}
                        className={classnames(styles.menuSubItem, { [styles.active]: pathname?.startsWith(subItem.path) })}
                        onClick={() => router.push(subItem.path as any)}
                      >
                        <Typography size="large" className={styles.menuSubItemTitle}>
                          {subItem.title}
                        </Typography>
                      </Clickable>
                    }
                  </>
                ))}
              </div>
            </div>
          )
        }
        )}
      </div>
    )
  }

  useEffect(() => {
    if (!userAccess) {
      props.setLoading(true)
    } else {
      props.setLoading(false)
    }
  }, [userAccess])

  return (
    <div className={`${styles.sideBar} ${collapse ? styles.collapseMenu : ""}`}>
      <FlexBox flexDirection="column">
        <Clickable onClick={() => {
          setCollapse((prev) => !prev)
        }} className={styles.drawerIcon}>
          <Icon name='drawer-icon' />

        </Clickable>
        <Link href="/dashboard">
          <Icon
            className={classnames(styles.logo)}
            name="logo-green"
            size={200}
            alt="SEEIO logo"
          />
        </Link>
        <Space size={16} />
        <Input
          className={styles.searchBox}
          bordered
          size="large"
          placeholder="Search for..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
        />
        <Space size={16} />
        {renderMenuBox(TOP_MENU_ITEMS)}
      </FlexBox>
      <FlexBox flexDirection="column">

        {/* <div className={styles.chatButton}>
          <div className={styles.test}>
            <Image src='/icons/ask-ai-background.svg'
              alt='ask-ai-background'
              quality="100"
              layout="fill"
              className={styles.bgImage}
            />
          </div>
          <div className={styles.buttonContent}>
            <Icon name='ask-ai' size={54} height={43} />
            <Button className={styles.aiButton} onClick={() => openChatModal?.current?.open()}>
              Ask chat
            </Button>
          </div>
        </div> */}

        {renderMenuBox(BOTTOM_MENU_ITEMS)}
      </FlexBox>
    </div>
  )
}

export default SideBar
