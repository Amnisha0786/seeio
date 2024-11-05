"use client"

import { useRouter, usePathname } from 'next/navigation'
import classnames from 'classnames'

import styles from './layout.module.scss'
import FlexBox from '@/components/flex-box'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Clickable from '@/components/clickable'
import Typography from '@/components/typography'
import Loading from '@/components/loading'
import { useAccessLevel } from '@/hooks'

const TABS = [{
  name: "Outline of the Company",
  path: "/settings/company-setup/outline-of-the-company"
}, {
  name: "People",
  path: "/settings/company-setup/people"
}, {
  name: "Departments",
  path: "/settings/company-setup/departments"
}, {
  name: "Key Dates",
  path: "/settings/company-setup/key-dates"
},
{
  name: "Finance integration",
  path: "/settings/company-setup/xero"
}
]

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const userAccess = useAccessLevel()

  if (!userAccess) {
    return <Loading size="small" />
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={24} />
      <Container className={styles.xeroContainer}>
        <FlexBox className={styles.tabBar}>
          {TABS.map(tab => (
            <Clickable
              key={tab.path}
              onClick={() => router.push(tab.path as any)}
              className={classnames(styles.tabBarItem, { [styles.active]: pathname === tab.path })}
            >
              <Typography size="large" serif gray={pathname !== tab.path}>{tab.name}</Typography>
            </Clickable>
          ))}
        </FlexBox>
        <Space size={24} />
        {children}
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Layout
