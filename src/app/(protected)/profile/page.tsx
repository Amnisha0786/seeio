"use client"

import { useState, useEffect } from 'react'
import { Input, Row, Col, Checkbox } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Field from '@/components/field'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Clickable from '@/components/clickable'
import Loading from '@/components/loading'
import Toast from '@/components/toast'
import * as API from '@/api'
import styles from './page.module.scss'
import { TCongif } from '@/models'

type TForm = {
  familyName: string
  givenName: string
  email: string
  marketingPreferences?: boolean;
};

const validationSchema = yup.object().shape({
  familyName: yup.string().required(),
  givenName: yup.string().required(),
  email: yup.string().email().required(),
})

const Page = () => {
  const [initing, setIniting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TForm | null>(null)
  const [configdata, setConfigData] = useState<TCongif>()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await API.fetchAttributes()
        const configResponse = await API.getConfig()
        setConfigData(configResponse)
        setData({
          familyName: attributes?.family_name || "",
          givenName: attributes?.given_name || "",
          email: attributes?.email || "",
          marketingPreferences: configResponse?.isConsentedToMarketing ? configResponse?.isConsentedToMarketing : false
        })
      } finally {
        setIniting(false)
      }
    }

    fetchData()
  }, [])

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    initialValues: data || {
      familyName: '',
      givenName: '',
      email: '',
      marketingPreferences: false,
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)
      try {
        await API.updateAttributes(values)
        await API.updateConfig({
          havePlatformTour: {
            businessHealth: configdata?.havePlatformTour?.businessHealth ? configdata?.havePlatformTour?.businessHealth : false,
            register: configdata?.havePlatformTour?.register ? configdata?.havePlatformTour?.register : false,
            record: configdata?.havePlatformTour?.record ? configdata?.havePlatformTour?.record : false,
            objective: configdata?.havePlatformTour?.objective ? configdata?.havePlatformTour?.objective : false
          },
          email: values.email,
          firstName: values.familyName,
          lastName: values.givenName,
          isConsentedToMarketing: values.marketingPreferences
        })
        Toast.success("Update profile successfully")
      } finally {
        setLoading(false)
      }
    }
  });

  if (initing) return <Loading size="small" />

  return (
    <ScollablePage className={styles.page}>
      <Space size={24} />
      <Container>
        <FlexBox flexDirection="column" className={styles.contentBody}>
          <Typography size="huge">Profile</Typography>
          <Space size={24} />
          <Row gutter={[30, 0]}>
            <Col span={8}>
              <FlexBox flexDirection="column">
                <Field
                  label="First name"
                  errorMessage={formik.errors.familyName}
                >
                  <Input
                    name="familyName"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.familyName}
                    status={formik.errors.familyName && "error"}
                  />
                </Field>
              </FlexBox>
            </Col>
            <Col span={8}>
              <FlexBox flexDirection="column">
                <Field label="Last name" errorMessage={formik.errors.givenName}>
                  <Input
                    name="givenName"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.givenName}
                    status={formik.errors.givenName && "error"}
                  />
                </Field>
              </FlexBox>
            </Col>
          </Row>
          <Space size={24} />
          <Row gutter={[30, 0]}>
            <Col span={8}>
              <FlexBox flexDirection="column">
                <Field label="Email adress" errorMessage={formik.errors.email}>
                  <Input
                    name="email"
                    size="large"
                    placeholder="Enter here"
                    readOnly
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    status={formik.errors.email && "error"}
                  />
                </Field>
              </FlexBox>
            </Col>
          </Row>
          <Space size={24} />
          <Row gutter={[30, 0]}>
            <Col>
              <FlexBox>
                <FlexBox flexDirection="column">
                  <Field label="Marketing preferences">
                    <FlexBox justifyContent="space-between" alignItems='center'>
                      <Checkbox
                        name="marketingPreferences"
                        checked={formik.values.marketingPreferences}
                        onChange={formik.handleChange}
                      />
                      <Space horizontal size={12} />

                      <Typography size="large" >
                        I consent to
                        receiving occasional information about governance,{" "}
                        <span>SEEIO</span>, product developments and I can
                        unsubscribe at any time.
                      </Typography>
                    </FlexBox>
                  </Field>
                </FlexBox>
              </FlexBox>
            </Col>
          </Row>

        </FlexBox>
        <Space size={24} />
        <Clickable onClick={() => router.push("/profile/change-password")}>
          <Typography size="large" className={styles.changePassword}>Change Password</Typography>
        </Clickable>
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            onClick={() => formik.handleSubmit()}
            loading={loading}
          >
            Update
          </Button>
        </FlexBox>
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
