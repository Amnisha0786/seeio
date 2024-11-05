import React, { useEffect, useState } from 'react'
import { Input, Row, Col, Select, Tooltip } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { useFormik } from 'formik'
import * as yup from 'yup'

import Space from '@/components/space'
import FilePicker from '@/shared/formik-file-picker'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Field from '@/components/field'
import {
  COMPANY_TYPES,
  COMPANY_SIZES,
  BOARD_COMMITTEE_OPTIONS,
  getLabel,
  BUSINESS_DESCRIPTION
} from '@/constants'
import * as API from '@/api'
import styles from './page.module.scss'
import Toast from '@/components/toast'
import Loading from '@/components/loading'
import * as AllPlansModal from '@/shared/all-plans-modal';
import useAmplitudeContext from '@/hooks/amplitude'
import { useAccessLevel } from '@/hooks'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'


type TForm = {
  companyTradingName: string
  companySize: string
  companyName: string
  otherDescription?: string
  companyType: string
  companySummary: string
  sicCode: string
  businessDescription: string
  officeAddress: string
  boardCommitteeOptions: string[] | null
  numBoardMeetings: string
  logoFileName: string
  fileBinary: ArrayBuffer | undefined
  companyHouseAuthenticationCode?: string
  governmentGateway?: string
  password?: string
}

const validationSchema = yup.object().shape({
  companyTradingName: yup.string().optional(),
  companySize: yup.string().required("Company size is required."),
  companyType: yup.string().required("Company type is required."),
  numBoardMeetings: yup.number().required("Number of board meetings is required."),
  companySummary: yup.string().required("Company summary is required."),
  businessDescription: yup.string().required("Business description is required."),
  companyHouseAuthenticationCode: yup.string().optional(),
  governmentGateway: yup.string().optional(),
  password: yup.string().optional()
})

interface Address {
  "addressLine1": string
  "locality": string
  "country"?: string
  "postalCode": string
}

interface Details {
  "id": string
  "recType": string
  "companyName": string
  "companyStatus": string
  "companyType": string
  "registeredOfficeAddress": Address
  "canFile": boolean,
  "sicCodes": string[]
}

const getOfficeAddress = (details: Details) => {
  const registeredOfficeAddress = details?.registeredOfficeAddress || {}

  let address = ""

  if (registeredOfficeAddress?.addressLine1) {
    address += registeredOfficeAddress?.addressLine1
  }
  if (registeredOfficeAddress?.locality) {
    address += `${address?.length ? ", " : ""}` + registeredOfficeAddress?.locality
  }
  if (registeredOfficeAddress?.country) {
    address += `${address?.length ? ", " : ""}` + registeredOfficeAddress?.country
  }
  if (registeredOfficeAddress?.postalCode) {
    address += `${address?.length ? ", " : ""}` + ` (${registeredOfficeAddress?.postalCode})`
  }

  return address
}

