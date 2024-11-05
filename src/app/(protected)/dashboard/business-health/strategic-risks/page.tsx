"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import dayjs from "dayjs";
import { Col, Row } from "antd";
import { useSelector } from "react-redux"

import ScollablePage from "@/components/scollable-page";
import styles from "./page.module.scss";
import Typography from "@/components/typography";
import Container from "@/components/container";
import BreadCrumbs from "@/components/breadcrumbs";
import Space from "@/components/space";
import AddButton from "@/components/add-button";
import StrategicRisksAddModal from "./strategic-risks-add-modal";
import CardWithGraph, { ChartData } from "./card-with-graph";
import Toast from "@/components/toast";
import * as API from "@/api";
import Table from "@/components/table";
import Loading from "@/components/loading";
import { TColumn } from "@/components/table";
import Status from '@/components/status';
import { useAccessLevel, useSelectedAccountCompany } from "@/hooks";
import StrategicRisksViewModal from "./strategic-risks-view-modal";
import TourComponent from "@/components/TourComponent";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import { openDownloadDialog } from '@/utils/file-reader';
import { COMPANY_USER_ACCESS_LEVEL, Risk } from "@/models"
import useAmplitudeContext from "@/hooks/amplitude";
import { BUTTON_LOCATION, EVENT_NAME, FEATURE, PLATFORM } from '@/contexts/AmplitudeContext'
import AskAiModal from "@/shared/ask-ai"
import Clickable from "@/components/clickable"
import Icon from "@/components/icon"

interface ChartResponse {
  data?: ChartData;
  title: string;
  amount: string;
  profitLoss?: number;
}

interface RiskDetails {
  numRisks: number;
  numMitigations: number;
  numRisksWithoutMitigations: number;
  risks: Risk[];
}

const riskTypes = [
  { value: "brand-dev", label: "Brand Development" },
  { value: "corp-culture", label: "Corporate Culture" },
  { value: "cost-mng", label: "Cost Management" },
  { value: "cust-eng", label: "Customer Engagement" },
  { value: "data-prot", label: "Data Protection" },
  { value: "env-soc-gov", label: "Environment, Social and Governance" },
  { value: "fin-stab", label: "Financial Stability" },
  { value: "headcount", label: "Headcount" },
  { value: "marketing", label: "Marketing" },
  { value: "prod-dev", label: "Product Development" },
  { value: "prod-mng", label: "Production Management" },
  { value: "reg-comp", label: "Regulation and Compliance" },
  { value: "res-dev", label: "Research and Development" },
  { value: "sales-growth", label: "Sales Growth" },
  { value: "serv-del", label: "Service Delivery" },
  { value: "serv-dev", label: "Service Development" },
  { value: "supp-chain", label: "Supply Chain Management" },
  { value: "team-mng", label: "Team Management" },
];

enum RISK_STATUSES {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  NOT_CONFIGURED = 'Not configured',
  MISSING_MITIGATIONS = 'Missing mitigations',
  MITIGATIONS_NOT_IMPLEMENTED = 'Mitigations not implemented',
  REVIEW_OVERDUE = 'Review overdue',
  REVIEW_DUE = 'Review due',
  MITIGATION_OUTSTANDING = 'Mitigation outstanding',
  UP_TO_DATE = 'Up to date',
}

interface Params {
  riskId?: string
}

interface Props {
  searchParams?: Params
}

