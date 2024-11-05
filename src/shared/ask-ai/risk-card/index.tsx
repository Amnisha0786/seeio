import React, { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import camelcaseKeys from 'camelcase-keys';
import dayjs from "dayjs"
import { Col, Input, Radio, Row, Select } from 'antd';

import { ChatRisk } from '../';
import Typography from '@/components/typography';
import { mitigationOptions, riskScores } from '@/app/(protected)/dashboard/business-health/strategic-risks/strategic-risks-form';
import styles from "./risk-card.module.scss";
import Space from '@/components/space';
import FlexBox from '@/components/flex-box';
import TextArea from 'antd/es/input/TextArea';
import Button from '@/components/button';
import { TRisksFormValues } from '@/models/strategic-risks';
import Toast from '@/components/toast';
import { useSelectedAccountCompany } from '@/hooks';
import * as API from "@/api";
import Field from '@/components/field';
import PeopleSelect from '@/shared/people-select'

const RiskCard = ({
  risk,
}: {
  risk: ChatRisk;
}) => {
  const [isRiskDataSaving, setIsRiskDataSaving] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId;

  const getImpactProbability = (val: string | number) => {
    let value;
    if (val === 'low') {
      value = 1
    } else if (val === 'medium') {
      value = 2
    } else if (val === 'high') {
      value = 3
    }
    return value
  }
  const getMitigationImpactProbability = (val: string | number) => {
    let value;
    if (val === 'low') {
      value = "1"
    } else if (val === 'medium') {
      value = "2"
    } else if (val === 'high') {
      value = "3"
    }
    return value
  }

  const formik = useFormik({
    initialValues: camelcaseKeys(risk),
    onSubmit: async (values: ChatRisk) => {
      values.reviewFrequency = 2
      if (typeof values.impact === "string") {
        values.impact = getImpactProbability(values.impact) || 1
      }
      if (typeof values.probability === "string") {
        values.probability = getImpactProbability(values.probability) || 1
      }
     
      if (values?.mitigations?.length) {
        values?.mitigations?.map((mitigation, index) => {
          if (!mitigation.status) {
            values.mitigations[index].status = "To Do"
          }
          if(typeof mitigation?.new_impact === "string"){
            values.mitigations[index].new_impact = getMitigationImpactProbability(mitigation?.newImpact) || "1"
          }

          if(typeof mitigation?.new_probability === "string"){
            values.mitigations[index].new_probability = getMitigationImpactProbability(mitigation?.newProbability) || "1"
          }
        })
      }

      try {
        setIsRiskDataSaving(true)
        const dataToSend: TRisksFormValues = {
          ...values,
          nextReview: dayjs()?.toISOString()
        };
        if (companyId) {
          await API.createStrategicRisk(companyId, dataToSend);
          Toast.success("Risk created sucessfully");
        }

        formik.resetForm();
      } catch (err: any) {
        Toast.error(err?.message || "Something went wrong.");
      } finally {
        setIsRiskDataSaving(false)
      }
    },
  });
  const { impact, probability, mitigations } = formik.values

  let mostRepeatedProb: string, mostRepeatedImpact: string;
  const reviewFrequencyCalculations = useCallback(() => {
    let reviewFrequency = probability + impact;
    if (mitigations?.length) {
      mitigations?.map((mitigation) => {
        if (mitigation?.status === 'Done') {
          reviewFrequency = Number(mostRepeatedProb) + Number(mostRepeatedImpact)
        }
      })
    } else {
      reviewFrequency =
        probability + impact
    }
    formik.setFieldValue('reviewFrequency', reviewFrequency)
  }, [impact, probability, mitigations])

  useEffect(() => {
    reviewFrequencyCalculations();
  }, [reviewFrequencyCalculations]);

  return (
    <div className={styles.container}>
      <form
        onSubmit={formik.handleSubmit}
        className={styles.form}
      >
        <FlexBox className={styles.card} flexDirection="column">
          <Space size={15} />
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <Field label="Name*" errorMessage={formik.errors.name} labelProps={{
                size: "big"
              }}>
                <Input
                  name="name"
                  size="large"
                  placeholder="Enter name"
                  onChange={formik.handleChange}
                  value={formik?.values?.name}
                  status={formik.errors.name && "error"}
                />
              </Field>
            </Col>
            <Col span={12}>
              <Field label="Owner*" errorMessage={formik.errors.owner} labelProps={{
                size: "big"
              }}>
                <PeopleSelect
                  size="large"
                  allowClear
                  placeholder="Select"
                  selectFirstPerson={true}
                  onChange={(value) => formik.setFieldValue("owner", value)}
                  value={formik.values.owner }
                  status={formik.errors.owner && "error"}
                  companyNumber={companyId}
                />
              </Field>
            </Col>
          </Row>
          <Space size={15} />

          <Row gutter={[30, 0]}>
            <Col span={24}>
              <Field
                label="Description*"
                errorMessage={formik.errors.description}
                labelProps={{
                  size: "big"
                }}
              >
                <TextArea
                  rows={4}
                  name={`description`}
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik?.values?.description}
                  status={formik.errors.description && "error"}
                />
              </Field>
              <Space size={5} />
            </Col>
          </Row>

        </FlexBox>

        <Space size={15} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <FlexBox flexDirection="column">
              <Field
                label="Impact on company if risk occurs*"
                errorMessage={formik.errors.impact}
                labelProps={{
                  size: "big"
                }}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={riskScores}
                  className={styles.fullWidth}
                  onChange={(value) => {
                    formik.setFieldValue(`impact`, value);
                  }}
                  value={formik?.values?.impact}
                  status={formik.errors.impact && "error"}
                />
              </Field>
            </FlexBox>
          </Col>
          <Col span={12}>
            <FlexBox flexDirection="column">
              <Field
                label="Probability risk will occur*"
                errorMessage={formik.errors.probability}
                labelProps={{
                  size: "big"
                }}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={riskScores}
                  className={styles.fullWidth}
                  onChange={(value) => {
                    formik.setFieldValue(`probability`, value);
                  }}
                  value={formik?.values?.probability}
                  status={formik.errors.probability && "error"}
                />
              </Field>
            </FlexBox>
          </Col>
        </Row>

        <div style={{ flex: 1 }}>
          {camelcaseKeys(formik.values?.mitigations)?.map((mitigation, index) => (
            <React.Fragment key={index}>
              <Space size={20} />
              <FlexBox justifyContent="space-between">
                <Typography size="giant">Mitigation {index + 1}</Typography>
              </FlexBox>

              <FlexBox className={styles.card} flexDirection="column">
                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={24}>
                    <FlexBox flexDirection="column">
                      <Row gutter={[30, 0]}>
                        <Col span={12}>
                          <Typography bold={true} size="big">
                            Name
                          </Typography>
                          <Select
                            style={{
                              width: "100%"
                            }}
                            size="large"
                            placeholder="Select"
                            options={mitigationOptions}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `mitigations[${index}].name`,
                                value
                              )
                            }
                            value={mitigation?.name}
                          />
                        </Col>
                      </Row>

                      <Space size={15} />

                      <Row gutter={[30, 0]}>
                        <Col span={12}>
                          <Typography bold={true} size="big">
                            Status
                          </Typography>
                          <Radio.Group
                            name={`mitigations[${index}].status`}
                            className={styles.fullWidth}
                            onChange={formik.handleChange}
                            value={formik?.values?.mitigations?.[index]?.status}
                          >
                            <Radio value="To Do">To Do</Radio>
                            <Radio value="Done">Done</Radio>
                          </Radio.Group>
                        </Col>
                      </Row>

                      <Space size={15} />

                      <Row gutter={[30, 0]}>
                        <Col span={12}>
                          <Typography bold={true} size="big">
                            Probability after mitigation
                          </Typography>
                          <Select
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Select"
                            options={riskScores}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `mitigations[${index}].new_probability`,
                                value
                              )
                            }
                            value={mitigation?.newProbability}
                          />
                        </Col>

                        <Col span={12}>
                          <Typography bold={true} size="big">
                            Impact after mitigation
                          </Typography>
                          <Select
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Select"
                            options={riskScores}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `mitigations[${index}].new_impact`,
                                value
                              )
                            }
                            value={mitigation?.newImpact}
                          />
                        </Col>
                      </Row>

                      <Space size={15} />

                      <Row gutter={[30, 0]}>
                        <Col span={24}>
                          <Typography bold={true} size="big">
                            Notes
                          </Typography>
                          <TextArea
                            rows={4}
                            name={`mitigations[${index}].description`}
                            size="large"
                            placeholder="Enter here"
                            onChange={formik.handleChange}
                            value={mitigation?.description}
                          />
                        </Col>
                      </Row>

                      <Space size={15} />
                    </FlexBox>
                  </Col>
                </Row>
              </FlexBox>
            </React.Fragment>
          )
          )}
        </div>
        <Button type="primary" loading={isRiskDataSaving} onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid}>Save</Button>
      </form>
    </div>
  );
};

export default RiskCard