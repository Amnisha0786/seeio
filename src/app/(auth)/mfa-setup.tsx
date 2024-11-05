"use client"

import { useState, useEffect } from 'react'
import { Input } from 'antd'
import QRCode from 'qrcode.react'
import { fetchAuthSession, setUpTOTP } from 'aws-amplify/auth'

import * as API from '@/api'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from './mfa-setup.module.scss'
import Request from '@/utils/request'
import { TCongif } from '@/models'

interface IProps {
  onSuccess: () => void
  nextStep?: any
  configData?: TCongif
}

const MfaSetup = ({
  onSuccess,
  nextStep,
  configData
}: IProps) => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [twoFaCode, set2faCode] = useState("")
  const [qrValue, setQrValue] = useState<any>()

  useEffect(() => {
    async function handleTOTPSetup() {
      try {
        const totpSetupDetails = await setUpTOTP();
        const appName = 'SEEIO';
        const setupUri = totpSetupDetails.getSetupUri(appName);
        setQrValue(setupUri);
      } catch (error: any) {
        setErrorMessage(error?.message)
      }
    }

    handleTOTPSetup()
  }, [nextStep])

  const confirm2faOtp = async () => {
    setLoading(true)
    try {
      await API.verifyTOTP(twoFaCode)
      await API.handleUpdateMFAPreference({
        sms: 'ENABLED', totp: 'PREFERRED'
      })

      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      const token = idToken
      if (token) {
        Request.setAccessToken(token)
        if (configData) {
          await API.updateConfig(configData)
        }
      } else {
        throw "error"
      }
      onSuccess()
    } catch (e: any) {
      setErrorMessage(e?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography center serif size="enormous">Two-Factor Authentication</Typography>
      <Space size={16} />
      <Typography center size="large" gray>Please Scan the QR code in your preferred authenticator app.</Typography>
      <Space size={24} />
      <div className={styles.qrBox}>
        {qrValue && (
          <QRCode
            id='qrcode'
            value={qrValue}
            size={250}
            level={'H'}
            includeMargin={true}
          />
        )}
      </div>
      <Space size={24} />
      <Input
        name="code"
        size="large"
        placeholder="Enter Two Factor Authentication Code"
        onChange={(e) => set2faCode(e.target.value)}
        value={twoFaCode}
      />
      <Space size={24} />
      {errorMessage && (
        <>
          <Typography red size="large">{errorMessage}</Typography>
          <Space size={24} />
        </>
      )}
      <Button
        size="large"
        type="primary"
        disabled={!twoFaCode}
        loading={loading}
        onClick={confirm2faOtp}
      >
        Continue
      </Button>
    </>
  )
}

export default MfaSetup
