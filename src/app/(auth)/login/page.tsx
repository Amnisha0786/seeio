"use client"

import React, { useState } from 'react'
import { Form, Input } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import lodash from 'lodash'
import classNames from 'classnames';

import * as API from '@/api'
import Request from '@/utils/request'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import { useAccessLevel, useAppDispatch } from '@/hooks'
import { getAccountInfo } from '@/store/actions'
import * as CompanySetupModal from '@/shared/company-setup-modal'
import MfaSetup from '../mfa-setup'
import styles from './page.module.scss'
import FlexBox from '@/components/flex-box';
import Icon from '@/components/icon';
import SMSMessageCode from '../sms-message-code'
import { fetchAuthSession } from 'aws-amplify/auth';
import ChooseMFA from '../choose-mfa';
import { COMPANY_USER_ACCESS_LEVEL } from '@/models';

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
})

const Page = () => {
  let storedCompanyObejct:any
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [code, setCode] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userAccess = useAccessLevel()
  const storedSelectedCompanyId = localStorage.getItem('companyObject');
  if(storedSelectedCompanyId){
    storedCompanyObejct = JSON.parse(storedSelectedCompanyId) || {}
  }

  const formik = useFormik<{ email: string, password: string }>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        const result = await API.signInUser({
          email: values.email?.trim()?.toLowerCase(),
          password: values.password,
        })

        if (result?.nextStep?.signInStep === "DONE") {
          const { idToken } = (await fetchAuthSession()).tokens ?? {};
        
          if(userAccess?.userId && storedCompanyObejct[`${userAccess?.userId}`] !== undefined){
            localStorage.setItem('companyObject', JSON.stringify({
              ...storedCompanyObejct,
              [`${userAccess?.userId}`]:storedCompanyObejct[`${userAccess?.userId}`],
            }));
          }
          if (idToken) {
            Request.setAccessToken(idToken)
          }
          if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
            router.push("/dashboard")
          } else {
            router.push("/profile")
          }
        } else {
          setNextStep(result?.nextStep)
          setErrorMessage("")
        }
      } catch (e: any) {
        setErrorMessage(e.message)
        if (e.code === "UserNotConfirmedException") {
          // TODO: Route to finish setup account
        }
      } finally {
        setLoading(false)
      }
    }
  });

  const confirmOtp = async () => {
    setLoading(true)

    try {
      await API.handleSignInConfirmation(
        code,
      )
      const user = await fetchAuthSession()
      if (user?.tokens?.idToken) {
        Request.setAccessToken(user?.tokens?.idToken)
      }

      const accountInfo = await dispatch(getAccountInfo())

      if (lodash.get(accountInfo, "payload.companies", []).length === 0) {
        setTimeout(() => {
          if (user) {
            CompanySetupModal.open(true)
          }
        }, 1000)
      }

      if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
        router.push("/dashboard")
      } else {
        router.push("/profile")
      }
    } catch (e: any) {
      setErrorMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const goToForgotPassword = () => {
    router.push("/forgot-password")
  }

  const onMFAVerification = async () => {
    const user = await fetchAuthSession()
    if (user?.tokens?.idToken) {
      Request.setAccessToken(user?.tokens?.idToken)
    }
    const accountInfo = await dispatch(getAccountInfo())

    if (lodash.get(accountInfo, "payload.companies", []).length === 0) {
      setTimeout(() => {
        if (user) {
          CompanySetupModal.open(true)
        }
      }, 1000)
    }

    if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
      router.push("/dashboard")
    } else {
      router.push("/profile")
    }
  }

  const getUserForm = () => {
    if (!nextStep) {
      return (
        <>
          <Form onFinish={formik.handleSubmit}>
            <Typography center size='large' gray>
              Enter a world of better governence
            </Typography>
            <Space size={24} />
            <Input
              name="email"
              size="large"
              placeholder="Enter your email (case sensitive)"
              onChange={formik.handleChange}
              value={formik.values.email}
              status={formik.errors.email && "error"}
            />
            <Space size={24} />
            <Input.Password
              name="password"
              type="password"
              size="large"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              value={formik.values.password}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              status={formik.errors.password && "error"}
            />
            <Space size={24} />
            {errorMessage && (
              <>
                <Typography red size="large">
                  {errorMessage}
                </Typography>
                <Space size={24} />
              </>
            )}
            <Button
              size="large"
              type="primary"
              loading={loading}
              disabled={!formik.isValid}
              htmlType='submit'
              fullWidth
            >
              Continue
            </Button>
          </Form>
          <Space size={24} />
          {/* <div className={styles.divider}>
            <div className={styles.line} />
            <Typography gray size='large'>
              or
            </Typography>
          </div>
          <Space size={24} />
          <Button size="large">
            <div className={styles.iconButton}>
              <Image
                src="/icons/google-icon.svg"
                alt="App Logo"
                width={24}
                height={24}
              />
              <Typography size='huge'>Sign up with Google</Typography>
            </div>
          </Button>
          <Space size={24} /> */}
          <Typography link size="large" onClick={goToForgotPassword}>
            Problems signing in?
          </Typography>
          <Space size={24} />
          <Typography size='large' className={styles.signUpLink}>
            Don`t have an account?{' '}
            <span onClick={() => router.push('/signup')}>Sign up</span>
          </Typography>
        </>
      );
    } else if (nextStep?.signInStep === "CONTINUE_SIGN_IN_WITH_TOTP_SETUP") {
      return (
        <MfaSetup
          nextStep={nextStep}
          onSuccess={onMFAVerification}
        />
      );
    } else if (nextStep?.signInStep === "CONTINUE_SIGN_IN_WITH_MFA_SELECTION") {
      return <ChooseMFA nextStep={nextStep} setNextStep={setNextStep} />
    } else if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
      return (
        <Form>
          <Typography center size="large" gray>
            Please check your authentication app for your code.
          </Typography>
          <Space size={24} />
          <Input
            name='code'
            size='large'
            placeholder='Enter Two Factor Authentication Code'
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
          <Space size={24} />
          {errorMessage && (
            <>
              <Typography red size='large'>
                {errorMessage}
              </Typography>
              <Space size={24} />
            </>
          )}
          <Button
            size='large'
            type='primary'
            disabled={!code}
            loading={loading}
            onClick={confirmOtp}
            htmlType='submit'
            fullWidth
          >
            Continue
          </Button>
        </Form>
      )
    } else if (nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
      return <SMSMessageCode onSuccess={onMFAVerification} />
    } else {
      return null
    }
  }

  return (
    <div className={styles.page}>
      <FlexBox justifyContent='center'>
        <Icon
          className={classNames(styles.logo)}
          name="seeio_logo"
          size={150}
          alt="SEEIO logo"
        />
      </FlexBox>
      <Typography center serif size='enormous'>
        Log in
      </Typography>
      <Space size={16} />
      {getUserForm()}
    </div>
  );
};

export default Page;
