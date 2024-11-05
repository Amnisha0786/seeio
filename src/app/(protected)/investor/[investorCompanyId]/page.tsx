"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import * as yup from 'yup';
import { useFormik } from "formik"
import { useRouter } from "next/navigation"

import styles from "./page.module.scss";
import ScollablePage from "@/components/scollable-page";
import Chart from "@/components/chart/line-chart";
import Space from "@/components/space";
import Container from "@/components/container";
import Typography from "@/components/typography";
import Card from "@/components/card";
import FlexBox from "@/components/flex-box";
import * as API from "@/api";
import BreadCrumbs from "@/shared/global-breadcrumbs";
import TooltipText from "@/components/tooltip"
import GaugeChart from "@/components/gauge-chart"
import Loading from "@/components/loading"
import { Currency, TDashboardData } from "@/models"
import Toast from "@/components/toast"
import Clickable from "@/components/clickable"
import Button from "@/components/button"
import Table, { TColumn } from "@/components/table"
import PreviewNotesDetails from "./preview-notes-details"
import AddNotesModal, { TNotes } from "./add-modal"
import { useUserName } from "@/hooks"
import { BALANCE, DATA, DRAFT_EDITOR_EMPTY_TEXT, LABEL, PERIOD } from "@/constants"
import { Col, Row } from "antd"
import Graph from "../../dashboard/business-health/cash-burn-and-runway-calculator/graph"
import CalculationGraphModal from "../../dashboard/business-health/cash-burn-and-runway-calculator/graph-modal"
import Icon from "@/components/icon"
import { getLabelAndData } from '@/utils/get-labels';

const validationSchema = yup.object().shape({
  subject: yup.string().required("Subject is required."),
  description: yup.string().required("Description is required."),
});


enum SCORES {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  NEEDS_WORK = 'Needs Work'
}

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

const categoryColors: any = {
  yellow: '#6fc6a5',
  red: '#ef3d4e',
  green: '#9fc33c'
};


