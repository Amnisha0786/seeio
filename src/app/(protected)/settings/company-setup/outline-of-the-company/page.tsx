"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Input, Row, Col, Select, Tooltip } from 'antd'
import { InfoCircleOutlined, EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons"
import Image from 'next/image'
import { useFormik } from 'formik'
import * as yup from 'yup'

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Space from '@/components/space'
import Button from '@/components/button'
import Loading from '@/components/loading'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import {
  COMPANY_TYPES,
  COMPANY_SIZES,
  BOARD_COMMITTEE_OPTIONS,
  BUSINESS_DESCRIPTION
} from '@/constants'
import * as API from '@/api'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import { COMPANY_USER_ACCESS_LEVEL, TCompanyDetails } from '@/models'
import { openUploadDialog, getBase64 } from '@/utils/file-reader'
import styles from './page.module.scss'

const { TextArea } = Input;

type TForm = {
  companyName: string
  companyImage?: string
  otherDescription?: string
  companySize: string
  companyType: string
  numBoardMeetings: string
  companySummary: string
  businessDescription: string
  companyTradingName?: string
  sicCode?: string
  logo?: string
  officeAddress?: string
  boardCommitteeOptions: string[] | null
  companyHouseAuthenticationCode?: string
  governmentGateway?: string
  password?: string
}

const validationSchema = yup.object().shape({
  companySize: yup.string().required("Company size is required."),
  numBoardMeetings: yup.number().required("Number Board Meetings is required."),
  companySummary: yup.string().required("Company summary is required."),
  businessDescription: yup.string().required("Business description is required."),
})

const getOfficeAddress = (details: any) => {
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

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [initing, setIniting] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [newCompanyImage, setNewCompanyImage] = useState<{ base64: any, file: File } | null>(null)
  const [company, setCompanyDetails] = useState<TCompanyDetails | null>(null)
  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return

      setIniting(true)

      try {
        const result = await API.getCompanyMetadata({
          companyId
        })
        setCompanyDetails(result)
        setNewCompanyImage(null)
      } catch (e) {
      } finally {
        setIniting(false)
      }
    }

    fetchData()
  }, [companyId])

  const formik = useFormik<TForm>({
    enableReinitialize: true,
    initialValues: company ? {
      companyName: company.companyName,
      companySize: company.companySize,
      companyType: company.companyType,
      numBoardMeetings: `${company.numBoardMeetings ?? ''}`,
      companySummary: company.companySummary,
      businessDescription: company.businessDescription,
      boardCommitteeOptions: company.boardCommitteeOptions,
      sicCode: company?.sicCodes?.[0],
      logo: company?.logo,
      officeAddress: getOfficeAddress(company),
      companyTradingName: company.companyTradingName,
      companyHouseAuthenticationCode: company.companyHouseAuthenticationCode,
      governmentGateway: company?.governmentGateway,
      password: company?.password
    } : {
      companyName: '',
      companySize: '',
      companyType: '',
      numBoardMeetings: '',
      companySummary: '',
      companyTradingName: '',
      businessDescription: '',
      sicCode: '',
      logo: '',
      officeAddress: '',
      boardCommitteeOptions: [],
      companyHouseAuthenticationCode: '',
      governmentGateway: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      if (!company) return

      setLoading(true)

      try {
        const result = await API.updateCompanyMetadata({
          ...values,
          companyId: company.id,
          logoFileName: newCompanyImage?.file.name || '',
        })

        if (result.uploadUrl && newCompanyImage) {
          await API.uploadFiles({
            files: [{
              presignUrl: result.uploadUrl.data,
              file: newCompanyImage.file
            }]
          })
        }
        setIsEdit(false)
      } catch (e: any) {
      } finally {
        setLoading(false)
      }
    }
  });

  const displayCompanyType = useMemo(() => (
    formik.values.companyType && COMPANY_TYPES.find(item => item.value === formik.values.companyType)?.label
  ), [formik.values.companyType])

  const displayCompanySize = useMemo(() => (
    formik.values.companySize && COMPANY_SIZES.find(item => item.value === formik.values.companySize)?.label
  ), [formik.values.companySize])

  const displayBoardCommitteeOptions = useMemo(() => (
    formik.values.boardCommitteeOptions?.map(i => BOARD_COMMITTEE_OPTIONS.find(item => item.value === i)?.label) || []
  ), [formik.values.boardCommitteeOptions])

  const onUploadPhoto = async () => {
    const files = await openUploadDialog()
    const base64 = await getBase64(files[0])

    setNewCompanyImage({
      base64,
      file: files[0]
    })
  }

  if (initing) return <Loading size="small" />

  return (
    <FlexBox className={styles.page} flexDirection="column">
      <FlexBox className={styles.contentBody} flexDirection="column">
        {/*<FlexBox flexDirection="column">*/}
        {/*  <Typography size="huge">Outline of the Company</Typography>*/}
        {/*  <Space size={12} />*/}
        {/*  <Typography size="small" red>*/}
        {/*    ⓘ Please begin by entering your Companies House number and using the import button to select your company.*/}
        {/*    This will auto-populate most of the form with details that Companies House already knows about your company.*/}
        {/*  </Typography>*/}
        {/*  <Space size={16} />*/}
        {/*  <FlexBox alignItems="center">*/}
        {/*    <FlexBox flexDirection="column">*/}
        {/*      <Typography size="small" gray>Companies House Number</Typography>*/}
        {/*      <Space size={4} />*/}
        {/*      <Typography size="large">000000000</Typography>*/}
        {/*    </FlexBox>*/}
        {/*    <Space size={100} horizontal />*/}
        {/*    <Button>*/}
        {/*      Import details from Corporative House*/}
        {/*    </Button>*/}
        {/*  </FlexBox>*/}
        {/*</FlexBox>*/}
        {/*<Space size={24} />*/}
        {/*<div className={styles.divider} />*/}
        {/*<Space size={16} />*/}
        <Typography size="medium" serif blue>
          ⓘ Entering the details below will auto-populate your board agendas,
          meeting papers, executive reports and performance results.
        </Typography>
        <Space size={16} />
        <FlexBox alignItems="center">
          <Image
            className={styles.avatar}
            src={newCompanyImage ? newCompanyImage.base64 : (formik.values.logo || "/placeholder.png")}
            alt="avatar"
            style={{ objectFit: "cover" }}
            width={96}
            height={96}
          />
          <Space horizontal size={24} />
          {isEdit ? (
            <FlexBox flexDirection="column" alignItems="center">
              <Button onClick={onUploadPhoto}>Upload Photo</Button>
              <Space size={10} />
              <Clickable onClick={() => {
                setNewCompanyImage(null)
                if (formik.values.logo) {
                  formik.setFieldValue('logo', '')
                }
              }
              }>
                <Typography size="large" gray>remove</Typography>
              </Clickable>
            </FlexBox>
          ) : (
            <FlexBox flexDirection="column">
              <Typography size="large">{formik.values.companyName}</Typography>
              <Space size={12} />
              <Typography gray size="large">{formik.values.companyTradingName || '-'}</Typography>
              <Space size={12} />
              <Typography gray size="large">{formik.values.businessDescription || '-'}</Typography>
            </FlexBox>
          )}
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Company Name" errorMessage={formik.errors.companyName}>
                {isEdit ? (
                  <Input
                    name="companyName"
                    size="large"
                    readOnly
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.companyName}
                    status={formik.errors.companyName && "error"}
                  />
                ) : (
                  <Typography size="large">{formik.values.companyName || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Trading Name">
                {isEdit ? (
                  <Input
                    name="companyTradingName"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.companyTradingName}
                  />
                ) : (
                  <Typography size="large">{formik.values.companyTradingName || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Business description" errorMessage={formik.errors.businessDescription}>
                {isEdit ? (
                  <Select
                    size="large"
                    placeholder="Select"
                    options={BUSINESS_DESCRIPTION}
                    onChange={(value) => formik.setFieldValue("businessDescription", value)}
                    value={formik.values.businessDescription}
                    status={formik.errors.businessDescription && "error"}
                  />
                ) : (
                  <Typography size="large">
                    {formik.values.businessDescription === "Other" ? formik.values.otherDescription || '-' : formik.values.businessDescription || "-"}
                  </Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Type of Company" errorMessage={formik.errors.companyType}>
                {isEdit ? (
                  <Input
                    readOnly
                    name="companyType"
                    size="large"
                    placeholder="Select"
                    onChange={(value) => formik.setFieldValue("companyType", value)}
                    value={COMPANY_TYPES.find(i => i.value === formik.values.companyType)?.label}
                  />
                ) : (
                  <Typography size="large">{displayCompanyType || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Company Size" errorMessage={formik.errors.companySize}>
                {isEdit ? (
                  <Select
                    size="large"
                    placeholder="Select"
                    options={COMPANY_SIZES}
                    onChange={(value) => formik.setFieldValue("companySize", value)}
                    value={formik.values.companySize}
                    status={formik.errors.companySize && "error"}
                  />
                ) : (
                  <Typography size="large">{displayCompanySize || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
          <Col span={8}>

            {isEdit && formik.values.businessDescription === "Other" ? (
              <FlexBox flexDirection="column">
                <Field labelProps={{ gray: true, serif: true }} label="Other description">
                  <Input
                    name="otherDescription"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.otherDescription}
                  />
                </Field>
              </FlexBox>
            ) : (
              <></>
            )}

          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Registered office address">
                {isEdit ? (
                  <Input
                    readOnly
                    name="officeAddress"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.officeAddress}
                  />
                ) : (
                  <Typography size="large">{formik.values.officeAddress || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Board committee options">
                {isEdit ? (
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Select"
                    options={BOARD_COMMITTEE_OPTIONS}
                    onChange={(value) => formik.setFieldValue("boardCommitteeOptions", value)}
                    value={formik.values.boardCommitteeOptions}
                  />
                ) : displayBoardCommitteeOptions.length > 0 ? displayBoardCommitteeOptions.map((item, index) => (
                  <Typography key={index} size="large">{item}</Typography>
                )) : (
                  <Typography size="large">-</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }}
                label="Number of Board Meetings per year" errorMessage={formik.errors.numBoardMeetings} sideContent={<><Space horizontal size={5} />
                  <Tooltip placement='top'
                    title=
                      {"Entering the details below will auto-populate your board agendas, meeting papers, executive reports and performance results."}
                    color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </>}>
                {isEdit ? (
                  <Input
                    name="numBoardMeetings"
                    size="large"
                    type="number"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.numBoardMeetings}
                    status={formik.errors.numBoardMeetings && "error"}
                  />
                ) : (
                  <Typography size="large">{formik?.values?.numBoardMeetings || "-"}</Typography>
                )}
              </Field>
            </FlexBox>

          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="SIC Code">
                {isEdit ? (
                  <Input
                    readOnly
                    name="sicCode"
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.sicCode}
                  />
                ) : (
                  <Typography size="large">{formik.values.sicCode || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Company HouseAuthentication Code" errorMessage={formik.errors.companySummary}>
                {isEdit ? (
                  <Input
                    name="companyHouseAuthenticationCode"
                    type='text'
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.companyHouseAuthenticationCode}
                    status={formik.errors.companyHouseAuthenticationCode && "error"}
                  />
                ) : (
                  <Typography size="large">{formik.values.companyHouseAuthenticationCode || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>

          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Government Gateway" errorMessage={formik.errors.companySummary}>
                {isEdit ? (
                  <Input
                    name="governmentGateway"
                    type='text'
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.governmentGateway}
                    status={formik.errors.governmentGateway && "error"}
                  />
                ) : (
                  <Typography size="large">{formik.values.governmentGateway || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>

          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Password" errorMessage={formik.errors.companySummary}>
                {isEdit ? (
                  <Input.Password
                    name="password"
                    type='password'
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    status={formik.errors.password && "error"}
                    iconRender={(view) =>
                      view ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                ) : (
                  <FlexBox>
                    <Typography size="large">{formik.values.password ? visible ? formik.values.password : "********" : "-"}</Typography>
                    {
                      formik.values.password && (
                        <>
                          <Space horizontal size={14} />
                          <Clickable onClick={() => { setVisible((prev) => !prev) }}>
                            {visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                          </Clickable>
                        </>
                      )
                    }

                  </FlexBox>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Company Registration Number" errorMessage={formik.errors.companySummary}>
                {isEdit ? (
                  <Input
                    name="id"
                    type='text'
                    size="large"
                    disabled
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={company?.id || "-"}
                  />
                ) : (
                  <Typography size="large">{company?.id || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <div className={styles.divider} />
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <FlexBox flexDirection="column">
              <Field labelProps={{ gray: true, serif: true }} label="Company Summary" errorMessage={formik.errors.companySummary}>
                {isEdit ? (
                  <TextArea
                    name="companySummary"
                    size="large"
                    rows={4}
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={formik.values.companySummary}
                    status={formik.errors.companySummary && "error"}
                  />
                ) : (
                  <Typography size="large">{formik.values.companySummary || "-"}</Typography>
                )}
              </Field>
            </FlexBox>
          </Col>
        </Row>
      </FlexBox>
      <Space size={25} />
      <FlexBox justifyContent="flex-end">
        {isEdit ? (
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        ) :
          userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <Button
            onClick={() => setIsEdit(true)}
          >
            Edit
          </Button>
        }
      </FlexBox>
    </FlexBox>
  )
}

export default Page
