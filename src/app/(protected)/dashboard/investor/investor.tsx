"use client";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { Checkbox, Select } from "antd";
import moment from "moment"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"

import styles from "./page.module.scss";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Container from "@/components/container";
import Typography from "@/components/typography";
import { useAccessLevel, useBreadcrumbs, useUserName } from "@/hooks";
import * as API from "@/api";
import Card from "@/components/card";
import FlexBox from "@/components/flex-box";
import Table, { TColumn } from "@/components/table";
import Clickable from "@/components/clickable";
import Icon from "@/components/icon";
import AddCompanyModal from "./add-company-modal"
import CompanySetupModal from "./setup-comapny-modal"
import CompanyExistModal from "./company-exists-modal"
import Loading from "@/components/loading"
import { COMPANY_USER_ACCESS_LEVEL, TCompanyActions, TInverstorCompany, TInvestorDashboardData, USER_TYPE } from "@/models"
import AddActionModal from "../meeting-and-track-targets/add-action-modal"
import { setSelectedCompanyId } from "@/store/actions"
import Button from '@/components/button';
import * as SetupACompanyModal from "@/shared/setup-a-company-modal";

const STATUS_OPTIONS = [{
  label: 'Complete Actions',
  value: 'completeActions'
}, {
  label: 'Incomplete Actions',
  value: 'incompleteActions'
}
]

