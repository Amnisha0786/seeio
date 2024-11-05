import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useAccessLevel, useAppDispatch } from '@/hooks'
import Typography from '@/components/typography'
import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import styles from './page.module.scss'
import { getAccountInfo, setSelectedCompanyId } from '@/store/actions'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'


const Step5 = ({ companyNumber }: { companyNumber: string }) => {
  let storedCompanyObejct: any
  const router = useRouter()
  const dispatch = useAppDispatch();
  const accessLevel = useAccessLevel()
  const storedSelectedCompanyId = localStorage.getItem('companyObject');
  if (storedSelectedCompanyId) {
    storedCompanyObejct = JSON.parse(storedSelectedCompanyId) || {}
  }

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""

  useEffect(() => {
    async function getCompanyData() {
      await dispatch(getAccountInfo());
    }
    getCompanyData();
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'signup_thank_you',
      page_url: url,
      user_id: accessLevel?.userId && accessLevel?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  return (
    <FlexBox className={styles.bodyContent} flexDirection="column">
      <Space size={200} />
      <FlexBox flexDirection="column" alignItems="center">
        <Image
          src="/icons/green-circle-checkmark-icon.svg"
          alt="icon"
          width={120}
          height={120}
        />
        <Space size={42} />
        <Typography size="giant">
          You have completed all the steps
        </Typography>
        <Space size={32} />
        <Typography size="large" gray center>
          All functions are now open to you.
          <br />
          You can find the completed company data in Corporate Setup
        </Typography>
        <Space size={42} />
        <Button
          type="primary"
          className={styles.nextButton}
          onClick={() => {
            dispatch(setSelectedCompanyId(companyNumber));

            if (accessLevel?.userId && storedCompanyObejct[`${accessLevel?.userId}`] !== undefined) {
              localStorage.setItem('companyObject', JSON.stringify({
                ...storedCompanyObejct,
                [`${accessLevel?.userId}`]: companyNumber,
              }));
              router.push("/dashboard")
              trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
                user_id: accessLevel?.userId && accessLevel?.userId,
                actioned_at: new Date().valueOf(),
                platform: PLATFORM.WEB,
              });
            }
          }
          }
        >
          Done
        </Button>
      </FlexBox>
      <Space size={200} />
    </FlexBox>
  )
}

export default Step5
