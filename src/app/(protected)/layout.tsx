"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth'

import Header from './header'
import SideBar from './side-bar'
import styles from './layout.module.scss'
import Loading from '@/components/loading'
import Request from '@/utils/request'
import { handleRedirection, useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import { useDispatch } from 'react-redux'
import { accessLevelActions } from '@/store/account/useAcessLevel'

const Layout = ({ children }: { children: React.ReactNode, askAi?: boolean }) => {
  const router = useRouter()
  const [inited, setInited] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const company = useSelectedAccountCompany()
  const dispatch = useDispatch()
  const [collapseAi, setCollapseAi] = useState(false)
  const { updateAcessLevel } = accessLevelActions
  const pathname = usePathname()
  const fetchUserAccessLevel = async () => {
    if(company?.companyId){
      const accessLevel = await API.getAccountAccess(company?.companyId || "")
      handleRedirection(pathname , accessLevel , router)
      dispatch(updateAcessLevel(accessLevel))
    }
  }
  const handlecollapse = () => {
    setCollapseAi((prev) => !prev)
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        const token = idToken

        if (token) {
          Request.setAccessToken(token)
          setInited(true)
        } else {
          throw "error"
        }
      } catch (e) {
        router.replace("/login")
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (company?.companyId) {
      fetchUserAccessLevel()
    }
  }, [company])

  return inited && (
    <div className={styles.layout}>
      <SideBar loading={loading} setLoading={setLoading} />
      <div className={styles.vertical}>
        <Header />
        <div className={styles.pageBody}>
          {loading ? <Loading size='small' /> : children}
        </div>
      </div>
      {/* {askAI && <AskAiModal setCollapse={handlecollapse} collapse={collapseAi}  />} */}
    </div>
  )
}

export default Layout
