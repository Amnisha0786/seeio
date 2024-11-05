"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Form, Input } from 'antd'
import { useFormik, FormikErrors } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'

import * as API from '@/api'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Space from '@/components/space'
import styles from './page.module.scss'

const validationSchema = yup.object().shape({
  code: yup.string().required(),
  newPassword: yup.string().required(),
  confirmNewPassword: yup.string().required()
})

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [step, setStep] = useState<"enter_email" | "enter_code">("enter_email")
  const [email, setEmail] = useState("")
  const router = useRouter()

  const isEmailValid = useMemo(() => (
    yup.string().email().required().isValidSync(email)
  ), [email])

  const formik = useFormik<{ code: string, newPassword: string, confirmNewPassword: string }>({
    validateOnMount: true,
    initialValues: {
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {}

      if (values.newPassword && values.confirmNewPassword && values.newPassword !== values.confirmNewPassword) {
        errors.newPassword = "MUST_MATCH"
      }

      // eslint-disable-next-line max-len
      if (values.newPassword && !values.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)) {
        errors.newPassword = "INVALID_PASSWORD"
      }

      return errors
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        await API.forgotPasswordSubmit(
          email,
          values.code,
          values.newPassword
        )

        router.push("/login")
      } catch (e: any) {
        setErrorMessage(e.message)
      } finally {
        setLoading(false)
      }
    }
  });

  const onSubmitEmail = async () => {
    setLoading(true)

    try {
      await API.forgotPassword(email)
      setStep("enter_code")
      setErrorMessage("")
    } catch (e: any) {
      setErrorMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Image
        className={styles.logo}
        src="/logo.png"
        alt="App Logo"
        width={72}
        height={43}
        priority
      />
      <Typography center serif size="enormous">Recover Password</Typography>
      <Space size={16} />
      {step === "enter_email" ? (
        <>
          <Form>
            <Typography center size="large" gray>
              Don`t Panic!<br />We have you covered, just enter your email and we`ll send you link
            </Typography>
            <Space size={24} />

            <Input
              name="email"
              size="large"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Space size={12} />
            {errorMessage && (
              <>
                <Typography red size="large">{errorMessage}</Typography>
                <Space size={24} />
              </>
            )}
            <Button
              size="large"
              type="primary"
              loading={loading}
              disabled={!isEmailValid}
              htmlType='submit'
              fullWidth
              onClick={onSubmitEmail}
            >
              Continue
            </Button>
          </Form>

          <Space size={24} />
          <Typography link size="large" onClick={() => router.push("/login")}>
            Return to Sign In
          </Typography>
          <Space size={24} />
          <Typography size="large" className={styles.signUpLink}>
            Don`t have an account? <span onClick={() => router.push("/signup")}>Sign up</span>
          </Typography>
        </>
      ) : (
        <>
          <Typography center size="large" gray>Please see the code from the message on your email</Typography>
          <Space size={24} />
          <Input
            name="code"
            size="large"
            placeholder="Enter code"
            onChange={formik.handleChange}
            value={formik.values.code}
          />
          <Space size={24} />
          <Input
            name="newPassword"
            size="large"
            type="password"
            placeholder="Enter new password"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
          />
          <Space size={24} />
          <Input
            name="confirmNewPassword"
            size="large"
            type="password"
            placeholder="Retype new password"
            onChange={formik.handleChange}
            value={formik.values.confirmNewPassword}
          />
          <Space size={24} />
          {["INVALID_PASSWORD", "MUST_MATCH"].includes(formik.errors.newPassword || "") && (
            <>
              <Typography red size="large">
                {formik.errors.newPassword === "INVALID_PASSWORD"
                  // eslint-disable-next-line max-len
                  && "Your password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
                }
                {formik.errors.newPassword === "MUST_MATCH" && "Passwords do not match"}
              </Typography>
              <Space size={24} />
            </>
          )}
          {errorMessage && (
            <>
              <Typography red size="large">{errorMessage}</Typography>
              <Space size={24} />
            </>
          )}
          <Button
            size="large"
            type="primary"
            disabled={!formik.isValid}
            loading={loading}
            htmlType='submit'
            onClick={() => formik.handleSubmit()}
          >
            Continue
          </Button>
        </>
      )}
    </div>
  )
}

export default Page