const getRiskStatus = (status: string) => {
  let result = { label: RISK_STATUSES.LOW, color: "green" };
  if (status === RISK_STATUSES.HIGH) {
    result = { label: RISK_STATUSES.HIGH, color: "red" };
  } else if (status === RISK_STATUSES.MEDIUM) {
    result = { label: RISK_STATUSES.MEDIUM, color: "yellow" };
  } else if (status === RISK_STATUSES.LOW) {
    result = { label: RISK_STATUSES.LOW, color: "green" };
  } else if (status === RISK_STATUSES.NOT_CONFIGURED) {
    result = { label: RISK_STATUSES.NOT_CONFIGURED, color: "red" };
  } else if (status === RISK_STATUSES.MISSING_MITIGATIONS) {
    result = { label: RISK_STATUSES.MISSING_MITIGATIONS, color: "red" };
  } else if (status === RISK_STATUSES.MITIGATIONS_NOT_IMPLEMENTED) {
    result = { label: RISK_STATUSES.MITIGATIONS_NOT_IMPLEMENTED, color: "yellow" };
  } else if (status === RISK_STATUSES.REVIEW_OVERDUE) {
    result = { label: RISK_STATUSES.REVIEW_OVERDUE, color: "red" };
  } else if (status === RISK_STATUSES.REVIEW_DUE) {
    result = { label: RISK_STATUSES.REVIEW_DUE, color: "yellow" };
  } else if (status === RISK_STATUSES.MITIGATION_OUTSTANDING) {
    result = { label: RISK_STATUSES.MITIGATION_OUTSTANDING, color: "yellow" };
  } else if (status === RISK_STATUSES.UP_TO_DATE) {
    result = { label: RISK_STATUSES.UP_TO_DATE, color: "green" };
  }
  return result
};

