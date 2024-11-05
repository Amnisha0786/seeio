"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button, Col, Dropdown, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { EllipsisOutlined } from "@ant-design/icons";

import Clickable from "@/components/clickable";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Table, { TColumn } from "@/components/table";
import styles from "./page.module.scss";
import Typography from "@/components/typography";
import AddDocumentModal from "./edit-document-modal";
import Status from "@/components/status";
import Graph, { formatNumberWithCommas } from "./graph";
import CalculationGraphModal from "./graph-modal";
import FlexBox from "@/components/flex-box";
import AddExceptionModal from "./add-exception-modal";
import { useSelectedAccountCompany } from "@/hooks";
import * as API from "@/api";
import Toast from "@/components/toast";
import Container from "@/components/container";
import BreadCrumbs from "@/components/breadcrumbs";
import Loading from "@/components/loading";
import Icon from "@/components/icon"
import { Currency, TXeroData } from '@/models';
import { BALANCE, DATA, LABEL, PERIOD, SYMBOLS } from '@/constants';
import { CATEGORY_OPTION } from "./add-exception-form"
import { getLabelAndData } from '@/utils/get-labels';

interface TAction {
  cashBalances: {
    id: number;
    balance?: number;
    cashMovement?: number;
    createdAt?: string;
    exceptionalItems?: any;
    generatedBy?: string;
    hasExceptionalItems?: boolean;
    la?: number;
    period?: string;
    previousBalance?: number;
    rootfiCompanyId?: string;
    status?: string;
  }
  revenue: {
    id?: string;
    balance?: number;
    period?: string;
    rootfiCompanyId?: string;
  }
}

const getTitleStatus = (status: string) => {
  if (status === "PROVISIONED") {
    return "Provisional"
  }
  return "Verified"
}

const getExceptionaItems = (exceptionalItems: string[]) => {

  return exceptionalItems?.map(
    (exception: any, index: number) => `${CATEGORY_OPTION.filter((item) => item.value === exception.category)[0].label} 
    ${index === (exceptionalItems?.length - 1) ? " " : ", "}`
  )
}

const RenderPrice = ({ text, currency }: { text: number, currency: Currency }) => {

  return text < 0 ? (<Typography color="#df3d30" size="large" center>
    <FlexBox>
      {SYMBOLS[currency || "GBP"]}<Space size={2} horizontal /> {formatNumberWithCommas(text)}
    </FlexBox>
  </Typography>) : (<Typography color="#00293F" size="large" center>
    <FlexBox>
      {SYMBOLS[currency || "GBP"]}<Space size={2} horizontal /> {formatNumberWithCommas(text)}
    </FlexBox>
  </Typography>)
}

