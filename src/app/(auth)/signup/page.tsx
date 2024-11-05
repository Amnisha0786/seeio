"use client"

import React, { useEffect, useState } from 'react'
import { Input, Checkbox, Form, Tooltip } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useFormik, FormikErrors } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import classNames from 'classnames';

import * as API from '@/api'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import PhoneInput from '@/components/phone-input'
import styles from './page.module.scss'
import Icon from '@/components/icon';
import FlexBox from '@/components/flex-box';
import ChooseMFA from '../choose-mfa';
import { PASSWORD_ERROR_TEXT } from '@/constants';
import { TCongif } from '@/models'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

interface IForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  readDataTerms: boolean;
  phone: string;
  marketingConsent: boolean;
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required("Password is required."),
  confirmPassword: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  acceptTerms: yup.boolean().isTrue(),
  readDataTerms: yup.boolean().isTrue(),
  phone: yup.number().required(),
})

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(false)
  const [userId, setUserId] = useState<any>(false)
  const [mfaChallenge, setConfirmationType] = useState<string>("EMAIL")
  const [errorMessage, setErrorMessage] = useState("")
  const [confirmCode, setConfirmCode] = useState("")
  const [nextStep, setNextStep] = useState<any>({})
  const [isMarketingConsent, setMarketingConsent] = useState<boolean>(false)
  const [userLoginDetails, setUserLoginDetails] = useState({
    email: "",
    password: ""
  })
  const [configData, setConfigData] = useState<TCongif>()

  const router = useRouter()
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""


  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
      user_id: userId && userId,
      actioned_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_personal_details',
      page_url: url,
      user_id: userId && userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const formik = useFormik<IForm>({
    validateOnMount: false,
    validateOnChange: true,
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      acceptTerms: false,
      readDataTerms: false,
      marketingConsent: false,
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {}

      if (
        values.password &&
        values.confirmPassword &&
        values.password !== values.confirmPassword
      ) {
        errors.password = "MUST_MATCH";
      }

      if (
        values.password &&
        values.password.length < 8
      ) {
        errors.password = "MIN_LENGTH";
      }
      // eslint-disable-next-line max-len
      if (
        values.password &&
        !values.password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
      ) {
        errors.password = "INVALID_PASSWORD";
      }

      if (
        values.password &&
        values.password?.length < 8
      ) {
        errors.password = "MIN_LENGTH";
      }

      return errors
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)
      setMarketingConsent(values.marketingConsent)
      try {
        const result = await API.signUpUser(
          values.email?.toLowerCase()?.trim(),
          values.phone,
          values.password,
          values.firstName?.toLowerCase(),
          values.lastName?.toLowerCase(),
        );
        setUserLoginDetails({
          email: values.email?.toLowerCase(),
          password: values.password
        })

        setUserId(result?.userId)
        setNextStep(result?.nextStep)
        setErrorMessage("")
        setConfigData({
          havePlatformTour: {
            businessHealth: false,
            register: false,
            record: false,
            objective: false,
          },
          email: values.email?.toLowerCase()?.trim(),
          firstName: values.firstName?.toLowerCase(),
          lastName: values.lastName?.toLowerCase(),
          isConsentedToMarketing: values?.marketingConsent ? values.marketingConsent : false
        })
      } catch (e: any) {
        setErrorMessage(e.message)
      } finally {
        setLoading(false)
      }
    }
  });

  const confirmEmailOtp = async () => {
    setLoading(true)
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_email_check',
      page_url: url,
      user_id: userId && userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
    try {
      await API.handleSignUpConfirmation(formik.values.email, confirmCode, isMarketingConsent);
      const resultUser = await API.signInUser({
        email: userLoginDetails.email,
        password: userLoginDetails.password,
      });
      setNextStep(resultUser?.nextStep)
      setUser(true)
      setErrorMessage("")
    } catch (e: any) {
      setErrorMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const getUserForm = () => {
    if (!userId) {
      return (
        <>
          <Typography center serif size="enormous">
            Sign up
          </Typography>
          <Space size={16} />
          <Typography center size="large" gray>
            This process should not take more than 5 minutes.  Lets get started.
          </Typography>
          <Space size={24} />
          <Form onFinish={formik.handleSubmit}>
            <div className={styles.inputGroup}>
              <Input
                name="firstName"
                size="large"
                placeholder="First Name"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                status={formik.errors.firstName && "error"}
              />
              <Input
                name="lastName"
                size="large"
                placeholder="Last Name"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                status={formik.errors.lastName && "error"}
              />
            </div>
            <Space size={24} />
            <Input
              name="email"
              size="large"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              value={formik.values.email}
              status={formik.errors.email && "error"}
            />
            <Space size={24} />
            <PhoneInput
              placeholder="Enter your telephone number"
              onChange={(value) => formik.setFieldValue("phone", value)}
              status={formik.errors.phone && "error"}
            />
            <Space size={24} />
            <FlexBox alignItems='center'>
              <Input.Password
                name="password"
                size="large"
                type="password"
                placeholder="Create password"
                onChange={formik.handleChange}
                value={formik.values.password}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                status={formik.errors.password && "error"}
              />
              <Space horizontal size={5} />
              <Tooltip placement='top' title={PASSWORD_ERROR_TEXT} color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}
                className={styles.cursor}>
                <InfoCircleOutlined className={styles.size} />
              </Tooltip>
            </FlexBox>
            <Space size={24} />
            <Input.Password
              name="confirmPassword"
              size="large"
              type="password"
              placeholder="Retype password"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              status={formik.errors.confirmPassword && "error"}
            />
            <Space size={24} />
            {["MIN_LENGTH", "MUST_MATCH"].includes(
              formik.errors.password || ""
            ) && (
              <>
                <Typography red size="large">
                  {formik.errors.password === "MIN_LENGTH" &&
                      "Passwords must be at least 8 characters"}
                  {formik.errors.password === "MUST_MATCH" &&
                      "Passwords do not match"}
                </Typography>
                <Space size={24} />
              </>
            )}
            {errorMessage && (
              <>
                <Typography red size="large">
                  {errorMessage}
                </Typography>
                <Space size={24} />
              </>
            )}
            <div className={styles.checkboxBox}>
              <Checkbox
                name="acceptTerms"
                checked={formik.values.acceptTerms}
                onChange={formik.handleChange}
              />
              <Space horizontal size={16} />
              <Typography size="large" className={styles.hightlightLink}>
                I accept the Board
                Originator <span>terms and conditions</span> as may be amended by
                Board Originator Ltd. from time to time.
              </Typography>
            </div>
            <Space size={24} />
            <div className={styles.checkboxBox}>
              <Checkbox
                name="readDataTerms"
                checked={formik.values.readDataTerms}
                onChange={formik.handleChange}
              />
              <Space horizontal size={16} />
              <Typography size="large" className={styles.hightlightLink}>
                I have read and understood
                the Board Originator <span>data protection terms</span>.
              </Typography>
            </div>
            <Space size={24} />
            <div className={styles.checkboxBox}>
              <Checkbox
                name="marketingConsent"
                checked={formik.values.marketingConsent}
                onChange={formik.handleChange}
              />
              <Space horizontal size={16} />
              <Typography size="large" className={styles.hightlightLink}>
                I consent to receiving
                occasional information about governance, <span>SEEIO</span>,
                product developments and I can unsubscribe at any time
              </Typography>
            </div>
            <Space size={24} />
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
          {/*
          <div className={styles.divider}>
            <div className={styles.line} />
            <Typography gray size="large">
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
              <Typography size="huge">Sign Up with Google</Typography>
            </div>
          </Button>
          <Space size={24} /> */}
          <Typography size="large" className={styles.hightlightLink}>
            Already have an account?{" "}
            <span onClick={() => router.push("/login")}>Log In</span>
          </Typography>
        </>
      )
    } else if (!user) {
      return (
        <>
          <Typography center serif size="enormous">
            Confirm your{" "}
            {mfaChallenge === "EMAIL" ? "email address." : "mobile number."}
          </Typography>
          <Space size={16} />
          <Form>
            <Typography center size="large" gray>
              Please enter the code we just sent to your{" "}
              {mfaChallenge === "EMAIL" ? "email address." : "mobile number."}
            </Typography>
            <Space size={24} />
            <Input
              name="code"
              size="large"
              placeholder="Enter code"
              onChange={(e) => setConfirmCode(e.target.value)}
              value={confirmCode}
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
              disabled={!confirmCode}
              loading={loading}
              onClick={confirmEmailOtp}
              htmlType='submit'
              fullWidth
            >
              Continue
            </Button>
          </Form>
          <Space size={150} />
          <Typography size="large" className={styles.hightlightLink}>
            Already have an account?{" "}
            <span onClick={() => router.push("/login")}>Log In</span>
          </Typography>
        </>
      )
    } else {
      return (
        <ChooseMFA configData={configData} nextStep={nextStep} />
      )
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
      {getUserForm()}
    </div>
  );
};

export default Page;
