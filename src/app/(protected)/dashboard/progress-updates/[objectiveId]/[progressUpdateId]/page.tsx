"use client"

import { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'

import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Button from '@/components/button'
import Icon from '@/components/icon'
import FlexBox from '@/components/flex-box'
import BreadCrumbs from '@/components/breadcrumbs'
import Typography from '@/components/typography'
import Loading from '@/components/loading'
import Card from '@/components/card'
import { useSelectedAccountCompany } from '@/hooks'
import * as API from "@/api";
import { TProgressUpdateDetails } from '@/models'
import styles from './page.module.scss'

const Page = ({ params: { progressUpdateId, objectiveId } }: { params: { progressUpdateId: string, objectiveId: string } }) => {
  const [initing, setIniting] = useState(false);
  const [data, setData] = useState<TProgressUpdateDetails | null>(null);
  const companyId = useSelectedAccountCompany()?.companyId
  const router = useRouter()

  const fetchData = useCallback(async () => {
    if (!companyId) return
    setIniting(true);

    try {
      const result = await API.getProgressUpdateDetails({
        companyId,
        objectiveId,
        updateId: progressUpdateId
      });
      setData(result);
    } finally {
      setIniting(false);
    }
  }, [objectiveId, companyId, progressUpdateId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (initing) return <Loading size='small' />
  if (!data) return null

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <BreadCrumbs
            items={[{
              title: "Progress update",
              link: '/dashboard/progress-updates/'
            }, {
              title: data?.keyIndicatorName || "Progress update form"
            }]}
          />
          <FlexBox>
            <Button
              icon={<Icon name="edit" size={24} color="#9FC33C" />}
              onClick={() => router.push(`/dashboard/progress-updates/${objectiveId}/${progressUpdateId}/edit`)}
            />
            <Space size={16} horizontal />
            <Button
              icon={<Icon name="print" size={24} color="#9FC33C" />}
              onClick={() => null}
            />
            <Space size={16} horizontal />
            <Button
              icon={<Icon name="delete" size={24} color="#9FC33C" />}
              onClick={() => null}
            />
            <Space size={16} horizontal />
            <Button
              icon={<Icon name="upload" size={24} color="#9FC33C" />}
              onClick={() => null}
            />
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <Card>
          <Typography>
            Needs Review
          </Typography>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column">
              <Typography gray>
                Date
              </Typography>
              <Space size={8} />
              <Typography>
                {moment(data.deadline).format("DD/MM/YYYY")}
              </Typography>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column">
              <Typography gray>
                Review Date
              </Typography>
              <Space size={8} />
              <Typography>
                {moment(data.requestedDate).format("DD/MM/YYYY")}
              </Typography>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column">
              <Typography gray>
                Last Date
              </Typography>
              <Space size={8} />
              <Typography>
                {moment(data.lastEdited).format("DD/MM/YYYY")}
              </Typography>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Notes
            </Typography>
            <Space size={8} />
            <Typography>
              {data.progressSummary}
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column">
              <Typography gray>
                Type
              </Typography>
              <Space size={8} />
              <Typography>
                {data.metricType}
              </Typography>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column">
              <Typography gray>
                Reference number
              </Typography>
              <Space size={8} />
              <Typography>
                -
              </Typography>
            </FlexBox>
          </FlexBox>
        </Card>
        <Space size={24} />
        <Card>
          <FlexBox justifyContent="space-between">
            <Typography size="huge">
              Report
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox className={styles.sectionGroup} flexDirection="column">
            <Typography size="huge" bold>
              Objective
            </Typography>
            <Space size={16} />
            <FlexBox flexDirection="column">
              <Typography gray serif>
                Name
              </Typography>
              <Space size={8} />
              <Typography serif size='large'>
                {data.objectiveName}
              </Typography>
            </FlexBox>
            <Space size={10} />
            <FlexBox flexDirection="column">
              <Typography gray serif>
                Description
              </Typography>
              <Space size={8} />
              <Typography serif size='large'>
                {data?.objectiveDescription}
              </Typography>
            </FlexBox>
          </FlexBox>
          <Space size={24} />

          <FlexBox className={styles.sectionGroup} flexDirection="column">
            <Typography size="huge" bold>
              Key Indicator
            </Typography>
            <Space size={16} />
            <FlexBox flexDirection="column">
              <Typography gray serif>
                Indicator Name
              </Typography>
              <Space size={8} />
              <Typography serif size='large'>
                {data?.keyIndicatorName}
              </Typography>
            </FlexBox>
            <Space size={10} />
            <FlexBox flexDirection="column">
              <Typography gray serif>
                Indicator Description
              </Typography>
              <Space size={8} />
              <Typography serif size='large'>
                {data?.keyIndicatorDescription}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Achievements
            </Typography>
            <Space size={8} />
            <Typography>
              {data.achievements}
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Current work
            </Typography>
            <Space size={8} />
            <Typography>
              {data.currentWork}
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Outlook
            </Typography>
            <Space size={8} />
            <Typography>
              {data.outlook}
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Obstacles
            </Typography>
            <Space size={8} />
            <Typography>
              {data.obstaclesPreventingProgress}
            </Typography>
          </FlexBox>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <Typography gray>
              Specific needs
            </Typography>
            <Space size={8} />
            <Typography>
              {data.specificNeeds}
            </Typography>
          </FlexBox>
        </Card>
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Page