const StrategicRisks = (props: Props) => {
  const SetupACompanyModalRef: any = useRef();
  const viewModalRef: any = useRef();

  const [initing, setIniting] = useState(true);
  const [data, setData] = useState<RiskDetails | null>(null);
  const [chartData, setChartData] = useState<ChartResponse[] | null>(null);
  const [corporateObjectives, setCorporateObjectives] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [collapseAi, setCollapseAi] = useState(true)
  const [open, setOpen] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [updateData, setUpdateData] = useState<any>([])
  const [userData, setUserData] = useState<any>({})

  const handlecollapse = () => {
    setCollapseAi((prev) => !prev)
  }

  useEffect(() => {
    if (updateData?.length > 0) {
      SetupACompanyModalRef.current.open()
    }
  }, [updateData])

  const config = useSelector((state: any) => state.config)

  const companyId = useSelectedAccountCompany()?.companyId;
  const userAccess = useAccessLevel()
  const url = typeof window !== 'undefined' ? window.location.href : ""

  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'Risk_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      if (companyId) {
        const res = await API.getStrategicRisks(companyId);

        if (res) {
          setChartData([
            {
              title: "Risks",
              amount: res.numRisks,
            },
            {
              title: "Mitigations",
              amount: res.numMitigations,
            },
            {
              title: "Risks without mitigations",
              amount: res.numRisksWithoutMitigations,
            },
          ]);
          setData(res);
          setUserData(res?.risks)
        }
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  const getCorporateObjectives = useCallback(async () => {
    try {
      if (!companyId) return;
      const result = await API.getCorporateObjectives(companyId);
      if (result) {
        setCorporateObjectives(result);
      }
    } catch (err: any) { }
  }, [companyId]);

  useEffect(() => {
    fetchData();
    getCorporateObjectives();
  }, [fetchData, getCorporateObjectives]);

  const columns = useMemo<TColumn<Risk>[]>(
    () => [
      {
        key: "name",
        title: "Risk",
        render: (rec) => (
          <Typography
            primary
            size="big"
            style={{ cursor: "pointer" }}
            onClick={() => viewModalRef.current.open(rec.id)}
          >
            {rec.name}
          </Typography>
        ),
      },
      {
        key: "riskType",
        title: "Risk Type",
        render: (rec) =>
          <Typography size="big">
            {riskTypes.filter((risk) => risk.value === rec.riskType)[0]?.label ??
              ""}
          </Typography>

      },
      {
        key: "reviewDate",
        title: "Review Date",
        render: (rec) => <Typography size="big">{dayjs(rec.reviewDate).format("DD/MM/YYYY")}</Typography>,
      },
      {
        key: "status",
        title: "Status",
        render: (record) => (
          <Status
            title={
              getRiskStatus(record?.status)?.label
            }
            color={
              getRiskStatus(record?.status)?.color
            }
          />
        ),
      },
    ],
    []
  );

  if (props?.searchParams?.riskId && viewModalRef) {
    viewModalRef?.current?.open(props?.searchParams?.riskId)
  }

  const onClickDownload = useCallback(async () => {
    try {
      setDownloading(true);
      if (!companyId) return;
      const result = await API.getDownloadRiskUrl(companyId);
      if (result) {
        openDownloadDialog({
          url: result,
          filename: `risks`,
        })
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setDownloading(false);
    }
  }, [companyId]);

  return (
    <div className={styles.page}>
      <ScollablePage>
        <FlexBox alignItems='flex-start' justifyContent='center'>
          <div>
            <Space size={32} />
            <Container>
              {initing && <Loading size="small" />}
              {!!data && (
                <>
                  <FlexBox justifyContent="space-between" alignItems="center">
                    <BreadCrumbs
                      items={[
                        {
                          title: "Business Health",
                          link: "/dashboard/business-health",
                        },
                        {
                          title: "Strategic risks",
                          link: "/dashboard/business-health/strategic-risks",
                        },
                      ]}
                      activeItem="Strategic risks"
                    />
                    <Space horizontal size={10} />
                    <Button
                      type="primary"
                      onClick={onClickDownload}
                      loading={downloading}
                      disabled={downloading}
                    >
                      Download Risks
                    </Button>

                  </FlexBox>
                  <Space size={24} />
                  <div id="risks_graphs">
                    <Row>
                      {chartData &&
                        chartData.map((chart: ChartResponse, index: number) => (
                          <Col span={8} key={index}>
                            <CardWithGraph
                              cardTitle={chart.title}
                              amount={chart.amount}
                            />
                          </Col>
                        ))}
                    </Row>
                  </div>
                  <Space size={30} />

                  <div className={styles.table} id="risks_table">
                    <Table
                      rowKey="id"
                      title="Strategic Risks"
                      columns={columns}
                      items={data?.risks}
                      loading={initing}
                    />
                  </div>

                  {(
                    userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                    userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && (
                    <div className={styles.addButton}>
                      <AddButton
                        onClick={() => {
                          trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED, {
                            button_name: FEATURE.RISK,
                            button_location: BUTTON_LOCATION.RISK,
                            button_clicked_at: new Date().valueOf(),
                            user_id: userAccess?.userId,
                            platform: PLATFORM.WEB
                          });
                          SetupACompanyModalRef.current.open()
                        }}
                      />
                    </div>
                  )}
                  <StrategicRisksAddModal
                    marginLeft={collapseAi ? true : false}
                    open={addOpenModal}
                    setOpen={setAddOpenModal}
                    ref={SetupACompanyModalRef}
                    fetchData={fetchData}
                    corporateObjectives={corporateObjectives}
                    setUpdateData={setUpdateData}
                    newRisks={updateData}
                    modalName={updateData?.length > 0 ? `Add AI Generated Risk ${updateData?.length}` : ""}
                    updateData={updateData?.length && updateData[0]}
                  />

                  <TourComponent start={!initing && config.config} />
                </>
              )}
            </Container>
            <div className={`${styles.askAiIcon} ${(open || addOpenModal) ? styles.askAiModalIcon : ""}`}>
              <Clickable onClick={() => {
                handlecollapse()
              }}>
                <Icon name='ask-ai-icon' size={80} />
              </Clickable>
            </div>
          </div>
          <div className={`${(open || addOpenModal) ? styles.aiBoxModal : styles.aiBox} ${!collapseAi ? styles.hideAi : ""}`}>
            <AskAiModal
              fullHeight={(open || addOpenModal) ? true : false}
              setUpdateData={setUpdateData}
              userData={userData}
              setCollapse={handlecollapse}
              collapse={collapseAi}
            />
          </div>
        </FlexBox>
      </ScollablePage>
      <StrategicRisksViewModal
        ref={viewModalRef}
        fetchData={fetchData}
        marginLeft={collapseAi ? true : false}
        corporateObjectives={corporateObjectives}
        open={open}
        setOpen={setOpen}
      />
      <TourComponent start={!initing && config.config} />
    </div>
  );
};

export default StrategicRisks;
