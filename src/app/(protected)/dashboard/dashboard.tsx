'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import ScollablePage from '@/components/scollable-page';
import Container from '@/components/container';
import Space from '@/components/space';
import Clickable from '@/components/clickable';
import Typography from '@/components/typography';
import Card from '@/components/card';
import FlexBox from '@/components/flex-box';
import Table, { TColumn } from '@/components/table';
import GaugeChart from '@/components/gauge-chart';
import Status from '@/components/status';
import * as API from '@/api';
import { COMPANY_USER_ACCESS_LEVEL, TDashboardData, TInvestments, VDR_METADATA_STATUS } from '@/models';
import Chart from '@/components/chart/line-chart';
import { useAccessLevel, useSelectedAccountCompany, useUserName } from '@/hooks';
import styles from './page.module.scss';
import Loading from '@/components/loading';
import Toast from '@/components/toast';
import * as AllPlansModal from '@/shared/all-plans-modal';
import TooltipText from '@/components/tooltip';
import useAmplitudeContext from '@/hooks/amplitude';
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

enum SCORES {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  NEEDS_WORK = 'Needs Work'
}

enum STATUS {
  PREPARE = "Prepare",
  OVERDUE = "Overdue",
  DUE = "Due",
  ALL_GOOD = "All good",
  TO_DO = "To Do",
  MISSING = "Missing",
  PLANNED = "Planned"
}

const categoryColors: any = {
  yellow: '#6fc6a5',
  red: '#ef3d4e',
  green: '#9fc33c'
};

