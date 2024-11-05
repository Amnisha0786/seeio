'use client'
import React, { useEffect, useState } from 'react'
import lodash from 'lodash'
import { useRouter, usePathname } from 'next/navigation'
import { fetchAuthSession } from 'aws-amplify/auth'

import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from '../signup/page.module.scss'
import MfaSetup from '../mfa-setup'
import Request from '@/utils/request'
import { handleRedirection, useAccessLevel, useAppDispatch } from '@/hooks'
import { getAccountInfo } from '@/store/actions'
import * as SetupACompanyModal from '@/shared/setup-a-company-modal'
import SMSMessageCode from '../sms-message-code'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

const Page = () => {
  const [mfaStep, setMfaStep] = useState("choose-mfa");

  const router = useRouter()
  const dispatch = useAppDispatch()
  const userAccess = useAccessLevel()
  const pathname = usePathname()
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const useAccess = useAccessLevel()
  const url =  typeof window !== 'undefined' ? window.location.href: ""

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { idToken } = (await fetchAuthSession()).tokens ?? {};
        const token = idToken
        if (token) {
          Request.setAccessToken(token)
        } else {
          throw "error"
        }
      } catch (e) {
        router.replace("/login")
      }
    }

    fetchUser()
  }, [])

  const onConfirm2faSuccess = async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const token = idToken
    if (token) {
      Request.setAccessToken(token)
    } else {
      throw "error"
    }
    const accountInfo = await dispatch(getAccountInfo())    
    if (lodash.get(accountInfo, "payload.companies", []).length === 0) {
      setTimeout(() => {
        trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
          page_or_modal_name: 'signup_company_id',
          page_url: url,
          user_id: useAccess?.userId && useAccess?.userId,
          viewed_at: new Date().valueOf(),
          platform: PLATFORM.WEB,
        });
        // SetupACompanyModal.open(true)
      }, 1000)
    }

    handleRedirection(pathname, userAccess, router)
  }

  const handleAuthenticatorClick = async () => {
    setMfaStep("authenticator")
  }

  const handleSmsClick = async () => {
    handleRedirection(pathname, userAccess, router)
  }

  const showMfaStep = () => {
    if (mfaStep === "choose-mfa") {
      return (
        <>
          <Typography center serif className={styles.bolder} size='enormous'>
            Additional MFA
          </Typography>
          <Space size={24} />

          <Button size='large' type='primary' style={{ width: '100%' }} onClick={handleAuthenticatorClick}>
            Authenticator App (Recommended)
          </Button>
          <Space size={16} />
          <div className={styles.divider}>
            <div className={styles.line} />
            <Typography gray size='large'>
              or
            </Typography>
          </div>
          <Space size={16} />
          <Button size='large' className={styles.SMSBtn} onClick={handleSmsClick}>
            Continue with text Message
          </Button>
        </>
      )
    } else if (mfaStep === "authenticator") {
      return (
        <>
          <MfaSetup
            onSuccess={onConfirm2faSuccess}
          />
        </>
      )
    } else if (mfaStep === "sms") {
      return <SMSMessageCode onSuccess={onConfirm2faSuccess} />
    }
  }

  return (
    <div className={styles.authBox}>
      <Space size={24} />
      {showMfaStep()}
    </div>
  )
}

export default Page
