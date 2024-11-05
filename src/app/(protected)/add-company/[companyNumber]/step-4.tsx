import React, { useEffect, useState } from 'react'
import { Row, Col, DatePicker } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import dayjs, { Dayjs } from "dayjs";

import Typography from '@/components/typography'
import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import styles from './page.module.scss'
import * as API from '@/api'
import Toast from '@/components/toast';
import Loading from '@/components/loading';
import useAmplitudeContext from '@/hooks/amplitude'
import { useAccessLevel } from '@/hooks'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

type TForm = {
  reviewDate: Dayjs
  dateOfIncorporation: Dayjs
  confirmationStatementDue: Dayjs
  accountingReferenceDate: Dayjs
  annualAccountsReviewDate: Dayjs
  annualAccountsDue: Dayjs
  annualAccountsMadeUpTo: Dayjs
}

const validationSchema = yup.object().shape({
  reviewDate: yup.string().required("Review date is required"),
  annualAccountsReviewDate: yup.string().required("An annual accounts review date is required"),
})

const Step4 = ({ onNext, companyNumber }: { onNext: () => void, companyNumber: string }) => {
  const [loading, setLoading] = useState(false)
  const [initing, setIniting] = useState(false)
  const [details, setDetails] = useState({
    confirmationStatementDue: "",
    dateOfIncorporation: "",
    annualAccountsDue: "",
    annualAccountsMadeUpTo: "",
    accountingReferenceDate: {
      day: "",
      month: ""
    }
  })

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url =  typeof window !== 'undefined' ? window.location.href: ""
  const useAccess = useAccessLevel()

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_key_dates',
      page_url: url,
      user_id: useAccess?.userId && useAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, [])

  const fetchData = async () => {

    try {
      setIniting(true)
      const result = await API.getCompanyKeyDates({
        companyId: companyNumber
      })

      setDetails(result)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [companyNumber])

  const formik = useFormik<TForm>({
    // validateOnMount: true,
    initialValues: {
      reviewDate: details?.confirmationStatementDue ? dayjs(details?.confirmationStatementDue).subtract(1, "month") : dayjs(),
      dateOfIncorporation: details?.dateOfIncorporation ? dayjs(details?.dateOfIncorporation) : dayjs(),
      confirmationStatementDue: details?.confirmationStatementDue ? dayjs(details?.confirmationStatementDue) : dayjs(),
      accountingReferenceDate: details?.accountingReferenceDate?.month ?
        dayjs(`2022-${details?.accountingReferenceDate.month}-${details?.accountingReferenceDate.day}`)
        : dayjs(),
      annualAccountsDue: details?.annualAccountsDue ? dayjs(details?.annualAccountsDue) : dayjs(),
      annualAccountsMadeUpTo: details?.annualAccountsMadeUpTo ? dayjs(details?.annualAccountsMadeUpTo) : dayjs(),
      annualAccountsReviewDate: details?.annualAccountsDue ? dayjs(details?.annualAccountsDue).subtract(6, "month") : dayjs(),
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)
      try {
        await API.updateCompanyKeyDates({
          companyId: companyNumber,
          confirmationReviewDate: values.reviewDate.toString(),
          annualAccountsReviewDate: values.annualAccountsReviewDate.toString(),
        })

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
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Confirmation Statement Due</Typography>
            <Space size={8} />
            <DatePicker
              name="confirmationStatementDue"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              // onChange={(value) => formik.setFieldValue("confirmationStatementDue", value)}
              disabled
              value={formik.values.confirmationStatementDue}
            />
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Confirmation Statement Review Date</Typography>
            <Space size={8} />
            <DatePicker
              name="reviewDate"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value) => formik.setFieldValue("reviewDate", value)}
              defaultValue={formik.values.confirmationStatementDue.subtract(1, "month")}
            />
          </FlexBox>
        </Col>
      </Row>
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Annual Accounts Due</Typography>
            <Space size={8} />
            <DatePicker
              name="annualAccountsDue"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              disabled
              value={formik.values.annualAccountsDue}
            />
          </FlexBox>
        </Col>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Annual Accounts Review Date</Typography>
            <Space size={8} />
            <DatePicker
              name="annualAccountsReviewDate"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              onChange={(value) => formik.setFieldValue("annualAccountsReviewDate", value)}
              defaultValue={formik.values.annualAccountsReviewDate.subtract(6, "month")}
            />
          </FlexBox>
        </Col>
      </Row>
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Last Accounts Made Up To</Typography>
            <Space size={8} />
            <DatePicker
              name="annualAccountsMadeUpTo"
              size="large"
              placeholder="__/__/____"
              format="DD/MM/YYYY"
              disabled
              value={formik.values.annualAccountsMadeUpTo}
            />
          </FlexBox>
        </Col>
      </Row>
      <Space size={24} />
      <Row gutter={[30, 0]}>
        <Col span={8}>
          <FlexBox flexDirection="column">
            <Typography>Accounting Reference Date</Typography>
            <Space size={8} />
            <DatePicker
              name="accountingReferenceDate"
              size="large"
              placeholder="__/__/____"
              format={"Do MMMM"}
              disabled
              value={formik.values.accountingReferenceDate}
            />
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
            <DatePicker
              name="dateOfIncorporation"
              size="large"
              placeholder="__/__/____"
              disabled
              format="DD/MM/YYYY"
              // onChange={(value) => formik.setFieldValue("dateOfIncorporation", value)}
              value={formik.values.dateOfIncorporation}
            />
          </FlexBox>
        </Col>
      </Row>
      <Space size={40} />
      <FlexBox justifyContent="flex-end">
        <Button
          type="primary"
          loading={loading}
          className={styles.nextButton}
          onClick={() => formik.handleSubmit()}
        >
          Done
        </Button>
      </FlexBox>
    </FlexBox>
  )
}

export default Step4