const Dashboard = () => {
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""


  const [dashboardData, setDashboardData] = useState<TDashboardData>();
  const [investments, setInvestments] = useState<TInvestments[]>()
  const [nextMeetingDate, setNextMeetingDate] = useState<string>("")
  const [initing, setIniting] = useState(true);
  const companyId = useSelectedAccountCompany()?.companyId;
  const router = useRouter();
  const userName = useUserName();
  const userAccess = useAccessLevel()

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'Dashboard_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const fetchData = useCallback(async () => {
    if (!companyId) {
      return
    }

    setIniting(true);
    try {
      const result = await API.getDashboardData(companyId);
      const array = [
        {
          name: "Next Board meeting",
          data: result?.boardMeeting?.nextBoardMeetingDate
            ? moment(result?.boardMeeting?.nextBoardMeetingDate).format(
              "DD/MM/YYYY"
            )
            : "To be arranged",
          status: result?.boardMeeting?.status,
          link: "/dashboard/meeting-and-track-targets",
        },
        {
          name: "Progress updates",
          data: result?.progressUpdate?.deadline
            ? moment(result.progressUpdate.deadline).format("DD/MM/YYYY")
            : "To be arranged",
          status: result?.progressUpdate?.status,
          link: "/dashboard/progress-updates",
        },
        {
          name: "Actions from previous meetings",
          data: `${result?.action?.number || ""} Outstanding`,
          status: result?.action?.status,
          link: "/dashboard/meeting-and-track-targets",
        },
      ];

      if (result?.dataroom?.status === VDR_METADATA_STATUS.NOT_STARTED ||
        result?.dataroom?.status === VDR_METADATA_STATUS.IN_PROGRESS) {
        array?.unshift({
          name: "Upload Documents",
          data: ``,
          status: result?.dataroom?.status || "",
          link: result?.dataroom?.vdrId ? `/data-rooms/${result?.dataroom?.vdrId}`:"/data-rooms",
        })
      }

      setInvestments(array);
      setDashboardData(result)
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'plan_options',
        page_url: url,
        user_id: userAccess?.userId && userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
      AllPlansModal?.open(true)
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (record: TInvestments) => {
    let color = "";
    if (record?.status === STATUS.OVERDUE || record?.status === STATUS.MISSING || record?.status === VDR_METADATA_STATUS.NOT_STARTED) {
      color = "red"
    } else if (record?.status === STATUS.PLANNED || record?.status === STATUS.ALL_GOOD) {
      color = "green"
    } else {
      color = "yellow"
    }
    return color
  }

  const getStatusTitle = (record: TInvestments) => {
    let title = "";
    if (record?.status === STATUS.OVERDUE) {
      title = "Overdue"
    } else if (record?.status === STATUS.MISSING) {
      title = "Missing"
    } else if (record?.status === STATUS.PLANNED) {
      title = "Planned"
    } else if (record?.status === STATUS.ALL_GOOD) {
      title = "All good"
    } else if (record?.status === VDR_METADATA_STATUS.NOT_STARTED) {
      title = "Not started"
    } else if (record?.status === VDR_METADATA_STATUS.IN_PROGRESS) {
      title = "In progress"
    } else {
      title = record?.status
    }
    return title
  }

  const getInvestmentReadyColumns = useMemo<TColumn<TInvestments>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        render: (record) => <Typography size='large'>
          {record.name}
        </Typography>,
      },
      {
        key: 'date',
        title: 'Date',
        render: (record) => (
          <Typography gray size='large'>
            {record.data}
          </Typography>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        width: 170,
        render: (record) => <Status title={getStatusTitle(record)} color={getStatusColor(record)} className={styles.statusWidth} />,
      },
    ],
    []
  );

  const data = useMemo(() => {
    return {
      labels: Object.keys(dashboardData?.governance || {}),
      datasets: [
        {
          data: Object.values(dashboardData?.governance || {}),
          backgroundColor: Object.keys(dashboardData?.governance || {})?.map((label: any) => categoryColors?.[label]),
          hoverOffset: 4,
        },
      ],
    }
  }, [dashboardData?.governance]);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const nextBoardMeetingCalculation = useCallback(() => {
    const nextMeeting = dashboardData?.boardMeeting?.nextBoardMeetingDate
    const now = moment()
    const timeDiff = moment.duration(moment(nextMeeting).diff(now))
    const daysDiff = Math.round(timeDiff.asDays())
    const monthsDiff = Math.round(timeDiff.asMonths())
    const yearsDiff = Math.round(timeDiff.asYears())

    let timeToNextMeeting = ''
    if (daysDiff === 0) {
      timeToNextMeeting = 'Today'
    } else if (daysDiff > 0 && daysDiff <= 30) {
      timeToNextMeeting = `${daysDiff} day${daysDiff > 1 ? 's' : ''} to go`
    } else if (monthsDiff > 0 && monthsDiff <= 12) {
      timeToNextMeeting = `${monthsDiff} month${monthsDiff > 1 ? 's' : ''
      } to go`
    } else if (yearsDiff > 0) {
      timeToNextMeeting = `${yearsDiff} year${yearsDiff > 1 ? 's' : ''} to go`
    } else {
      timeToNextMeeting = moment(nextMeeting).format('Do MMMM')
    }
    setNextMeetingDate(timeToNextMeeting)
  }, [dashboardData?.boardMeeting?.nextBoardMeetingDate])

  useEffect(() => {
    nextBoardMeetingCalculation()
  }, [nextBoardMeetingCalculation])

  if (initing) {
    return <Loading size='small' />
  }

  if (!dashboardData) {
    return null
  }

  const { riskScore } = dashboardData

  const riskScoreCalculation = () => {
    if (+riskScore >= 25 && +riskScore <= 30) {
      return SCORES.EXCELLENT
    } else if (+riskScore >= 20 && +riskScore <= 24) {
      return SCORES.GOOD
    } else if (+riskScore >= 15 && +riskScore <= 19) {
      return SCORES.FAIR
    } else {
      return SCORES.NEEDS_WORK
    }
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Typography size='enormous' bold>
          Welcome back, <span>{userName}</span>
        </Typography>
        <Space size={25} />
        <FlexBox>
          <Card className={styles?.flexGrow}>
            <FlexBox alignItems='center'>
              <Typography size='huge' center bold>
                Governance Overview
              </Typography>
              <Space horizontal size={5} />
              <Tooltip
                placement='top'
                title={"Shows items according to their review status. Items needing attention have review dates in the past or are overdue."}
                color='#ECEFF2'
                overlayInnerStyle={{ color: "#005F73" }}
              >
                <InfoCircleOutlined className={styles.size} />
              </Tooltip>
            </FlexBox>
            <Space size={14} />
            <Clickable
              className={`${`${styles.card} ${styles.cardHover}`}`}
              onClick={() => {
                if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) {
                  router.push('/dashboard/governance-timetable')
                  trackAmplitudeEvent('Governance Overview clicked', { page: 'Dashboard page' });
                }
              }
              }
            >
              <FlexBox alignItems='center'>
                <div className={styles.pieChart}>
                  <Chart type='doughnut' data={data} options={options} />
                </div>
                <Space horizontal size={16} />
                <FlexBox flex={1} flexDirection='column'>
                  <FlexBox alignItems='center'>
                    <div className={styles.green} />
                    <Space horizontal size={16} />
                    <Typography size='large' gray>
                      Upcoming
                    </Typography>
                  </FlexBox>
                  <Space size={10} />
                  <FlexBox alignItems='center'>
                    <div className={styles.amber} />
                    <Space horizontal size={16} />
                    <Typography size='large' gray>
                      Review Pending
                    </Typography>
                  </FlexBox>
                  <Space size={10} />
                  <FlexBox alignItems='center'>
                    <div className={styles.red} />
                    <Space horizontal size={16} />
                    <Typography size='large' gray>
                      Needs Attention
                    </Typography>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </Clickable>
            <Space size={10} />
            {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER && <FlexBox justifyContent='flex-end' alignItems='flex-end'>
              <Typography size='large' serif primary>
                Click to access timetable
              </Typography>
            </FlexBox>}
          </Card>
          <Space size={24} horizontal />

          <Card className={styles?.flexGrow}>
            <FlexBox alignItems='center'>
              <Typography size='huge' center bold >
                Risk Score  </Typography> <Space horizontal size={5} />
              <TooltipText
                title={"The status of your risk frame work - high score is good."}
                readMoreText={
                  // eslint-disable-next-line max-len
                  "To get maximum score you need to identify atleast 20 risks with a mitigation strategy against each one. Points are deducted for risks with review dates in the past or risks without mitigations."
                }
              />
            </FlexBox>
            <Clickable
              className={`${styles.card} ${styles.cardHover}`}
              onClick={() => {
                if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) {
                  router.push('/dashboard/business-health/strategic-risks')
                  trackAmplitudeEvent('Risks clicked', { page: 'Dashboard page' });
                }
              }
              }
            >
              <div>

                <FlexBox flexDirection='column' alignItems='center' width={300}>
                  {Number(riskScore) < 10 ? (
                    <>
                      <Space size={45} />
                      <FlexBox alignItems='center' justifyContent='center' >
                        <Typography className={styles.riskScore} primary size="enormous">
                          Configure your risk framework
                        </Typography>
                      </FlexBox>
                    </>
                  ) : (
                    <>
                      <Space size={31} />
                      <GaugeChart value={(1 / 30) * Number(riskScore)} />
                      <Space size={40} />
                      <Typography size='large'>{riskScoreCalculation()}</Typography>
                      <Typography size='large' gray>{`${riskScore || 0
                      }/30`}</Typography>
                    </>
                  )}
                </FlexBox>
              </div>

            </Clickable>

          </Card>
          <Space size={24} horizontal />

          <Card className={styles?.flexGrow}>
            <FlexBox flexDirection='column' alignItems='center'>
              <Typography size='huge' bold>
                Board Meeting
              </Typography>
              <Space size={50} />
              <Clickable
                className={`${styles.card} ${styles.cardHover}`}
                onClick={() => {
                  if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) {
                    if (!dashboardData?.boardMeeting.nextBoardMeetingDate) {
                      router.push(`/dashboard/meeting-and-track-targets`)
                    } else {
                      if (dashboardData?.boardMeeting?.meeting) {
                        {
                          if (dashboardData.boardMeeting.meeting?.status === 'closed') {
                            router.push(`/dashboard/meeting-and-track-targets/${dashboardData.boardMeeting.meeting.id
                            }/status/ended`)
                          } else if (dashboardData.boardMeeting.meeting?.status === 'open') {
                            router.push(`/dashboard/meeting-and-track-targets/${dashboardData.boardMeeting.meeting.id
                            }/status/started`)
                          } else {
                            router.push(`/dashboard/meeting-and-track-targets/${dashboardData.boardMeeting.meeting.id
                            }/status/planned`)
                          }
                        }
                      }
                    }
                    trackAmplitudeEvent('Board Meeting Clicked', { page: 'Dashboard page' });
                  }
                }
                }
              >
                <FlexBox width={300} alignItems='center' justifyContent='center'>

                  <Typography size='enormous'>
                    {dashboardData.boardMeeting.nextBoardMeetingDate
                      ? nextMeetingDate
                      : 'To be arranged'}
                  </Typography>
                </FlexBox>
              </Clickable>

              <Space size={16} />
              <Typography
                red
              >{`${dashboardData?.boardMeeting?.numberOfActions} items need to review`}</Typography>
            </FlexBox>
          </Card>
        </FlexBox>
        <Space size={25} />
        <Table
          rowKey='name'
          title='Get Investment Ready'
          showTableHeaders={false}
          columns={getInvestmentReadyColumns}
          items={investments || []}
          loading={initing}
          onRowClick={(record: any) => {
            if (userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) {
              router.push(record.link)
              trackAmplitudeEvent('Dashboard - Get Investment Ready Clicked - ' + record.name, { page: 'Dashboard page' });
            }
          }}
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
};

export default Dashboard;