const CashRunwayCalculator = () => {
  const skipped = (ctx: any, value: any) =>
    ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const [open, setOpen] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openGraph, setOpenGraph] = useState(false);
  const [graphModalData, setGraphModalData] = useState<any>();
  const [graphType, setGraphType] = useState("line");
  const [graphTittle, setGraphTittle] = useState("");
  const [toggle, setToggle] = useState(false);
  const [additionalData, setAddtionalData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>();
  const [graphData2, setGraphData2] = useState<any>();
  const [graphData3, setGraphData3] = useState<any>();
  const addExceptionModalRef = useRef<any>();
  const editExceptionModalRef = useRef<any>();
  const [rootiFyId, setRootiFyId] = useState<number>();
  const [record, setRecord] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [initing, setIniting] = useState(false);
  const company = useSelectedAccountCompany();
  const [intigration, setxeroIntigration] = useState<TXeroData>();
  const [calculatorData, setCalculatorData] = useState<any>();
  const [currency, setCurrency] = useState<Currency>("GBP");
  const router = useRouter();
  const [columnData, setColumnData] = useState<any>()

  useEffect(() => {
    const cashBalance = sortData(calculatorData?.cashBalances, 'period')
    const revenue = sortData(calculatorData?.revenues, 'period')
    setColumnData(
      cashBalance.map((item: any, index: number) => ({
        cashBalances: { ...item },
        revenue: {
          balance: revenue[index]?.balance ? revenue[index]?.balance : '',
          period: revenue[index]?.period ? revenue[index]?.period : '-',
          rootfiCompanyId: revenue[index]?.rootfiCompanyId ? revenue[index]?.rootfiCompanyId : '-',
        },
        period: cashBalance[index]?.period ? cashBalance[index]?.period : '-',
      }))
    );
  }, [calculatorData])

  const refreshApi = async () => {
    setRefreshLoading(true)
    try {
      const response = await API.refreshData({
        companyId: company?.companyId,
        rootiFyId: String(rootiFyId)
      })
      if (response) {
        setRefreshLoading(false)
        fetchXeroIntegrationData(company?.companyId, rootiFyId)
      }
    } catch (error: any) {
      Toast.error(error.message || "Something went wrong")
      setRefreshLoading(false)
    }
  }

  const fetchXeroIntegrationData = async (
    companyId?: string,
    rootiFyId?: number
  ) => {
    setLoading(true);
    try {
      const result = await API.getXeroIntegrationData({ companyId, rootiFyId });
      setCalculatorData(result);
    } catch (error) {
      Toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
      setIniting(false);
    }
  };

  const handleCurrencyChange = (newValue: "GBP" | "USD" | "EURO") => {
    setCurrency(newValue)
  }

  const getXeroIntegration = async () => {
    setLoading(true);
    try {
      if (!company) return;
      const result = await API.getXeroIntegration({
        companyId: company?.companyId,
      });
      if (result) {
        setxeroIntigration(result?.data);
        setCurrency(result?.data?.baseCurrency || "GBP")
        if (result?.data?.isConnected && result?.data?.rootfiCompanyId) {
          setRootiFyId(Number(result?.data?.rootfiCompanyId))
          fetchXeroIntegrationData(
            company?.companyId,
            Number(result?.data?.rootfiCompanyId)
          );
        } else {
          setIniting(false);
          setLoading(false);
        }
      }
    } catch (error) {
      Toast.error("Something Went Wrong");
      setLoading(false);
      setIniting(false);
    }
  };

  const updateStatus = async (payload: {
    value?: number;
    status?: string;
    period?: string;
  }) => {
    try {
      setLoading(true);
      await API.updateCash({
        companyId: company?.companyId,
        rootiFyId: Number(intigration?.rootfiCompanyId),
        ...payload,
      });
      getXeroIntegration();
    } catch (error) {
      Toast.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    setIniting(true);
    getXeroIntegration();
  }, [company?.companyId]);

  const handleOpenModal = () => {
    setOpen((prev) => !prev);
  };
  const handleOpenAddModal = () => {
    setOpenAddModal((prev) => !prev);
  };

  const handleOpenGraphModal = (data?: any) => {
    setOpenGraph((prev) => !prev);
    setGraphModalData(data);
  };

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

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

  useEffect(() => {
    if (graphData3?.lineData) {

      additionalGraph();
    }
  }, [graphData3, toggle]);


  const columns = useMemo<TColumn<TAction>[]>(
    () => [
      {
        key: "date",
        title: "Date",
        render: (item) => (

          <Typography color="#00293F" size="large">
            {item?.cashBalances?.period ? dayjs(item?.cashBalances?.period).format("MM/YYYY") : ""}{" "}
          </Typography>

        ),
      },
      {
        key: "revenue",
        title: "Revenue",
        render: (item) => (
          <RenderPrice currency={currency} text={Number(Number(item?.revenue?.balance).toFixed(2))} />
        ),
      },
      {
        key: "balance",
        title: "Cash balance",
        render: (item) => (
          <RenderPrice currency={currency} text={Number(Number(item?.cashBalances?.balance).toFixed(2))} />
        ),
      },
      {
        key: "cashMovement",
        title: "Cash Movement",
        render: (item) => (
          <>
            <Space size={16} horizontal />
            <RenderPrice currency={currency} text={Number(Number(item?.cashBalances?.cashMovement).toFixed(2))} />
          </>
        ),
      },
      {
        key: "exceptional",
        title: "Exceptional",
        render: (item) => (
          <FlexBox flex={1}>
            {
              item?.cashBalances?.exceptionalItems?.length ? (
                <Typography
                  color="#00293F"
                  size="large"
                >
                  {getExceptionaItems(item?.cashBalances?.exceptionalItems)}
                </Typography>
              ) : <><Space size={16} horizontal /> -</>
            }


          </FlexBox>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (record) => (
          <FlexBox alignItems="center" justifyContent="space-around">
            <Status
              title={
                getTitleStatus(record?.cashBalances?.status || "")
              }
              color={record?.cashBalances?.hasExceptionalItems ? "green" : "yellow"}
            />
          </FlexBox>
        ),
        width: 90,
      },
      {
        key: "dropDown",
        title: "",
        render: (record) => (
          <FlexBox alignItems="center" justifyContent="space-around">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Dropdown
                menu={{
                  items: [
                    record?.cashBalances?.status === "PROVISIONED"
                      ? {
                        label: "Mark as verified",
                        key: "0",
                        onClick: (e) => {
                          updateStatus({
                            status: "VERIFIED",
                            period: record?.cashBalances?.period,
                          });
                        },
                      }
                      : {
                        label: "Mark as provisional",
                        key: "2",
                        onClick: (e) => {
                          updateStatus({
                            status: "PROVISIONED",
                            period: record?.cashBalances?.period,
                          });
                        },
                      },
                    {
                      label: (record?.cashBalances?.exceptionalItems?.length ? 'Edit' : 'Enter') + ' exception',
                      key: "1",
                      onClick: (e) => {
                        record?.cashBalances?.exceptionalItems?.length
                          ? editExceptionModalRef.current.open()
                          : addExceptionModalRef.current.open();
                        setRecord(record?.cashBalances);
                        setRootiFyId(Number(record?.cashBalances?.rootfiCompanyId));
                      },
                    },
                    {
                      label: "Edit",
                      key: "3",
                      onClick: (e) => {
                        handleOpenModal();
                        setRecord(record);
                        setRootiFyId(Number(record?.cashBalances?.rootfiCompanyId));
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Clickable
                  className={styles.optionButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisOutlined />
                </Clickable>
              </Dropdown>
            </div>
          </FlexBox>
        ),
        width: 100,
      },
    ],
    [columnData, currency]
  );

  const data = useMemo(
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

  const data2 = useMemo(
    () => ({
      labels: getLabelAndData(true, graphData2, [], LABEL, PERIOD),
      datasets: [
        {
          label: "Revenue",
          data: getLabelAndData(true, graphData2, [], DATA, BALANCE),
          fill: true,
          backgroundColor: "#6FC6A5",
          borderColor: "#6FC6A5",
          borderWidth: 3,
        },
      ],
    }),
    [graphData2]
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
          label: `${graphData3?.isCashReserve ? 'Cash Reserve (months)' : 'Cash Movement'}`,
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
            label: `${graphData3?.isCashReserve ? 'Cash Reserve (months)' : 'Cash Movement'}`,
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

  return (
    <ScollablePage>
      <Space size={32} />
      <Container className={styles.xeroContainer}>
        <BreadCrumbs
          items={[
            { title: "Business Health", link: "/dashboard/business-health" },
            {
              title: "Cash Burn/Runway Calculator",
              link: "/dashboard/business-health/cash-burn-and-runway-calculator",
            },
          ]}
          activeItem="Cash Burn/Runway Calculator"
        />
        <Space size={32} />

        {
          initing ?
            <Loading size="small" />
            : <>
              {intigration?.isConnected ? (
                <>
                  <Space size={24} />
                  <Row gutter={{ xs: 8, sm: 16, md: 0, lg: 0 }}>
                    <Col className="gutter-row" span={8}>
                      <Graph
                        handleOpenGraphModal={handleOpenGraphModal}
                        setGraphTittle={setGraphTittle}
                        setGraphType={setGraphType}
                        data={data}
                        modalData={graphModalData1}
                        cardTitle="Cash Balance (monthly)"
                        type={"bar"}
                        currency={currency}
                        showAxis={true}
                      />
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <Graph
                        handleOpenGraphModal={handleOpenGraphModal}
                        setGraphTittle={setGraphTittle}
                        setGraphType={setGraphType}
                        cardTitle={"Revenue"}
                        data={null}
                        modalData={null}
                        details={{
                          availableCashBalance: graphData3?.availableCashBalance,
                          cashMovement: graphData3?.lineData[graphData3?.lineData.length - 1]?.cashMovement,
                          runway: graphData3?.runway?.[`${toggle ? 'average' : 'latest'}`],
                          cashReserve: graphData3?.cashReserve?.[`${toggle ? 'average' : 'latest'}`],
                        }}
                        currency={currency}
                        showBaseCurrency={true}
                        handleCurrencyChange={handleCurrencyChange}
                        type={"bar"}
                        showAxis={false}
                      />
                    </Col>
                    <Col className="gutter-row" span={8}>
                      <Graph
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
                      />
                    </Col>
                  </Row>
                  <Space size={24} />
                  <Table
                    title="Cashflow data"
                    columns={columns}
                    items={sortData(columnData, 'period', true)}
                    loading={loading}
                    disableKey={"email"}
                    headerRight={
                      <FlexBox gap={10}>
                        <Button
                          onClick={handleOpenAddModal}
                          className={styles.addBtn}
                          type="primary"
                        >
                          Add New
                        </Button>
                        <Button
                          disabled={loading || refreshLoading}
                          loading={loading || refreshLoading}
                          onClick={() => {
                            refreshApi()
                          }}
                          className={styles.addBtn}
                          type="primary"
                        >
                          Refresh
                        </Button>
                      </FlexBox>
                    }
                  />
                </>
              ) : (
                <Container className={styles.xeroContainer}>
                  <FlexBox alignItems="center" className={styles.contentBody} justifyContent="center">
                    <FlexBox alignItems="center" flexDirection="column" justifyContent="center">
                      <Space size={50} />
                      <Icon name="white-file" size={60} />
                      <Space size={16} />
                      <Typography color="#005F73" size="giant" bold>There is no data yet. Please connect to xero.</Typography>
                      <Space size={24} />
                      <Button type="primary" onClick={() => {
                        router.push("/settings/company-setup/xero")
                      }}>Click here connect to Xero</Button>
                    </FlexBox>
                  </FlexBox>

                </Container>
              )}
            </>
        }
      </Container>

      <AddDocumentModal
        onSuccess={() => {
          fetchXeroIntegrationData(company?.companyId, rootiFyId)
        }}
        rootiFyId={rootiFyId}
        data={record}
        open={open}
        setOpen={handleOpenModal}
        isEdit={true}
      />
      <AddDocumentModal
        onSuccess={() => {
          fetchXeroIntegrationData(company?.companyId, rootiFyId)
        }}
        rootiFyId={rootiFyId}
        open={openAddModal}
        setOpen={handleOpenAddModal}
        isEdit={false}
      />
      <CalculationGraphModal
        type={graphType}
        tittle={graphTittle}
        data={graphModalData}
        open={openGraph}
        setOpen={handleOpenGraphModal}
        currency={currency}
      />
      <AddExceptionModal
        data={record}
        currency={currency}
        rootifyId={rootiFyId}
        fetchData={() => {
          fetchXeroIntegrationData(company?.companyId, rootiFyId)
        }}
        ref={addExceptionModalRef}
      />
      <AddExceptionModal
        data={record}
        currency={currency}
        rootifyId={rootiFyId}
        fetchData={() => {
          fetchXeroIntegrationData(company?.companyId, rootiFyId)
        }}
        isEdit={true}
        ref={editExceptionModalRef}
      />
    </ScollablePage>
  );
};

export default CashRunwayCalculator;