const addColorStop = (ctx: any, chartArea: any) => {
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );
  gradient.addColorStop(1, 'rgba(249, 65, 68, 1)'); // red
  gradient.addColorStop(0.3, 'rgba(249, 65, 68, 0.39)'); // blue
  gradient.addColorStop(0, 'rgba(249, 65, 68, 0)'); // green
  return gradient;
};
interface Props { params: { investorCompanyId: string } }
const CompanyPage = ({ params: { investorCompanyId } }: Props) => {
  const [initing, setIniting] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<TDashboardData>();
  const [descriptionData, setDescriptionData] = useState<TNotes[]>()
  const [record, setRecord] = useState<TNotes>()
  const route = useRouter()
  const viewNotesRef: any = useRef();
  const addNotesRef: any = useRef();
  const userName = useUserName();
  const skipped = (ctx: any, value: any) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const [graphData, setGraphData] = useState<any>();
  const [graphData2, setGraphData2] = useState<any>();
  const [graphData3, setGraphData3] = useState<any>();
  const [toggle, setToggle] = useState(false);
  const [additionalData, setAddtionalData] = useState<any>([]);
  const [calculatorData, setCalculatorData] = useState<any>();
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [graphModalData, setGraphModalData] = useState<any>();
  const [openGraph, setOpenGraph] = useState(false);
  const [graphType, setGraphType] = useState("line");
  const [graphTittle, setGraphTittle] = useState("");
  const [loading, setLoading] = useState(false);

  const additionalGraph = () => {
    const newData: {
      period: Dayjs,
      balance: number
    }[] = [];
    const length = toggle ? graphData3?.average - 1 : graphData3?.latest - 1
    let month = dayjs(
      graphData3?.lineData[graphData3.lineData?.length - 1]?.period
    ).add(1, "month");

    for (let i = 0; i <= length; i++) {
      newData.push({ period: month, balance: i === length ? 0 : NaN });
      month = dayjs(month).add(1, "month");
    }

    setAddtionalData([...graphData3?.lineData, ...newData]);
  };

  const handleOpenGraphModal = (data?: any) => {
    setOpenGraph((prev) => !prev);
    setGraphModalData(data);
  };

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  useEffect(() => {
    if (graphData3?.lineData) {
      additionalGraph();
    }
  }, [graphData3, toggle]);

  const formik = useFormik<TNotes>({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      subject: "",
      description: DRAFT_EDITOR_EMPTY_TEXT,
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      if (!investorCompanyId) {
        return
      }
      setNotesLoading(true);
      try {
        await API.submitdescripton(investorCompanyId,
          values
        );
        getDescriptionData()
        Toast.success("Notes Update Successfully")
        formik.resetForm()
        addNotesRef?.current?.close()
      } finally {
        setNotesLoading(false);
      }
    },
  });

  const getDescriptionData = async () => {
    if (!investorCompanyId) {
      return
    }
    setNotesLoading(true);
    try {
      const result = await API.getDescriptionData(investorCompanyId);
      setDescriptionData(result.map((item: TNotes) => ({
        date: dayjs(new Date()).format("DD/MM/YYYY HH:mm"),
        subject: item?.subject,
        user: userName,
        description: item?.description,
        id: item?.id
      })));
    } catch (err: any) {
      Toast.error(err?.messaage || "Something went wrong")
    } finally {
      setNotesLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {

      if (!investorCompanyId) {
        return
      }
      setIniting(true);
      try {
        const result = await API.getInvestorsDashboard(investorCompanyId);
        setDashboardData(result);
      } finally {
        setIniting(false);
      }
    };
    setLoading(true)
    fetchData();
    getDescriptionData()
    getXeroIntegration();
  }, [investorCompanyId]);

  const data1 = useMemo(
    () => ({
      labels: getLabelAndData(true, graphData, [], LABEL, PERIOD)
      ,
      datasets: [
        {
          type: 'line',
          label: "Revenue",
          data: getLabelAndData(true, graphData2, [], DATA, BALANCE),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.1)",
          borderColor: "#005F73",
          borderWidth: 3,
          yAxisID: 'y1'
        },
        {
          label: "Cash Balance (monthly)",
          data: getLabelAndData(true, graphData, [], DATA, BALANCE),
          fill: true,
          backgroundColor: "#6FC6A5",
          borderColor: "#6FC6A5",
          borderWidth: 3,
          yAxisID: 'y'
        },
      ],
    }),
    [graphData]
  );

  const data3 = useMemo(
    () => ({
      labels: getLabelAndData(true, graphData3?.lineData, additionalData, LABEL, PERIOD),
      datasets: [
        additionalData?.length
          ? {
            label: "Cash Balance (monthly)",
            data: getLabelAndData(true, additionalData, [], DATA, BALANCE),
            fill: false,
            backgroundColor: "rgba(75,192,192,0.1)",
            borderColor: "#005F73",
            borderWidth: 3,
            segment: {
              borderColor: (ctx: any) => skipped(ctx, "rgb(0,0,0,0.2)"),
              borderDash: (ctx: any) => skipped(ctx, [6, 6]),
            },
            spanGaps: true,
          }
          : {
            type: "line",
            label: "Cash Balance (monthly)",
            data: getLabelAndData(true, graphData3?.lineData, [], DATA, BALANCE, additionalData && additionalData?.length),
            fill: false,
            backgroundColor: "rgba(75,192,192,0.1)",
            borderColor: "#005F73",
            borderWidth: 3,
          },
        {
          type: "bar",
          label: "Cash Movement",
          data: getLabelAndData(true, graphData3?.barData, [], DATA, graphData3?.isCashReserve ? 'cashReserve' : 'cashMovement'),
          fill: true,
          backgroundColor: "#6FC6A5",
          borderColor: "#6FC6A5",
          borderWidth: 3,
        },
      ],
    }),
    [graphData3, additionalData]
  );

  const fetchXeroIntegrationData = async (
    companyId?: string,
    rootiFyId?: number
  ) => {
    setLoading(true)
    try {
      const result = await API.getXeroIntegrationData({ companyId, rootiFyId });
      setCalculatorData(result);
    } catch (error) {
      Toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const getXeroIntegration = async () => {
    setLoading(true);
    try {
      if (!investorCompanyId) return;
      const result = await API.getXeroIntegration({
        companyId: investorCompanyId,
      });
      if (result) {
        setCurrency(result?.data?.baseCurrency || "GBP")
        if (result?.data?.isConnected && result?.data?.rootfiCompanyId) {
          fetchXeroIntegrationData(
            investorCompanyId,
            Number(result?.data?.rootfiCompanyId)
          );
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      Toast.error("Something Went Wrong");
      setLoading(false);
    }
  };

  const sortData = (graphArray: any, key: string, decreaseOrder?: boolean) => {
    if (!graphArray?.length) return []
    if (decreaseOrder) {
      return graphArray?.sort((a: any, b: any) => dayjs(a[key]).isAfter(dayjs(b[key])) ? -1 : 1)
    }
    return graphArray?.sort((a: any, b: any) => dayjs(a[key]).isAfter(dayjs(b[key])) ? 1 : -1)
  }

  useEffect(() => {
    setGraphData(sortData(calculatorData?.cashBalances, 'period'));
    setGraphData2(sortData(calculatorData?.revenues, 'period'));
    setGraphData3(
      {
        lineData: sortData(calculatorData?.cashBalances, 'period'),
        barData: calculatorData?.financialResilience?.isCashReserve
          ? sortData(calculatorData?.financialResilience?.cashReserves, 'period')
          : sortData(calculatorData?.cashBalances, 'period'),
        isCashReserve: !!calculatorData?.financialResilience?.isCashReserve,
        average: calculatorData?.financialResilience?.isCashReserve ? calculatorData?.financialResilience?.cashReserve?.average
          : calculatorData?.financialResilience?.runway?.average,
        latest: calculatorData?.financialResilience?.isCashReserve ? calculatorData?.financialResilience?.cashReserve?.latest
          : calculatorData?.financialResilience?.runway?.latest,
        cashReserve: calculatorData?.financialResilience?.cashReserve,
        runway: calculatorData?.financialResilience?.runway,
        availableCashBalance: calculatorData?.availableCashBalance,
      });

  }, [calculatorData]);

  const columns = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "user",
        title: "User",
        render: (record: TNotes) => <Clickable onClick={() => {
          setRecord(record)
          viewNotesRef.current.open()
        }}><Typography>{record.user}</Typography></Clickable>
      },
      {
        key: "subject",
        title: "Subject",
      },
      {
        key: "date",
        title: "Date/Time",
      },

    ],
    []
  );

  const graphModalData1 = useMemo(
    () => ({
      labels: getLabelAndData(false, graphData2, [], LABEL, PERIOD),
      datasets: [
        {
          type: 'line',
          label: "Revenue",
          data: getLabelAndData(false, graphData2, [], DATA, BALANCE),
          fill: false,
          backgroundColor: "rgba(75,192,192,0.1)",
          borderColor: "#005F73",
          borderWidth: 3,
          yAxisID: 'y1'
        },
        {
          label: "Cash Balance (monthly)",
          data: getLabelAndData(false, graphData, [], DATA, BALANCE),
          fill: true,
          backgroundColor: "#6FC6A5",
          borderColor: "#6FC6A5",
          borderWidth: 3,
          yAxisID: 'y'
        },
      ],
    }),
    [graphData]
  );

  const graphModalData3 = useMemo(
    () => ({
      labels: getLabelAndData(false, graphData3?.lineData, additionalData, LABEL, PERIOD),
      datasets: [
        additionalData?.length
          ? {
            label: "Cash Balance (monthly)",
            data: getLabelAndData(false, additionalData, [], DATA, BALANCE),
            fill: false,
            backgroundColor: "rgba(75,192,192,0.1)",
            borderColor: "#005F73",
            borderWidth: 3,
            segment: {
              borderColor: (ctx: any) => skipped(ctx, "rgb(0,0,0,0.2)"),
              borderDash: (ctx: any) => skipped(ctx, [6, 6]),
            },
            spanGaps: true,
          }
          : {
            type: "line",
            label: "Cash Balance (monthly)",
            data: getLabelAndData(false, graphData3?.lineData, [], DATA, BALANCE),
            fill: false,
            backgroundColor: "rgba(75,192,192,0.1)",
            borderColor: "#005F73",
            borderWidth: 3,
          },
        {
          type: "bar",
          label: "Cash Movement",
          data: getLabelAndData(false, graphData3?.barData, [], DATA, graphData3?.isCashReserve ? 'cashReserve' : 'cashMovement'),
          fill: true,
          backgroundColor: "#6FC6A5",
          borderColor: "#6FC6A5",
          borderWidth: 3,
        },

      ],
    }),
    [graphData3, additionalData]
  );
  const handleCurrencyChange = (newValue: "GBP" | "USD" | "EURO") => {
    setCurrency(newValue)
  }

  const riskScore = useMemo(() => dashboardData?.riskScore || 0, [dashboardData]);

  const NoRecord = () => {
    return <FlexBox alignItems="center" className={styles.noRecord} justifyContent="center">
      <FlexBox alignItems="center" flexDirection="column" justifyContent="center">
        <Icon name="white-file" size={60} />
        <Space size={16} />
        <Typography color="#005F73" size="giant" bold>There is no data yet.</Typography>
      </FlexBox>
    </FlexBox>
  }

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
    };
  }, [dashboardData?.governance]);

  if (initing || loading) {
    return <Loading size='small' />
  }
  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container className={styles.xeroContainer}>
        <FlexBox alignItems="center" justifyContent="space-between">
          <BreadCrumbs />
        </FlexBox>
        <Space size={24} />
        <FlexBox alignItems="center" justifyContent="space-between">
          <Typography size="giant" bold>
            {`${dashboardData?.companyName || ""}`}
          </Typography>
          {dashboardData?.boardMeeting?.nextBoardMeetingDate && (
            <Typography gray className={styles.nextDate} size="large" serif>
              Next board meeting date :{" "}
              <span className={styles.textColor}>
                {dayjs(dashboardData?.boardMeeting?.nextBoardMeetingDate).format("dd/mm/yyyy")}
              </span>
            </Typography>
          )}
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <Card className={styles.card}>
            <FlexBox flexDirection="column">
              <FlexBox alignItems="center">
                <Typography size="huge" center bold>
                  Governance Overview
                </Typography>
              </FlexBox>
              <Space size={14} />
              <FlexBox alignItems="center">
                <div className={styles.pieChart}>
                  <Chart type="doughnut" data={data} options={options} />
                </div>
                <Space horizontal size={16} />
                <FlexBox flex={1} flexDirection="column">
                  <FlexBox alignItems="center">
                    <div className={styles.green} />
                    <Space horizontal size={16} />
                    <Typography size="large" gray>
                      Upcoming
                    </Typography>
                  </FlexBox>
                  <Space size={10} />
                  <FlexBox alignItems="center">
                    <div className={styles.amber} />
                    <Space horizontal size={16} />
                    <Typography size="large" gray>
                      Review Pending
                    </Typography>
                  </FlexBox>
                  <Space size={10} />
                  <FlexBox alignItems="center">
                    <div className={styles.red} />
                    <Space horizontal size={16} />
                    <Typography size="large" gray>
                      Needs Attention
                    </Typography>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </Card>

          <Space size={24} horizontal />
          <Card className={styles.cardWidth}>

            <FlexBox flexDirection='column'>
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
              <FlexBox flexDirection='column' alignItems='center'>
                <Space size={31} />
                <GaugeChart value={(1 / 30) * Number(riskScore)} />
                <Space size={40} />
                <Typography size='large'>{riskScoreCalculation()}</Typography>
                <Typography size='large' gray>{`${riskScore || 0
                }/30`}</Typography>
              </FlexBox>
            </FlexBox>

          </Card>
          <Space size={24} horizontal />
          <Card className={styles.card}>
            <FlexBox
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <FlexBox flexDirection="column" alignItems="center" className={styles.padding}>
                <Space size={10} />
                <Clickable
                  className={styles.border}
                  onClick={() => {
                    if (dashboardData?.boardMeeting?.meeting?.id) {
                      route.push(`/dashboard/meeting-and-track-targets/${dashboardData?.boardMeeting?.meeting?.id}/meeting-pack`)
                    } else {
                      Toast.error("Next board meeting is not avaliable")
                    }
                  }}
                >
                  <Typography
                    size="large" className={``}>
                    See meeting pack for next board meeting
                  </Typography>
                </Clickable>
                <Space size={24} />

                <Clickable
                  className={styles.border}
                  onClick={() => {
                    if (investorCompanyId) {
                      route.push(`/dashboard/minute-book/minute-book-detail/${investorCompanyId}`)
                    }
                  }}>

                  <Typography size="large" className={``}>
                    See Minute book
                  </Typography>
                </Clickable>
                <Space size={24} />
                <Clickable
                  className={styles.border}
                >
                  <Typography size="large" className={``}>
                    <FlexBox alignItems="center" gap={10} justifyContent='center'>
                      <Typography>
                        See Latest progress update report
                      </Typography>
                      <img src="/icons/coming-soon.png" height={25} alt="coming soon" />
                    </FlexBox>
                  </Typography>
                </Clickable>
                <Space size={10} />
              </FlexBox>
            </FlexBox>
          </Card>

        </FlexBox>
        <Space size={24} />
        <Row gutter={{ xs: 8, sm: 16, md: 0, lg: 0 }}>
          <Col className="gutter-row" span={8}>
            {calculatorData ? <Graph
              handleOpenGraphModal={handleOpenGraphModal}
              setGraphTittle={setGraphTittle}
              setGraphType={setGraphType}
              data={data1}
              modalData={graphModalData1}
              cardTitle="Cash Balance (monthly)"
              type={"bar"}
              currency={currency}
              showAxis={true}
            /> :
              <NoRecord />
            }
          </Col>
          <Col className="gutter-row" span={8}>
            {calculatorData ? <Graph
              handleOpenGraphModal={handleOpenGraphModal}
              setGraphTittle={setGraphTittle}
              setGraphType={setGraphType}
              cardTitle={"Revenue"}
              data={null}
              modalData={null}
              currency={currency}
              showBaseCurrency={true}
              details={{
                availableCashBalance: graphData3?.availableCashBalance,
                cashMovement: graphData3?.lineData[graphData3?.lineData.length - 1]?.cashMovement,
                runway: graphData3?.runway?.[`${toggle ? 'average' : 'latest'}`],
                cashReserve: graphData3?.cashReserve?.[`${toggle ? 'average' : 'latest'}`],
              }}
              handleCurrencyChange={handleCurrencyChange}
              type={"bar"}
              showAxis={false}
            /> : (<NoRecord />
            )}
          </Col>
          <Col className="gutter-row" span={8}>
            {calculatorData ? <Graph
              handleOpenGraphModal={handleOpenGraphModal}
              setGraphTittle={setGraphTittle}
              setGraphType={setGraphType}
              data={data3}
              modalData={graphModalData3}
              currency={currency}
              cardTitle={graphData3.isCashReserve ? 'Cash Reserve' : 'Runway'}
              handleToggle={handleToggle}
              toggle={toggle}
              type={"line"}
              showAxis={false}
            /> : (
              (<NoRecord />)
            )}
          </Col>
        </Row>
        <Space size={24} />

        <Table
          rowKey="id"
          title="Notes"
          columns={columns}
          items={descriptionData || []}
          loading={initing}
        />
        <Space size={24} />
        <FlexBox justifyContent='flex-end'>
          <Button onClick={() => {
            addNotesRef.current.open()
          }} type="primary">
            Add Note
          </Button>
        </FlexBox>

      </Container>
      <Space size={50} />
      <PreviewNotesDetails
        ref={viewNotesRef}
        data={record}
      />
      <AddNotesModal
        loading={notesLoading}
        ref={addNotesRef}
        formik={formik}
      />
      <CalculationGraphModal
        type={graphType}
        tittle={graphTittle}
        data={graphModalData}
        open={openGraph}
        setOpen={handleOpenGraphModal}
        currency={currency}
      />
    </ScollablePage>
  );
};

export default CompanyPage;
