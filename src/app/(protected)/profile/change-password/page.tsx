"use client"

import { useState } from 'react'
import { Input, Row, Col, Form } from 'antd'
import { useFormik, FormikErrors } from 'formik'
import * as yup from 'yup'

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Field from '@/components/field'
import BreadCrumbs from '@/components/breadcrumbs'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Toast from '@/components/toast'
import * as API from '@/api'
import styles from './page.module.scss'

type TForm = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required."),
  newPassword: yup.string().required("New password is required."),
  confirmNewPassword: yup.string().required("Confirm new password is required."),
})

const Page = () => {
  const [loading, setLoading] = useState(false)
  const formik = useFormik<TForm>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: (values) => {
      const errors: FormikErrors<typeof values> = {}

      if (values.newPassword && values.confirmNewPassword && values.newPassword !== values.confirmNewPassword) {
        errors.confirmNewPassword = "Passwords do not match"
      }

      // eslint-disable-next-line max-len
      if (values.newPassword && !values.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)) {
        errors.newPassword = "Your password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      }

      return errors
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        await API.changePassword({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword
        })

        Toast.success("Change password successfully")
      } catch (e: any) {
        Toast.error(e.message)
      } finally {
        setLoading(false)
      }
    }
  });

  return (
    <ScollablePage className={styles.page}>
      <Space size={24} />
      <Container>
        <BreadCrumbs
          items={[
            { title: 'Profile', link: "/profile" },
            { title: 'Change password', link: "/profile/change-password" }
          ]}
          activeItem="Change password"
        />
        <Space size={24} />

        <Form>
          <FlexBox className={styles.contentBody}>
            <div className={styles.width}>
              <FlexBox alignItems="center" flex={1}>
                <Typography size="huge">Change Password</Typography>
              </FlexBox>
              <Space size={24} />
              <Row gutter={[30, 0]}>
                <Col span={16}>
                  <FlexBox flexDirection="column">
                    <Field label="Current Password" errorMessage={formik.errors.currentPassword}>
                      <Input
                        name="currentPassword"
                        size="large"
                        type="password"
                        placeholder="Enter here"
                        onChange={formik.handleChange}
                        value={formik.values.currentPassword}
                        status={formik.errors.currentPassword && "error"}
                      />
                    </Field>
                  </FlexBox>
                </Col>
              </Row>
              <Space size={24} />
              <Row gutter={[30, 0]}>
                <Col span={16}>
                  <FlexBox flexDirection="column">
                    <Field label="New Password" errorMessage={formik.errors.newPassword}>
                      <Input
                        name="newPassword"
                        size="large"
                        type="password"
                        placeholder="Enter here"
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                        status={formik.errors.newPassword && "error"}
                      />
                    </Field>
                  </FlexBox>
                </Col>
              </Row>
              <Space size={24} />
              <Row gutter={[30, 0]}>
                <Col span={16}>
                  <FlexBox flexDirection="column">
                    <Field label="Re-type Password" errorMessage={formik.errors.confirmNewPassword}>
                      <Input
                        name="confirmNewPassword"
                        size="large"
                        type="password"
                        placeholder="Enter here"
                        onChange={formik.handleChange}
                        value={formik.values.confirmNewPassword}
                        status={formik.errors.confirmNewPassword && "error"}
                      />
                    </Field>
                  </FlexBox>
                </Col>
              </Row>
            </div>
            <div className={styles.width}>
              <Typography size='big' gray>Password rules:</Typography>
              <Space size={20} />
              <Typography size='large' blue>
                Passwords must be at least 8 characters and contain 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character.
              </Typography>
              <Space size={10} />
              <Typography size='large' blue>
                The following characters count as special characters :
              </Typography>
              <Space size={5} />
              <Typography size='large' blue>
                {"(^ $ * . [ ] { } ( ) ? - \" ! @ # % & / \\ , > < ' : ; | _ ~ ` + =)."}
              </Typography>
              <Space size={10} />
              <Typography size='large' blue>
                Non-leading, non-trailing space character is also treated as a special character.

              </Typography>
            </div>
          </FlexBox>


          <Space size={24} />
          <FlexBox justifyContent="flex-end">
            <Button
              type="primary"
              onClick={() => formik.handleSubmit()}
              loading={loading}
              htmlType='submit'
            >
              Save
            </Button>
          </FlexBox>
        </Form>

      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page