const Step1 = ({ onNext, companyNumber }: { onNext: () => void, companyNumber: string }) => {
  const [loading, setLoading] = useState(false)
  const [initing, setIniting] = useState(true)
  const [details, setDetails] = useState<Details>({
    companyName: "",
    companyType: "",
    id: "",
    recType: "",
    canFile: false,
    companyStatus: "",
    sicCodes: [],
    registeredOfficeAddress: {
      "addressLine1": "",
      "locality": "",
      "country": "",
      "postalCode": "",
    }
  })

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url =  typeof window !== 'undefined' ? window.location.href: ""
  const useAccess = useAccessLevel()
  
  useEffect(()=>{
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, { 
      page_or_modal_name:'signup_company_outline',
      page_url:url,
      user_id :useAccess?.userId && useAccess?.userId,
      viewed_at : new Date().valueOf(),
      platform:PLATFORM.WEB,
    });
  },[])

  useEffect(() => {
    const fetchData = async () => {

      try {
        const result = await API.getCompanyMetadata({
          companyId: companyNumber
        });

        setDetails(result)
      } catch (err: any) {
        Toast.error(err.message || "Something went wrong.")
      } finally {
        setIniting(false)
      }
    }

    AllPlansModal?.close(true)
    fetchData()
  }, [companyNumber])

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    initialValues: {
      companyTradingName: '',
      companyName: details?.companyName || '',
      companySize: '',
      companyType: details?.companyType || '',
      numBoardMeetings: '',
      companySummary: '',
      sicCode: details?.sicCodes?.length ? details?.sicCodes.join(", ") : "",
      businessDescription: "",
      officeAddress: getOfficeAddress(details),
      boardCommitteeOptions: [],
      logoFileName: '',
      fileBinary: undefined,
      companyHouseAuthenticationCode: '',
      governmentGateway: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        const result = await API.updateCompanyMetadata({
          companyId: companyNumber,
          ...values
        })

        if (result.uploadUrl) {
          await API.uploadFiles({
            files: [{
              presignUrl: result.uploadUrl.data,
              file: values.fileBinary
            }]
          })
        }

        onNext()
      } catch (e: any) {
        Toast.error(e.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    }
  });

  if (initing) return <Loading size="small" />

  return (
    <FlexBox className={styles.bodyContent} flexDirection="column">
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Company Name" labelProps={{ serif: true }}>
              <Input
                name="companyName"
                size="large"
                disabled
                value={formik.values.companyName}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={16}>
          <FlexBox flexDirection="column">
            <Field label="Company Logo" labelProps={{ serif: true }}>
              <FilePicker form={formik} error={formik.errors.logoFileName} resetError={() => formik.setFieldError("logoFileName", undefined)} />
            </Field>
          </FlexBox>
        </Col>
      </Row>
      <Space size={18} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Trading Name" labelProps={{ serif: true }}>
              <Input
                name="companyTradingName"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.companyTradingName}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Type of Company" labelProps={{ serif: true }} errorMessage={formik.errors.companyType}>
              <Input
                size="large"
                disabled
                value={getLabel(COMPANY_TYPES, formik.values.companyType)}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Company Size" labelProps={{ serif: true }} errorMessage={formik.errors.companySize}>
              <Select
                size="large"
                placeholder="Select"
                options={COMPANY_SIZES}
                onChange={(value) => formik.setFieldValue("companySize", value)}
                value={formik.values.companySize}
                status={formik.errors.companySize && "error"}
              />
            </Field>
          </FlexBox>
        </Col>
      </Row>
      <Space size={41} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="SIC Code" labelProps={{ serif: true }}>
              <Input
                name="sicCode"
                size="large"
                placeholder="Enter here"
                disabled
                // onChange={formik.handleChange}
                value={formik.values.sicCode}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Business description" labelProps={{ serif: true }} errorMessage={formik.errors.businessDescription}>
              <Select
                size="large"
                placeholder="Select"
                options={BUSINESS_DESCRIPTION}
                onChange={(value) => formik.setFieldValue("businessDescription", value)}
                value={formik.values.businessDescription}
                status={formik.errors.businessDescription && "error"}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          {formik.values.businessDescription === "Other" && (
            <FlexBox flexDirection="column">
              <Field label="Other description" labelProps={{ serif: true }}>
                <Input
                  name="otherDescription"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.otherDescription}
                />
              </Field>
            </FlexBox>
          )}
        </Col>
      </Row>
      <Space size={18} />
      <Row gutter={[30, 0]}>
        <Col span={24}>
          <FlexBox flexDirection="column" >
            <Field label="Registered office address" labelProps={{ serif: true }}>
              <Input
                name="officeAddress"
                size="large"
                placeholder="Enter here"
                disabled
                // onChange={formik.handleChange}
                value={formik.values.officeAddress}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8} />
      </Row>
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field 
              labelProps={{ gray: true, serif: true }} 
              label="Company House Authentication Code" errorMessage={formik.errors.companyHouseAuthenticationCode}>
              <Input
                name="companyHouseAuthenticationCode"
                type='text'
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.companyHouseAuthenticationCode}
                status={formik.errors.companyHouseAuthenticationCode && "error"}
              />
            </Field>
          </FlexBox>
        </Col>

        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field labelProps={{ gray: true, serif: true }} label="Government Gateway" errorMessage={formik.errors.governmentGateway}>
              <Input
                name="governmentGateway"
                type='text'
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.governmentGateway}
                status={formik.errors.governmentGateway && "error"}
              />
            </Field>
          </FlexBox>
        </Col>

        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field labelProps={{ gray: true, serif: true }} label="Password" errorMessage={formik.errors.password}>
              <Input.Password
                name="password"
                type='password'
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.password}
                status={formik.errors.password && "error"}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Field>
          </FlexBox>
        </Col>
      </Row>
      <Space size={18} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Number of Board Meetings per year" labelProps={{ serif: true }} errorMessage={formik.errors.numBoardMeetings}
              sideContent={<><Space horizontal size={5} />
                <Tooltip placement='top'
                  title=
                    {"Entering the details below will auto-populate your board agendas, meeting papers, executive reports and performance results."}
                  color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                  <InfoCircleOutlined />
                </Tooltip>
              </>}
            >
              <Input
                name="numBoardMeetings"
                size="large"
                type="number"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.numBoardMeetings}
                status={formik.errors.numBoardMeetings && "error"}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Board committee options" labelProps={{ serif: true }}>
              <Select
                size="large"
                mode="multiple"
                placeholder="Select"
                options={BOARD_COMMITTEE_OPTIONS}
                onChange={(value) => formik.setFieldValue("boardCommitteeOptions", value)}
                value={formik.values.boardCommitteeOptions}
              />
            </Field>
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Field label="Company Registration Number" labelProps={{ serif: true }}>
              <Input
                disabled
                name="id"
                size="large"
                placeholder="Enter here"
                value={details?.id || "-"}
              />
            </Field>
          </FlexBox>
        </Col>
      </Row>
      <Space size={24} />
      <div className={styles.divider} />
      <Space size={22} />
      <Row gutter={[30, 0]}>
        <Col span={24}>
          <FlexBox flexDirection="column">
            <Field label="Company Summary" labelProps={{ serif: true }} errorMessage={formik.errors.companySummary}>
              <Input
                name="companySummary"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.companySummary}
                status={formik.errors.companySummary && "error"}
              />
            </Field>
          </FlexBox>
        </Col>
      </Row>
      <Space size={24} />
      <FlexBox justifyContent="flex-end">
        <Button
          type="primary"
          loading={loading}
          className={styles.nextButton}
          onClick={() => formik.handleSubmit()}
        >
          Next
        </Button>
      </FlexBox>
    </FlexBox>
  )
}

export default Step1
