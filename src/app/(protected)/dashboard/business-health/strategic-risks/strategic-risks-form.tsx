import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, DatePicker, Input, Radio, Row, Select } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";
import TextArea from "antd/es/input/TextArea";

import FlexBox from "@/components/flex-box";
import AddButton from "@/components/add-button";
import styles from "./style.module.scss";
import Space from "@/components/space";
import Button from "@/components/button";
import Typography from "@/components/typography";
import Clickable from "@/components/clickable";
import Toast from "@/components/toast";
import * as API from "@/api";
import { TMitigation, TRisksFormValues } from "@/models/strategic-risks";
import { useAccessLevel, useSelectedAccountCompany } from "@/hooks";
import Field from "@/components/field";
import { CorporateObjective } from '@/models/corporate-objective';
import DepartmentSelect from "@/shared/department-select"
import { EVENT_NAME, EVENT_PROPERTY, EVENT_TYPE, FEATURE, PLATFORM } from '@/contexts/AmplitudeContext';
import useAmplitudeContext from '@/hooks/amplitude';

export const RISK_TYPES = [
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
  { value: "others", label: "Others" },
];

export const riskScores = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

export const mitigationOptions = [
  { value: "Avoid", label: "Avoid" },
  {
    value: "Accept and Keep under review",
    label: "Accept and Keep under review",
  },
  { value: "Insure", label: "Insure" },
  { value: "Risk sharing or partnership", label: "Risk sharing or partnership" },
  { value: "Diversification", label: "Diversification" },
  { value: "Contingency planning", label: "Contingency planning" },
  {
    value: "Internal policy or procedure",
    label: "Internal policy or procedure",
  },
  { value: "Professional advice", label: "Professional advice" },
  {
    value: "Mitigate with corporate objective",
    label: "Mitigate with corporate objective",
  },
  { value: "Stress test", label: "Stress test" },
  { value: "Other", label: "Other" },
];

export const riskOccuranceValue: { [key: number]: string } = {
  6: "Monthly",
  5: "Every 2 months",
  4: "Quarterly",
  3: "Six-Monthly",
  2: "Annually",
};

type TRiskForm = {
  formData: TRisksFormValues;
  onSuccess?: (values: TRisksFormValues) => void;
  isEdit: boolean;
  fetchData?: () => void;
  corporateObjectives?: CorporateObjective[] | null;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Risk name is required"),
  description: yup.string().required("Risk description is required"),
  riskType: yup.string().required("Risk type is required"),
  nextReview: yup.date().required("Next review date is required"),
  owner: yup.string().required("Risk owner is required"),
  probability: yup.string().required("Probability  is required"),
  impact: yup.string().required("Impact  is required"),
});

// All mitigation options values where probability and/or impact depend upon probabaility and/or impact of risk 
const MITIGATION_OPTIONS_VALUES = {
  avoid: "Avoid",
  accept: "Accept and Keep under review",
  stress: "Stress test",
  insure: "Insure",
}

