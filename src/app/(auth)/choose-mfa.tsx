'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { confirmSignIn } from 'aws-amplify/auth'

import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from './signup/page.module.scss'
import MfaSetup from './mfa-setup'
import SMSMessageCode from './sms-message-code'
import { TCongif } from '@/models'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'
import useAmplitudeContext from '@/hooks/amplitude'
import { useAccessLevel } from '@/hooks'

interface IProp {
  nextStep: any
  setNextStep?: (data: any) => void
  configData?: TCongif
}

const ChooseMFA = ({
  nextStep,
  setNextStep,
  configData
}: IProp) => {
  const [mfaStep, setMfaStep] = useState("choose-mfa");
  const router = useRouter()
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const useAccess = useAccessLevel()

  useEffect(() => {
    if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'signup_phone_check',
        page_url:  typeof window !== 'undefined' ? window.location.href: "",
        user_id: useAccess?.userId && useAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
      setMfaStep("sms")
    } else if (nextStep?.signInStep === "CONTINUE_SIGN_IN_WITH_TOTP_SETUP") {
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'signup_mfa_QR',
        page_url:  typeof window !== 'undefined' ? window.location.href: "",
        user_id: useAccess?.userId && useAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
      setMfaStep("authenticator")
    } else {
      setMfaStep("choose-mfa")
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'signup_mfa',
        page_url:  typeof window !== 'undefined' ? window.location.href: "",
        user_id: useAccess?.userId && useAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
    }
  }, [nextStep])

  const onConfirm2faSuccess = () => {
    router.push("/choose-mfa")
  }

  const handleAuthenticatorClick = async () => {
    setMfaStep("authenticator")
    promptUserForMFAType('TOTP')
  }

  const handleSmsClick = async () => {
    setMfaStep("sms")
    promptUserForMFAType('SMS')
  }

  function promptUserForMFAType(
    allowedMFATypes: ('SMS' | 'TOTP')
  ) {
    if (setNextStep) {
      handleMFASelection(allowedMFATypes)
    }
  }

  async function handleMFASelection(mfaType: 'SMS' | 'TOTP') {
    try {
      const output = await confirmSignIn({
        challengeResponse: mfaType
      });
      setNextStep?.(output?.nextStep)
    } catch (error: any) {
      console.log(error, "Err")
    }
  }

  const showMfaStep = () => {
    if (mfaStep === "choose-mfa") {
      return (
        <>
          <Typography center serif className={styles.bolder} size='enormous'>
            Choose MFA
          </Typography>
          <Space size={16} />
          <Typography center size='large' gray>
            We require Multi-Factor Authentication to keep your data safe.
          </Typography>
          <Space size={16} />

          <Button size='large' type='primary' style={{ width: '100%' }} onClick={handleAuthenticatorClick}>
            Authenticator App
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
            Text Message
          </Button>
        </>
      )
    } else if (mfaStep === "authenticator") {
      return (
        <>
          <MfaSetup
            onSuccess={onConfirm2faSuccess}
            nextStep={nextStep}
            configData={configData}
          />
        </>
      )
    } else if (mfaStep === "sms") {
      return <SMSMessageCode configData={configData} onSuccess={onConfirm2faSuccess} />
    }
  }

  return (
    <div className={styles.authBox}>
      <Space size={24} />
      {showMfaStep()}
    </div>
  )
}

export default ChooseMFA;
