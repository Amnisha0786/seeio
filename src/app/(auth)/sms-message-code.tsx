'use client'
import { useMemo, useRef, useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

import * as API from '@/api'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from '../(auth)/signup/page.module.scss'
import FlexBox from '@/components/flex-box'
import Request from '@/utils/request'
import { TCongif } from '@/models'

interface IProps {
  onSuccess: () => void
  configData?: TCongif
}

const TestMessageCode = ({ onSuccess, configData }: IProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs: any = useRef([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    if (value !== '' && index < newOtp.length - 1) {
      const nextInput = inputRefs?.current?.[index + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleRemoveDigit = (index: number, e: any) => {
    const newOtp = [...otp]
    newOtp[index] = ''

    setOtp(newOtp)
    e.preventDefault()

    if (index > 0 && newOtp[index - 1] !== '') {
      inputRefs.current[index - 1].focus()
    } else if (index === 0 && newOtp[index] === '') {
      inputRefs.current[index].focus()
    }
  }
  const disableConfirm = useMemo(() => {
    const hasEmptyString = otp.filter(value => value === "")
    return Boolean(hasEmptyString.length)
  }, [otp])

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await API.handleSignInConfirmation(otp.join(""))
      await API.handleUpdateMFAPreference({
        sms: "PREFERRED"
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
      setErrorMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authBox}>
      <Space size={24} />
      <Typography center serif className={styles.bolder} size='enormous'>
        Text Message Code
      </Typography>
      <Space size={16} />
      <Typography center size='large' gray> 
        Please enter the code we just sent to your registered mobile number.
      </Typography>
      <Space size={16} />
      <FlexBox gap={5}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type='text'
            id={`otp-input-${idx}`}
            inputMode='numeric'
            autoComplete='one-time-code'
            pattern='\d{1}'
            placeholder='-'
            maxLength={1}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && digit === '' && idx > 0) {
                handleRemoveDigit(idx - 1, e)
              }
            }}
            ref={(inputRef) => (inputRefs.current[idx] = inputRef)}
            className={styles.otpInput}
            value={digit}
          />
        ))}
      </FlexBox>
      <Space size={24} />
      {errorMessage && (
        <>
          <Typography red size="large">{errorMessage}</Typography>
          <Space size={24} />
        </>
      )}
      <Space size={16} />
      <Button
        size='large'
        disabled={disableConfirm}
        loading={loading}
        type='primary'
        style={{ width: '92%' }}
        onClick={handleSubmit}
      >
        Confirm
      </Button>
      <Space size={16} />
    </div>
  )
}

export default TestMessageCode