const StrategicRisksForm = ({
  formData,
  onSuccess,
  isEdit,
  corporateObjectives,
}: TRiskForm) => {
  const [loading, setLoading] = useState(false);
  const companyId = useSelectedAccountCompany()?.companyId;
  const useAccess = useAccessLevel()
  const { trackAmplitudeEvent } = useAmplitudeContext();

  const objectives = useMemo(() => {
    return corporateObjectives?.map((item: any) => ({
      value: item.id,
      label: item.name,
    }))
  }, [corporateObjectives]);

  const formik = useFormik<TRisksFormValues>({
    initialValues: {
      name: formData?.name || "",
      other: formData?.other || "",
      description: formData?.description || "",
      riskType: formData?.riskType || "",
      nextReview: formData?.nextReview || new Date().toISOString(),
      lastReview: formData?.lastReview || new Date().toISOString(),
      dateCreated: formData?.dateCreated || new Date().toISOString(),
      owner: typeof formData?.owner !== "string" ? formData?.owner?.id : formData?.owner || "",
      impact: formData?.impact || 1,
      probability: formData?.probability || 1,
      reviewFrequency: formData?.reviewFrequency || 2,
      mitigations: formData?.mitigations || [],
    },
    validationSchema,
    validateOnMount: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const dataToSend = {
          ...values,
        };

        if (values.mitigations && values.mitigations?.length) {
          const mitigations = values.mitigations?.map(
            (mitigation: TMitigation) => {
              if (mitigation?.name === "Other") {
                return {
                  newImpact: mitigation.newImpact,
                  newProbability: mitigation.newProbability,
                  notes: mitigation.notes,
                  status: mitigation.status,
                  name: mitigation.other as string,
                };
              } else if (
                mitigation?.name === "Mitigate with corporate objective"
              ) {
                return {
                  name: mitigation.name,
                  newImpact: mitigation.newImpact,
                  newProbability: mitigation.newProbability,
                  notes: mitigation.notes,
                  status: mitigation.status,
                  objectiveId: mitigation?.objectiveId,
                };
              }

              return {
                name: mitigation.name,
                newImpact: mitigation.newImpact,
                newProbability: mitigation.newProbability,
                notes: mitigation.notes,
                status: mitigation.status,
              };
            }
          );

          dataToSend.mitigations = mitigations;
        }

        if (isEdit && companyId && formData.id) {
          await API.updateStrategicRisk(companyId, formData.id, dataToSend);
          if (onSuccess) {
            trackAmplitudeEvent(EVENT_NAME.RISK_SAVE, {
              user_id: useAccess && useAccess?.userId,
              actioned_at: new Date().toISOString(),
              platform: PLATFORM.WEB
            });
            onSuccess(values);
          }
        }

        if (companyId && !isEdit) {
          await API.createStrategicRisk(companyId, dataToSend);
          if (onSuccess) {
            trackAmplitudeEvent(EVENT_NAME.RISK_SAVE, {
              user_id: useAccess && useAccess?.userId,
              actioned_at: new Date().toISOString(),
              platform: PLATFORM.WEB
            });
            onSuccess(values);
          }
        }

        formik.resetForm();
      } catch (err: any) {
        Toast.error(err?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: formData?.name || "",
      other: formData?.other || "",
      description: formData?.description || "",
      riskType: formData?.riskType || "",
      nextReview: formData?.nextReview || new Date().toISOString(),
      lastReview: formData?.lastReview || new Date().toISOString(),
      dateCreated: formData?.dateCreated || new Date().toISOString(),
      owner: typeof formData?.owner !== "string" ? formData?.owner?.id : formData?.owner || "",
      impact: formData?.impact || 1,
      probability: formData?.probability || 1,
      reviewFrequency: formData?.reviewFrequency || 2,
      mitigations: formData?.mitigations || [],
    })
  }, [formData])


  const onClickDelete = (index: number, key: keyof TRisksFormValues): void => {
    if (formik.values.mitigations) {
      const currentValue = [...formik.values.mitigations];
      currentValue.splice(index, 1);
      formik.setFieldValue(key, currentValue);
    }
  };
  const { impact, probability, mitigations, reviewFrequency, lastReview } = formik.values

  const probabilityCount: any = {
    '1': 0,
    '2': 0,
    '3': 0,
  };

  const impactCount: any = {
    '1': 0,
    '2': 0,
    '3': 0,
  };

  mitigations?.forEach((mitigation) => {
    const { newProbability, newImpact, status } = mitigation;
    if (status === 'Done') {
      probabilityCount[newProbability]++;
      impactCount[newImpact]++;
    }
  });

  let mostRepeatedProb = "1", mostRepeatedImpact = "1";
  let maxCountOfProb = 0;
  let maxCountOfImpact = 0;

  const priorityOrder = ['1', '2', '3'];

  for (const priority of priorityOrder) {
    if (probabilityCount[priority] > maxCountOfProb) {
      mostRepeatedProb = priority;
      maxCountOfProb = probabilityCount[priority];
    }
    if (impactCount[priority] > maxCountOfImpact) {
      mostRepeatedImpact = priority;
      maxCountOfImpact = impactCount[priority];
    }
  }

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

  const updateReviewDate = useCallback(() => {
    let reviewDate: Dayjs | undefined = undefined;
    if (lastReview) {
      if (reviewFrequency === 6) {
        reviewDate = dayjs(lastReview).add(1, "month");
      } else if (reviewFrequency === 5) {
        reviewDate = dayjs(lastReview).add(2, "month");
      } else if (reviewFrequency === 4) {
        reviewDate = dayjs(lastReview).add(3, "month");
      } else if (reviewFrequency === 3) {
        reviewDate = dayjs(lastReview).add(6, "month");
      } else if (reviewFrequency === 2) {
        reviewDate = dayjs(lastReview).add(1, "year");
      }
    }
    formik.setFieldValue("nextReview", reviewDate?.toISOString());
  }, [lastReview, reviewFrequency]);

  useEffect(() => {
    updateReviewDate();
  }, [updateReviewDate]);

  useEffect(() => {
    reviewFrequencyCalculations();
  }, [reviewFrequencyCalculations]);


  if (!formik) {
    setLoading(true);
  }

  const getImpactProbality = (value?: string) => {
    if (
      value === MITIGATION_OPTIONS_VALUES.accept ||
      value === MITIGATION_OPTIONS_VALUES.stress
    ) {
      return {
        mitigation: true,
        probability: true,
      };
    } else if (value === MITIGATION_OPTIONS_VALUES.insure) {
      return {
        mitigation: false,
        probability: true,
      };
    } else if (value === MITIGATION_OPTIONS_VALUES.avoid) {
      return {
        mitigation: true,
        probability: false,
      };
    } else {
      return {
        mitigation: false,
        probability: false,
      };
    }
  }

  const setImpactValue = (value?: string, index?: number, values?: number) => {
    if (
      value === MITIGATION_OPTIONS_VALUES.accept ||
      value === MITIGATION_OPTIONS_VALUES.stress
    ) {
      formik.setFieldValue(`mitigations[${index}].newImpact`, values);
    } else if (value === MITIGATION_OPTIONS_VALUES.avoid) {
      formik.setFieldValue(`mitigations[${index}].newImpact`, values);
    }
  };

  const setProbalityValue = (
    value?: string,
    index?: number,
    values?: number
  ) => {
    if (
      value === MITIGATION_OPTIONS_VALUES.accept ||
      value === MITIGATION_OPTIONS_VALUES.stress
    ) {
      formik.setFieldValue(`mitigations[${index}].newProbability`, values);
    } else if (value === MITIGATION_OPTIONS_VALUES.insure) {
      formik.setFieldValue(`mitigations[${index}].newProbability`, values);
    }
  };

  const setImpactProbalityValues = (value: string, index: number) => {
    if (
      value === MITIGATION_OPTIONS_VALUES.accept ||
      value === MITIGATION_OPTIONS_VALUES.stress
    ) {
      formik.setFieldValue(
        `mitigations[${index}].newImpact`,
        formik.values?.impact
      );
      formik.setFieldValue(
        `mitigations[${index}].newProbability`,
        formik.values?.probability
      );
    } else if (value === MITIGATION_OPTIONS_VALUES.insure) {
      formik.setFieldValue(
        `mitigations[${index}].newProbability`,
        formik.values?.probability
      );
    } else if (value === MITIGATION_OPTIONS_VALUES.avoid) {
      formik.setFieldValue(
        `mitigations[${index}].newImpact`,
        formik.values?.impact
      );
    }
  };
  return (
    <>
      <Space size={10} />
      <React.Fragment key={formik?.values?.id}>
        <Typography size="giant">Risk</Typography>

        <FlexBox className={styles.card} flexDirection="column">
          <Space size={15} />
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <Field label="Name*" errorMessage={formik.errors.name}>
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
          </Row>
          <Space size={15} />
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <FlexBox flexDirection="column">
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <Field
                      label="Owner / Department*"
                      errorMessage={formik.errors.owner}
                    >
                      <DepartmentSelect
                        addNewOption="Department"
                        size="large"
                        allowClear
                        placeholder="Select"
                        onChange={(value) =>
                          formik.setFieldValue("owner", value)
                        }
                        value={typeof formik?.values?.owner === "string" ? formik?.values?.owner : ""}
                        status={formik.errors.owner && "error"}
                      />
                    </Field>
                  </Col>
                  <Col span={12}>
                    <FlexBox flexDirection="column">
                      <Field
                        label="Next Review*"
                        errorMessage={formik.errors.nextReview}
                      >
                        <DatePicker
                          name="nextReview"
                          size="large"
                          placeholder="__/__/____"
                          format="DD/MM/YYYY"
                          onChange={(value) => {
                            formik.setFieldValue(
                              `nextReview`,
                              value?.toISOString()
                            );
                          }}
                          value={dayjs(formik.values.nextReview)}
                          status={formik.errors.nextReview && "error"}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                </Row>

                <Space size={15} />

                <Row gutter={[30, 0]}>
                  <Space size={10} />
                  <Col span={12}>
                    <Field
                      label="Risk Type*"
                      errorMessage={formik.errors.riskType}
                    >
                      <Select
                        size="large"
                        placeholder="Select"
                        options={RISK_TYPES}
                        className={styles.fullWidth}
                        onChange={(value) =>
                          formik.setFieldValue(`riskType`, value)
                        }
                        value={formik?.values?.riskType}
                        status={formik.errors.riskType && "error"}
                      />
                    </Field>
                  </Col>
                  {formik?.values?.riskType === "others" && (
                    <Col span={12}>
                      <FlexBox flexDirection="column">
                        <Field label="Value" errorMessage={formik.errors.other}>
                          <Input
                            name={"other"}
                            size="large"
                            className={styles.fullWidth}
                            onChange={formik.handleChange}
                            value={formik?.values?.other}
                            status={formik.errors.other && "error"}
                          />
                        </Field>
                      </FlexBox>
                    </Col>
                  )}
                </Row>

                <Space size={15} />

                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox flexDirection="column">
                      <Field
                        label="Last Review Date*"
                        errorMessage={formik.errors.lastReview}
                      >
                        <DatePicker
                          name="lastReview"
                          size="large"
                          placeholder="__/__/____"
                          format="DD/MM/YYYY"
                          onChange={(value) => {
                            formik.setFieldValue(
                              `lastReview`,
                              value?.toISOString()
                            );
                          }}
                          value={dayjs(formik.values.lastReview)}
                          status={formik.errors.lastReview && "error"}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                  <Col span={12}>
                    {isEdit && (
                      <FlexBox flexDirection="column">
                        <Field label="Date Created">
                          <DatePicker
                            name="dateCreated"
                            size="large"
                            placeholder="__/__/____"
                            format="DD/MM/YYYY"
                            disabled
                            value={dayjs(formik.values.dateCreated)}
                          />
                        </Field>
                      </FlexBox>
                    )}
                  </Col>
                </Row>

                <Space size={15} />

                <Row gutter={[30, 0]}>
                  <Col span={24}>
                    <Field
                      label="Description*"
                      errorMessage={formik.errors.description}
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

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox flexDirection="column">
                      <Field
                        label="Impact on company if risk occurs*"
                        errorMessage={formik.errors.impact}
                      >
                        <Select
                          size="large"
                          placeholder="Select"
                          options={riskScores}
                          className={styles.fullWidth}
                          onChange={(value) => {
                            formik.setFieldValue(`impact`, value);
                            mitigations?.forEach((mitigation, index) => {
                              setImpactValue(mitigation?.name, index, value);
                            });
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
                      >
                        <Select
                          size="large"
                          placeholder="Select"
                          options={riskScores}
                          className={styles.fullWidth}
                          onChange={(value) => {
                            formik.setFieldValue(`probability`, value);
                            mitigations?.forEach((mitigation, index) => {
                              setProbalityValue(mitigation?.name, index, value);
                            });
                          }}
                          value={formik?.values?.probability}
                          status={formik.errors.probability && "error"}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                </Row>

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox
                      flexDirection="column"
                      justifyContent="center"
                      className={styles.height100}
                    >
                      <Typography size="large">
                        Review frequency (auto generated)
                      </Typography>
                    </FlexBox>
                  </Col>
                  <Col span={12}>
                    <FlexBox flexDirection="column">
                      <Space size={8} />
                      <Input
                        name={`detail`}
                        size="large"
                        placeholder="0"
                        value={
                          reviewFrequency && riskOccuranceValue[reviewFrequency]
                        }
                        disabled
                      />
                    </FlexBox>
                  </Col>
                </Row>
                <Space size={15} />
              </FlexBox>
            </Col>
          </Row>
        </FlexBox>
      </React.Fragment>
      {formik.values?.mitigations?.map((mitigation, index) => {
        const data = getImpactProbality(mitigation?.name);
        const impactAfter = data?.mitigation;
        const probabilityAfter = data?.probability;

        return (
          <React.Fragment key={index}>
            <FlexBox justifyContent="space-between">
              <Typography size="giant">Mitigation {index + 1}</Typography>

              {(formik.values?.mitigations?.length && (!isEdit || formik.values?.mitigations?.length > 1)) && (
                <Typography serif size="huge">
                  <Clickable
                    onClick={() => onClickDelete(index, "mitigations")}
                  >
                    <Image
                      src="/icons/delete-icon.svg"
                      alt="delete icon"
                      width={24}
                      height={24}
                    />
                  </Clickable>
                </Typography>
              )}
            </FlexBox>

            <Typography size="large" red>
              Set out how you will mitigate the above risk
            </Typography>
            <Space size={24} />
            <FlexBox className={styles.card} flexDirection="column">
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <FlexBox flexDirection="column">
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field label="Name">
                          <Select
                            size="large"
                            placeholder="Select"
                            options={mitigationOptions}
                            className={styles.fullWidth}
                            onChange={(value) => {
                              formik.setFieldValue(
                                `mitigations[${index}].name`,
                                value
                              );
                              setImpactProbalityValues(value, index);
                            }}
                            value={mitigation?.name}
                          />
                        </Field>
                      </Col>
                      {formik?.values?.mitigations?.[index]?.name ===
                        "Other" && (
                        <>
                          <Col span={12}>
                            <Field label="Other Name">
                              <Input
                                name={`mitigations[${index}].other`}
                                size="large"
                                className={styles.fullWidth}
                                onChange={formik.handleChange}
                                value={mitigation?.other}
                              />
                            </Field>
                          </Col>
                        </>
                      )}
                      {formik?.values?.mitigations?.[index]?.name ===
                        "Mitigate with corporate objective" && (
                        <>
                          <Col span={12}>
                            <Field label="Mitigate with corporate objective">
                              <Select
                                size="large"
                                placeholder="Select"
                                options={objectives}
                                className={styles.fullWidth}
                                onChange={(value) =>
                                  formik.setFieldValue(
                                    `mitigations[${index}].objectiveId`,
                                    value
                                  )
                                }
                                value={mitigation?.objectiveId}
                              />
                            </Field>
                          </Col>
                        </>
                      )}
                    </Row>

                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field label="Status">
                          <Radio.Group
                            name={`mitigations[${index}].status`}
                            className={styles.fullWidth}
                            onChange={formik.handleChange}
                            value={formik?.values?.mitigations?.[index]?.status}
                          >
                            <Radio value="To Do">Pending</Radio>
                            <Radio value="Done">In place</Radio>
                          </Radio.Group>
                        </Field>
                      </Col>
                    </Row>

                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field label="Impact after Mitigation">
                          <Select
                            size="large"
                            disabled={impactAfter}
                            placeholder="Select"
                            options={riskScores}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `mitigations[${index}].newImpact`,
                                value
                              )
                            }
                            value={mitigation?.newImpact}
                          />
                        </Field>
                      </Col>
                      <Col span={12}>
                        <Field label="Probability after mitigant">
                          <Select
                            size="large"
                            disabled={probabilityAfter}
                            placeholder="Select"
                            options={riskScores}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `mitigations[${index}].newProbability`,
                                value
                              )
                            }
                            value={mitigation?.newProbability}
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Field label="Notes">
                          <TextArea
                            rows={4}
                            name={`mitigations[${index}].notes`}
                            size="large"
                            placeholder="Enter here"
                            onChange={formik.handleChange}
                            value={mitigation?.notes}
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Space size={15} />
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
          </React.Fragment>
        );
      })}
      <FlexBox
        className={styles.cards}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography size="huge">
          Add Mitigation №{" "}
          {formik.values?.mitigations && formik.values?.mitigations?.length + 1}
        </Typography>
        <AddButton
          onClick={() => {
            trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED, {
              feature: FEATURE.RISK,
              name: EVENT_NAME.BUTTON_CLICKED,
              property: EVENT_PROPERTY.ADD_RISK_MITIGATION,
              type: EVENT_TYPE.CLICK
            });
            formik.values?.mitigations &&
              formik.setFieldValue("mitigations", [
                ...formik.values?.mitigations,
                {
                  name: "Avoid",
                  newImpact: formik?.values?.impact || 1,
                  newProbability: 1,
                  notes: "",
                  status: "To Do",
                },
              ]);
          }}
        />
      </FlexBox>
      <Space size={24} />
      <Row gutter={[30, 0]} justify={"end"}>
        <Col span={24}>
          <div className={styles.buttonFinish}>
            <Button
              loading={loading}
              type="primary"
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid}
              style={{ marginLeft: 15 }}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default StrategicRisksForm;
