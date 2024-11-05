import { useEffect, useRef, useState } from "react";
import { Col, Divider, Row, Space } from "antd";
import Image from "next/image";
import dayjs from "dayjs";

import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import { TMitigation, TStrategicRisksPreview } from "@/models/strategic-risks";
import Clickable from "@/components/clickable";
import * as API from "@/api";
import styles from "./page.module.scss"
import Toast from "@/components/toast";
import ConfirmDelete from "@/shared/confirm-delete";
import { RISK_TYPES, riskScores } from './strategic-risks-form';
import Status from "@/components/status";
import { useAccessLevel } from "@/hooks";
import { COMPANY_USER_ACCESS_LEVEL } from "@/models";
import Loading from "@/components/loading";
import { BUTTON_LOCATION, BUTTON_NAME, EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'
import useAmplitudeContext from '@/hooks/amplitude';


const riskOccuranceValue: { [key: number]: string } = {
  6: "Monthly",
  5: "Every 2 months",
  4: "Quarterly",
  3: "Bi-Annually",
  2: "Annually",
};

const StrategicRisksPreview = ({
  formData,
  setShowPreview,
  setOpen,
  fetchData,
  companyId
}: TStrategicRisksPreview) => {
  const deleteModelRef: any = useRef();
  const [deleting, setDeleting] = useState(false);
  const userAccess = useAccessLevel()
  const [overallImpact, setOverallImpact] = useState<number | string>()
  const [overallProbability, setOverallProbability] = useState<number | string>()

  const { trackAmplitudeEvent } = useAmplitudeContext();

  const getOverallImpactValue = () => {
    if (formData?.mitigations?.length) {
      return formData?.mitigations.reduce((prev, curr) => curr.newImpact < prev.newImpact ? curr : prev)
    }
  }
  const getOverallProbabilityValue = () => {
    if (formData?.mitigations?.length) {
      return formData?.mitigations.reduce((prev, curr) => curr.newProbability < prev.newProbability ? curr : prev)
    }
  }

  const setImpactProbability = () => {
    if (formData?.mitigations?.length) {
      const impact = getOverallImpactValue()
      const probability = getOverallProbabilityValue()
      setOverallImpact(impact?.newImpact)
      setOverallProbability(probability?.newProbability)
    } else {
      setOverallImpact(formData?.impact);
      setOverallProbability(formData?.probability);
    }
  };

  useEffect(() => {
    setImpactProbability()
  }, [formData])

  const onClickEdit = (): void => {
    setShowPreview(false);
    trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED, {
      button_name: BUTTON_NAME.EDIT_RISK,
      button_location: BUTTON_LOCATION.RISK,
      button_clicked_at: new Date().valueOf(),
      user_id: userAccess?.userId,
      platform: PLATFORM.WEB,
      detail_name: formData?.name
    });
  };

  const onclickRiskDelete = async () => {
    try {
      setDeleting(true);
      const companyid = formData.companyId || companyId
      if (companyid && formData.id) {
        await API.deleteStrategicRisk(companyid, formData.id);
        Toast.success("Risk deleted successfully");
      }
    } catch (error: any) {
      Toast.error(error.message || "Something went wrong");
    } finally {
      setOpen(false);
      setDeleting(false);
      deleteModelRef?.current?.close();
      fetchData();
    }
  };

  if (!userAccess) {
    return <Loading size="small" />
  }

  return (
    <>
      <Space size={24} />
      <FlexBox key={formData.name} className={styles?.marginTop16} flexDirection="column">
        <FlexBox justifyContent="space-between">
          <Typography serif size="enormous">
            Risk
          </Typography>
          {(userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
            userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && <FlexBox>
            <Clickable onClick={onClickEdit}>
              <Image
                src="/icons/edit-icon.svg"
                alt="edit icon"
                width={24}
                height={24}
              />
            </Clickable>
            <Clickable onClick={() => deleteModelRef?.current?.open()}>
              <Image
                src="/icons/delete-icon.svg"
                alt="delete icon"
                width={24}
                height={24}
              />
            </Clickable>
          </FlexBox>}
        </FlexBox>
        <Space size={16} />
        <FlexBox flexDirection='column'>
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <FlexBox flexDirection='column' >
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Risk Name
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>{formData?.name}</Typography>
                  </Col>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Description
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>{formData?.description}</Typography>
                  </Col>
                </Row>
                <Space size={24} />
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Owner/ Department
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>{typeof formData?.owner !== "string" ? formData?.owner?.name : "-"}</Typography>
                  </Col>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Risk Type
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>{RISK_TYPES.filter(risk => risk.value === formData.riskType)?.[0]?.label}</Typography>
                  </Col>
                </Row>
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Impact without mitigations
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {formData?.impact ? riskScores.find((item: any) => item.value == formData?.impact)?.label : "-"}
                    </Typography>
                  </Col>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Probability without mitigations
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {formData.probability ? riskScores.find((item: any) => item.value == formData?.probability)?.label : "-"}
                    </Typography>
                  </Col>
                </Row>
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Col span={12}>
                    <Typography gray size='large'>
                      Next Review Date
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {dayjs(formData.nextReview).format("DD/MM/YYYY")}
                    </Typography>
                  </Col>
                  <Col span={12}>
                    <Typography gray size='large'>
                      <Space size={10} />
                      Review frequency (auto generated)
                    </Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {formData?.reviewFrequency && riskOccuranceValue[formData?.reviewFrequency]}
                    </Typography>
                  </Col>
                </Row>
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Divider />
                  <Col span={24}>
                    <Typography serif size="giant">Effect of mitigations</Typography>
                    <Space size={8} />
                  </Col>
                </Row>
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                  <Col span={12}>
                    <Typography gray size='large'>Overall Impact</Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {overallImpact
                        ? riskScores.find(
                          (item: any) => item.value == overallImpact
                        )?.label
                        : "-"}
                    </Typography>
                  </Col>

                  <Col span={12}>
                    <Typography gray size='large'>Overall Probability</Typography>
                    <Space size={8} />
                    <Typography size='large'>
                      {overallProbability
                        ? riskScores.find(
                          (item: any) => item.value == overallProbability
                        )?.label
                        : "-"}
                    </Typography>
                  </Col>
                </Row>
                <Space size={16} />
                <Row gutter={[30, 0]} className={styles.marginTop16}>
                </Row>
                <Space size={16} />
              </FlexBox>
            </Col>
          </Row>
        </FlexBox>
      </FlexBox>
      <Space size={30} />
      <Divider />
      {formData?.mitigations?.map((item: TMitigation, index: number) => (
        <FlexBox key={index} flexDirection="column">
          <FlexBox justifyContent="space-between">
            <Typography serif size="giant">
              Mitigation {index + 1}
            </Typography>
          </FlexBox>
          <Row gutter={[30, 0]} className={styles.marginTop16}>
            <Col span={12}>
              <Typography gray size='large'>
                Mitigat
              </Typography>
              <Space size={8} />
              <Typography size='large'>{item.name}</Typography>
            </Col>
            <Col span={12}>
              <Typography gray size='large'>
                Probability after mitigant
              </Typography>
              <Space size={8} />
              <Typography size='large'>{item.newProbability ? riskScores.find((score: any) => score.value === item?.newProbability)?.label : "-"}
              </Typography>
            </Col>
          </Row>
          <Row gutter={[30, 0]} className={styles.marginTop16}>
            <Col span={12}>
              <Typography gray size='large'>
                Impact after mitigant
              </Typography>
              <Space size={8} />
              <Typography size='large'>{item?.newImpact ? riskScores.find((score: any) => score.value == item?.newImpact)?.label : "-"}</Typography>
            </Col>
            {item.status &&
              <Col span={12}>
                <Typography gray size='large'>
                  <Space size={10} />
                  Status
                </Typography>
                <Space size={8} />
                <Typography size='large'>
                  <Status
                    title={item.status == "To Do" ? "Pending" : "In place" || ""}
                    color={item.status === "Done" ? "green" : "yellow"} className={styles.width} />
                </Typography>
              </Col>
            }
          </Row>
          <Row gutter={[30, 0]} className={styles.marginTop16}>
            <Col>
              <Typography gray size="large">
                Notes
              </Typography>
              <Typography size="large">{item.notes}</Typography>
            </Col>
          </Row>
        </FlexBox>
      ))}
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={onclickRiskDelete}
        loading={deleting}
      />
    </>
  );
};

export default StrategicRisksPreview;