const InvestorDashboard = () => {
  const editActionModalRef = useRef<any>();
  const userName = useUserName();
  const [initing, setIniting] = useState(true);
  const [data, setData] = useState<TInvestorDashboardData>();
  const [currentTab, setCurrentTab] = useState(1)
  const [addCompanyModal, setAddCompanyModal] = useState(false)
  const [setupCompanyModal, setSetupCompanyModal] = useState(false)
  const [alreadyExistCompanyModal, setAlreadyExistCompanyModal] = useState(false)
  const [companyData, setCompanyData] = useState<TInverstorCompany[]>()
  const route = useRouter()
  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();
  const userAccess = useAccessLevel()
  const [statusSort, setStatusSort] = useState('incompleteActions');
  const [companySort, setCompanySort] = useState();
  const [companyActionData, setCompanyActionData] = useState<TCompanyActions[]>()
  const [companyLoading, setCompanyLoading] = useState(false)
  const COMPANY_OPTONS = useMemo(() => (
    data?.companies.map((item) => ({
      value: item?.companyId,
      label: item?.companyName
    }))), [data])

  const dispatch = useDispatch();
  const storedSelectedCompanyId = localStorage.getItem('companyObject');
  let storedCompanyObejct: any
  if (storedSelectedCompanyId) {
    storedCompanyObejct = JSON.parse(storedSelectedCompanyId) || {}
  }

  useEffect(() => {
    if (userAccess?.userType && userAccess?.userType?.toLowerCase() !== USER_TYPE.INVESTOR) {
      if (userAccess?.accessLevel === COMPANY_USER_ACCESS_LEVEL.BILLING_ADMIN) {
        router.push("/profile")
      } else {
        router.push("/dashboard")
      }
    }
  }, [userAccess])

  const fetchData = async () => {
    if (companySort || data) {
      setCompanyLoading(true)
      setIniting(false);
    } else {
      setIniting(true)
      setCompanyLoading(false)
    }

    try {
      if (!userAccess) {
        return
      }
      const result = await API.getInvestors(companySort, userAccess?.person?.id);
      setData(result);
      setCompanyData(result?.companies)
    } finally {
      setCompanyLoading(false)
      setIniting(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [companySort]);

  useEffect(() => {
    if (statusSort === "completeActions") {
      setCompanyActionData(data?.completeActions)
    }
    else if (statusSort === "incompleteActions") {
      setCompanyActionData(data?.incompleteActions)
    }
  }, [statusSort, data])

  const RiskScore = (score: number) => {

    if (+score >= 25 && +score <= 30) {
      return <>
        <Typography color="#749715">
          {"Very High"}
        </Typography>
        <Space horizontal size={10} />
        <Icon className={styles.riskIconGreen} name="arrow-up" size={10} />
      </>
    } else if (+score >= 20 && +score <= 24) {
      return <>
        <Typography color="#749715">
          {"High"}
        </Typography>
        <Space horizontal size={10} />
        <Icon className={styles.riskIconGreen} name="arrow-up" size={10} />
      </>
    } else if (+score >= 15 && +score <= 19) {
      return <>
        <Typography color="#CE9F46">
          {"Medium"}
        </Typography>
        <Space horizontal size={10} />
        <Icon className={styles.riskIconYellow} name="arrow-up" size={10} />
      </>
    } else {
      return <>
        <Typography color="#EF3D4E">
          {"Low"}
        </Typography>
        <Space horizontal size={10} />
        <Icon className={styles.riskIconRed} name="arrow-down" size={10} />
      </>
    }
  }

  const columns = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "companyName",
        title: "Name",
        width: 240,
        render: (record) => (
          <Clickable
            onClick={() => {
              breadcrumbs.set([
                {
                  title: "Dashboard",
                  link: "/dashboard",
                },
                {
                  title: record?.companyName,
                  link: `/investor/${record?.companyId}`,
                },
              ]);
              route.push(`/investor/${record?.companyId}`)

              if (userAccess?.userId && storedCompanyObejct[`${userAccess?.userId}`] !== undefined) {
                localStorage.setItem('companyObject', JSON.stringify({
                  ...storedCompanyObejct,
                  [`${userAccess?.userId}`]: record?.companyId,
                }));
              }
              dispatch(setSelectedCompanyId(record?.companyId))
            }}
          >
            <Typography primary clickable>{record?.companyName}</Typography>
          </Clickable>
        )
      },
      {
        key: "boardMeeting",
        title: "Last Meeting",
        width: 123,
        render: (record) => (
          <>
            <Typography center>
              {record.boardMeeting.lastBoardMeetingDate ? moment(record.boardMeeting.lastBoardMeetingDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </>
        )
      },
      {
        key: "boardMeeting",
        title: "Next Meeting",
        width: 123,
        render: (record) => (
          <>
            <Typography>
              {record.boardMeeting.nextBoardMeetingDate ? moment(record.boardMeeting.nextBoardMeetingDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </>
        )
      },
      {
        key: "riskScore",
        title: "Risk score",
        width: 123,
        render: (record) => (
          <> {RiskScore(record.riskScore)} </>
        )
      },
      {
        key: "meetingPack",
        title: "Meeting pack",
        width: 123,
        render: (record) => (
          <Clickable
            onClick={() => {
              if (record?.boardMeeting?.meeting?.id) {
                route.push(`/dashboard/meeting-and-track-targets/${record?.boardMeeting?.meeting?.id}/meeting-pack`)
              }
            }}
          >
            <Typography color="#749715">{record?.boardMeeting?.meeting?.id ? "Show pack" : ""}</Typography>
          </Clickable>
        )
      },
      {
        key: "dataRoom",
        title: "Data room",
        width: 140,
        render: (record) => (
          <Clickable
            onClick={() => {
              if (record?.companyId) {
                route.push(`/data-rooms/data-room-details/${record?.companyId}`)
              }
            }}
          >
            <Typography color="#749715">{record?.companyId ? "Show dataroom" : ""}</Typography>
          </Clickable>
        )
      },
      {
        key: "incidents",
        title: "Incidents",
        width: 75,
        render: (record) => (
          <FlexBox>
            <Space horizontal size={20} />
            <Clickable onClick={() => { route.push("/investor/complaint-incident") }}>
              {record.isIncidentExists == "true" ?
                (
                  <Icon name="flagIcon" />
                ) : (
                  <></>
                )
              }
            </Clickable>
          </FlexBox>
        )
      },
    ],
    []
  );

  const nextBoardMeetingCalculation = (date: string) => {
    const nextMeeting = date
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
    return timeToNextMeeting
  }

  const handleTabClick = () => {
    setCurrentTab(2)
  }

  if (initing) {
    return <Loading size='small' />
  }
  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />

      <Container>
        <Typography size="enormous" bold>
          Welcome back, <span className={styles.color}>{userName}</span>
        </Typography>
        <Space size={25} />
        <FlexBox>
          <Card className={styles.card}>
            <FlexBox flexDirection="column">
              <FlexBox justifyContent='space-between' alignItems='center'>
                <Typography size="huge" bold>
                  Board actions
                </Typography>
                <Select
                  className={styles.sortCompanySelect}
                  options={STATUS_OPTIONS}
                  size="middle"
                  placeholder="Enter here"
                  onChange={setStatusSort}
                  value={statusSort}
                />
                <Select
                  className={styles.sortCompanySelect}
                  options={COMPANY_OPTONS ? [...COMPANY_OPTONS] : []}
                  allowClear
                  size="middle"
                  placeholder="Select Company"
                  onChange={setCompanySort}
                  value={companySort}
                />
              </FlexBox>

              <Space size={8} />

              <div className={styles.actionContent}>
                {companyLoading ?
                  <FlexBox justifyContent='center' alignItems='center' className={styles.companyLoading}>
                    <Loading size="small" />
                  </FlexBox>
                  :
                  companyActionData && companyActionData?.length ? companyActionData?.map((item: any) => (
                    <div className={styles.overflow} key={item.id}>
                      <Clickable className={styles.recordItem}
                        onClick={() => {
                          editActionModalRef.current.open(item)
                        }}
                      >
                        <FlexBox
                          alignItems="center"
                          justifyContent="space-between"
                          className={styles.width}
                        >
                          <FlexBox flexDirection="column" className={styles.width}>
                            <FlexBox>
                              <FlexBox flex={2.5} zeroMinWidth>
                                <FlexBox alignItems="center" flex={1} zeroMinWidth>
                                  <Checkbox
                                    checked={true}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Space size={16} horizontal />
                                  <Typography
                                    size="huge"
                                    ellipsis
                                    className={styles.textTransform}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Space size={5} horizontal />
                                </FlexBox>
                              </FlexBox>
                            </FlexBox>
                            <Space size={14} />
                            <FlexBox>
                              <Typography gray>{
                                item?.dueDate && `${nextBoardMeetingCalculation(item?.dueDate)} - ${moment(item?.dueDate).format("hh:mm:A")}`}
                              </Typography>
                              <Space size={14} horizontal />
                              <Typography blue>
                                {item.description}
                              </Typography>
                            </FlexBox>
                          </FlexBox>
                        </FlexBox>
                      </Clickable>
                      <Space size={14} />
                    </div>
                  )) : (
                    <FlexBox flexDirection="column" alignItems="center">
                      <Space size={50} />
                      <Icon name="white-file" size={60} />
                      <Space size={16} />
                      <Typography color="#005F73" size="giant" bold>
                        No actions found.
                      </Typography>
                      <Space size={50} />
                    </FlexBox>
                  )}
              </div>
              <Typography primary center className={styles.seeAll}>See all</Typography>
            </FlexBox>
          </Card>
          <Space size={24} horizontal />


          <Card className={styles.card}>
            <FlexBox flexDirection="column">
              <FlexBox justifyContent="space-between" alignItems="center">
                <Typography size="huge" bold>
                  Upcoming schedule
                </Typography>
              </FlexBox>
              <Space size={25} />
              <div className={styles.actionContent}>
                {data?.upcomingMeetings?.map((schedule: any) => (<>
                  <div className={styles.overflow}>
                    <Clickable className={styles.recordItem}
                      onClick={() => {
                        if (schedule?.id) {
                          if (schedule?.status === "open") {
                            route.push(`/dashboard/meeting-and-track-targets/${schedule?.id}/status/started`)
                          } else if (schedule?.status === "closed") {
                            route.push(`/dashboard/meeting-and-track-targets/${schedule?.id}/status/ended`)
                          } else {
                            route.push(`/dashboard/meeting-and-track-targets/${schedule?.id}/status/planned`)
                          }
                        }
                      }}
                    >
                      <FlexBox
                        alignItems="center"
                        justifyContent="space-between"
                        className={styles.width}
                      >
                        <FlexBox flexDirection="column" className={styles.width}>
                          <FlexBox>
                            <FlexBox flex={2.5} zeroMinWidth>
                              <FlexBox alignItems="center" flex={1} zeroMinWidth>
                                <Typography
                                  size="huge"
                                  ellipsis
                                >
                                  {schedule?.name}
                                </Typography>
                                <Space size={5} horizontal />
                              </FlexBox>
                            </FlexBox>
                          </FlexBox>
                          <Space size={14} />
                          <FlexBox>
                            <Typography gray>
                              {schedule?.date && `${nextBoardMeetingCalculation(schedule?.date)} - ${moment(schedule?.date).format("hh:mm:A")}`}
                            </Typography>
                            <Space size={14} horizontal />
                            <Typography blue>
                              {schedule?.companyName}
                            </Typography>
                          </FlexBox>
                        </FlexBox>
                      </FlexBox>
                    </Clickable>
                    <Space size={14} />
                  </div>
                </>))}
              </div>
              <Space size={14} />
            </FlexBox>
            <Typography primary center className={styles.seeAll}>See all</Typography>
          </Card>
        </FlexBox>
        <Space size={32} />
        <Table
          rowKey="id"
          title="Company"

          headerRight={<>
            <Space horizontal size={5} />
            <Button type='primary' onClick={() => SetupACompanyModal.open()}>
              Add company
            </Button>
          </>}
          columns={columns}
          items={companyData || []}
          loading={initing}
          tabs={["Invested Companies", "Planned Invested Companies"]}
          onTabClick={handleTabClick}
          currentTab={currentTab}
        />

      </Container >

      <AddActionModal onSuccess={fetchData} isEdit={true}
        ref={editActionModalRef} />
      <AddCompanyModal setOpen={setAddCompanyModal} setCompanySetupModal={setSetupCompanyModal} open={addCompanyModal} />
      <CompanySetupModal setOpen={setSetupCompanyModal} open={setupCompanyModal} />
      <CompanyExistModal setOpen={setAlreadyExistCompanyModal} open={alreadyExistCompanyModal} />
      <Space size={50} />
    </ScollablePage >
  );
};

export default InvestorDashboard;
