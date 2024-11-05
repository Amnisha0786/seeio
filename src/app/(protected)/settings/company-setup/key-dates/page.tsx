"use client"

import React, { useState, useEffect } from 'react'
import { Row, Col, DatePicker } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import dayjs from "dayjs";

import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import Clickable from '@/components/clickable'
import Button from '@/components/button'
import Icon from '@/components/icon'
import Space from '@/components/space'
import Loading from '@/components/loading'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import styles from './page.module.scss'
import { COMPANY_USER_ACCESS_LEVEL } from '@/models'

type TForm = {
  reviewDate: dayjs.Dayjs | null
  dateOfIncorporation: dayjs.Dayjs | null
  confirmationStatementDue: dayjs.Dayjs | null
  accountingReferenceDate: dayjs.Dayjs | null
  annualAccountsReviewDate: dayjs.Dayjs | null
  annualAccountsDue: dayjs.Dayjs | null
  annualAccountsMadeUpTo: dayjs.Dayjs | null
}

const validationSchema = yup.object().shape({
  reviewDate: yup.string().required("Review date is required"),
  annualAccountsReviewDate: yup.string().required("An annual accounts review date is required"),
})

type TKeyDates = {
  confirmationStatementDue: string
  dateOfIncorporation: string,
  annualAccountsDue: string,
  annualAccountsMadeUpTo: string,
  accountingReferenceDate: {
    day: string
    month: string
  }
}

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [initing, setIniting] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [dates, setDates] = useState<TKeyDates | null>(null)
  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()

  const fetchData = async () => {
    if (!companyId || !userAccess) return

    try {
      setIniting(true)
      const result = await API.getCompanyKeyDates({
        companyId
      })

      setDates(result)
    } finally {
      setIniting(false)
    }
  }

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [companyId, userAccess])

  const formik = useFormik<TForm>({

    initialValues: dates ? {
      reviewDate: dates?.confirmationStatementDue ? dayjs(dates.confirmationStatementDue).subtract(1, "month") : null,
      dateOfIncorporation: dates.dateOfIncorporation ? dayjs(dates.dateOfIncorporation): null,
      confirmationStatementDue: dates.confirmationStatementDue ? dayjs(dates.confirmationStatementDue) :null,
      accountingReferenceDate: dates?.accountingReferenceDate ?
        dayjs(`${dayjs().year()}-${dates?.accountingReferenceDate?.month}-${dates?.accountingReferenceDate?.day}`) : null,
      annualAccountsDue: dates.annualAccountsDue ? dayjs(dates.annualAccountsDue) : null,
      annualAccountsMadeUpTo: dates.annualAccountsMadeUpTo ? dayjs(dates.annualAccountsMadeUpTo) : null,
      annualAccountsReviewDate: dates.annualAccountsDue ? dayjs(dates.annualAccountsDue).subtract(6, "month") :null,
    } : {
      reviewDate: dayjs(),
      dateOfIncorporation: dayjs(),
      confirmationStatementDue: dayjs(),
      accountingReferenceDate: dayjs(),
      annualAccountsDue: dayjs(),
      annualAccountsMadeUpTo: dayjs(),
      annualAccountsReviewDate: dayjs(),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values): Promise<void> => {
      if (!companyId) return

      setLoading(true)

      try {
        await API.updateCompanyKeyDates({
          companyId,
          confirmationReviewDate: values.reviewDate?.toString() || '',
          annualAccountsReviewDate: values.annualAccountsReviewDate?.toString() || '',
        })

        setIsEdit(false)
      } finally {
        setLoading(false)
      }
    }
  });

  if (initing) return <Loading size="small" />

  return (
    <FlexBox className={styles.page} flexDirection="column">
      <FlexBox className={styles.contentBody} flexDirection="column">
        <FlexBox justifyContent="space-between">
          <Typography size="huge">Key Details</Typography>
          {(!isEdit && userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER) && (
            <Clickable onClick={() => setIsEdit(true)}>
              <Icon name="edit-icon" size={24} />
            </Clickable>
          )}
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Confirmation statement due</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  disabled
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("confirmationStatementDue", value)}
                  value={formik.values.confirmationStatementDue}
                />
              ) : (
                <Typography size="large">{formik.values.confirmationStatementDue?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Review Date</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("reviewDate", value)}
                  value={formik.values.reviewDate}
                />
              ) : (
                <Typography size="large">{formik.values.reviewDate?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Accounting Reference Date</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  disabled
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("accountingReferenceDate", value)}
                  value={formik.values.accountingReferenceDate}
                />
              ) : (
                <Typography size="large">{formik.values.accountingReferenceDate?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Annual Accounts Review Date</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("annualAccountsReviewDate", value)}
                  value={formik.values.annualAccountsReviewDate}
                />
              ) : (
                <Typography size="large">{formik.values.annualAccountsReviewDate?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <div className={styles.divider} />
        <Space size={22} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Date of Incorporation</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  disabled
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("dateOfIncorporation", value)}
                  value={formik.values.dateOfIncorporation}
                />
              ) : (
                <Typography size="large">{formik.values.dateOfIncorporation?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Confirmation statement due</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  disabled
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("confirmationStatementDue", value)}
                  value={formik.values.confirmationStatementDue}
                />
              ) : (
                <Typography size="large">{formik.values.confirmationStatementDue?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
        </Row>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={8}>
            <FlexBox flexDirection="column">
              <Typography>Accounting Reference Date</Typography>
              <Space size={8} />
              {isEdit ? (
                <DatePicker
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  disabled
                  onChange={(value) => formik.setFieldValue("accountingReferenceDate", value)}
                  value={formik.values.accountingReferenceDate}
                />
              ) : (
                <Typography size="large">{formik.values.accountingReferenceDate?.format('DD/MM/YYYY') || "-"}</Typography>
              )}
            </FlexBox>
          </Col>
        </Row>
      </FlexBox>
      <Space size={24} />
      {isEdit && (
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </FlexBox>
      )}
    </FlexBox>
  )
}

export default Page
