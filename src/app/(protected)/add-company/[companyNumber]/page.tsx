"use client"

import React, { useEffect, useState } from 'react'
import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from 'antd'

import Typography from '@/components/typography'
import Container from '@/components/container'
import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import StepBar from '@/components/step-bar'
import ScollablePage from '@/components/scollable-page'
import styles from './page.module.scss'
import Step1 from './step-1'
import Step2 from './step-2'
import Step3 from './step-3'
import Step4 from './step-4'
import Step5 from './step-5'
import { useAccessLevel } from '@/hooks'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

const STEPS = [{
  value: 1,
  title: "Outline of the Company",
  heading: "Company Details",
}, {
  value: 2,
  title: "Department",
  heading: "Department"
},
{
  value: 3,
  title: "People",
  heading: "People",
}, {
  value: 4,
  title: "Key Dates",
  heading: "Key Dates"
}]

const Page = ({ params }: { params: { companyNumber: string } }) => {
  const [step, setStep] = useState(1)
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const useAccess = useAccessLevel()
  const url = typeof window !== 'undefined' ? window.location.href : ""

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_confirm_company',
      page_url: url,
      user_id: useAccess?.userId && useAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });

    trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
      user_id: useAccess?.userId && useAccess?.userId,
      actioned_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, [])

  return (
    <ScollablePage className={styles.page}>
      <Space size={52} />
      <Container>
        <FlexBox justifyContent="space-between" alignItems="center">
          <FlexBox flexDirection="column" width={192}>
            <FlexBox gap={6} alignItems='center'>
              <Typography serif size="huge" bold>{STEPS?.find((value: { value: number }) => value.value === step)?.heading}</Typography>
              {step === 3 && (
                <Tooltip placement='top' title={"Add the People and team members who you want to involve in the governance framework.  These are likely to be senior managment, board members and investors."}
                  color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}
                  className={styles.cursor}>
                  <InfoCircleOutlined className={styles.iconSize} />
                </Tooltip>
              )}
              {  step === 2 && (
                <Tooltip placement='top' title={"Add in any main business areas such as finance, product development or sales and marketing.  Choose departments relevant to your business and assign an owner who will be reminded about matters relevant to the department."}
                  color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}
                  className={styles.cursor}>
                  <InfoCircleOutlined className={styles.iconSize} />
                </Tooltip>
              )}
            </FlexBox>
            <Space size={12} />
            <Typography className={styles.subTitle} serif>Setup your company</Typography>
          </FlexBox>
          <Space size={30} horizontal />
          <StepBar steps={STEPS} className={styles.stepBar} activeIndex={step - 1} />
        </FlexBox>
        <Space size={24} />
        {step === 1 && <Step1 onNext={() => setStep(2)} companyNumber={params.companyNumber} />}
        {step === 2 && <Step2 onNext={() => setStep(3)} companyNumber={params.companyNumber} />}
        {step === 3 && <Step3 onNext={() => setStep(4)} companyNumber={params.companyNumber} />}
        {step === 4 && <Step4 onNext={() => setStep(5)} companyNumber={params.companyNumber} />}
        {step === 5 && <Step5 companyNumber={params.companyNumber} />}
      </Container>
      <Space size={52} />
    </ScollablePage>
  )
}

export default Page;
