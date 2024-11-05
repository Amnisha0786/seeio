import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Col, DatePicker, Input, Row, Select, Tooltip } from 'antd'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import camelcaseKeys from "camelcase-keys"
import TextArea from 'antd/es/input/TextArea'
import { InfoCircleOutlined } from "@ant-design/icons"

import * as API from "@/api";
import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import styles from './objective-card.module.scss'
import Space from '@/components/space'
import { useSelectedAccountCompany } from '@/hooks'
import Toast from '@/components/toast'
import { KeyIndicator } from '@/models/corporate-objective'
import { 
  INDICATOR_STATUS, 
  frequencyOptions, 
  indicatorOptions, 
  objectiveCategoryOptions, 
  objectiveStatus, 
  reviewFrequencyOptions 
} from '@/app/(protected)/dashboard/business-health/corporate-objectives/add-action-form'
import Field from '@/components/field'
import TooltipText from '@/components/tooltip'
import PeopleSelect from '@/shared/people-select';
import CurrencySelect from '@/app/(protected)/dashboard/business-health/corporate-objectives/currency-select'
import { OBJECTIVE_STATUS_TITLES } from '@/app/(protected)/dashboard/business-health/corporate-objectives/preview-action-details'
import { validationSchema } from '@/app/(protected)/dashboard/business-health/corporate-objectives/add-action-modal'

type ActionDetails = {
  objCategory?: string;
  name: string;
  description: string;
  objStatus: string;
  reviewFrequency?: number;
  frequencyDuration?: string;
  nextReview: string;
  keyIndicators?: KeyIndicator[];
  other?: string;
  dateCreated?: string;
  lastReview?: string;
  startDate?: string;
};
const ObjectiveCard = ({
  objective,
}: {
  objective: ActionDetails;
}) => {
  objective.reviewFrequency = reviewFrequencyOptions[0].value
  const [savingData, setIsSavingData] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId;

  const inintialValues = useMemo(() => {

    const initial = camelcaseKeys({ ...objective })
    if (initial.keyIndicators?.length) {
      initial.keyIndicators?.map((indicator, index) => {
        if (initial.keyIndicators) {
          initial.keyIndicators[index].status = objectiveStatus[0].value
        }
      })
    }

    return initial
  }, [objective])

  const formik = useFormik({
    validateOnChange: false,
    initialValues: inintialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSavingData(true)
      const apiObject = { ...values };
      apiObject?.keyIndicators?.map((indicator: KeyIndicator) => {
        if (indicator?.type === 'qualitive') {
          delete indicator?.value;
        }
        if (indicator?.status !== INDICATOR_STATUS.IN_PROGRESS) {
          delete indicator?.startDate
        }
        if (indicator?.status !== INDICATOR_STATUS.COMPLETED && indicator?.status !== INDICATOR_STATUS.ABANDONED) {
          delete indicator?.endDate
        }
      });
      try {
        await API.createCorporateObjectiveActions(values, companyId);
        formik.resetForm();
        Toast.success('Objective created sucessfully.');
      } catch (err: any) {
        Toast.error(err?.message || 'Something went wrong.');
      }
      setIsSavingData(false)

    },
  });


  const updateNextDate = useCallback(
    () => {
      let nextReviewDate = dayjs();
      if (formik.values?.lastReview && formik.values?.reviewFrequency) {
        nextReviewDate = dayjs(formik.values?.lastReview).add((formik.values?.reviewFrequency), "month");
      }
      formik.setFieldValue('nextReview', nextReviewDate?.toISOString());
    }, [
      formik.values?.lastReview,
      formik.values?.reviewFrequency,
    ]
  );

  useEffect(() => {
    updateNextDate();
  }, [updateNextDate]);

  const updateObjStatus = useCallback(() => {
    let objectiveStatus = OBJECTIVE_STATUS_TITLES.CURRENT;

    if (!formik.values?.keyIndicators?.length) {
      objectiveStatus = OBJECTIVE_STATUS_TITLES.METRICS_MISSING
    } else if (formik.values?.keyIndicators?.every(
      (indicator: KeyIndicator) =>
        indicator.status === INDICATOR_STATUS.ABANDONED ||
        indicator.status === INDICATOR_STATUS.COMPLETED
    )) {
      objectiveStatus = OBJECTIVE_STATUS_TITLES.COMPLETE
    } else if (
      formik.values?.keyIndicators?.some(
        (indicator: KeyIndicator) =>
          (indicator.status === INDICATOR_STATUS.IN_PROGRESS ||
            indicator.status === INDICATOR_STATUS.NOT_STARTED) &&
          dayjs(formik?.values?.nextReview) < dayjs())
    ) {
      objectiveStatus = OBJECTIVE_STATUS_TITLES.REVIEW_OVERDUE
    } else if (formik.values?.keyIndicators?.some(
      (indicator: KeyIndicator) =>
        (indicator.status === INDICATOR_STATUS.IN_PROGRESS ||
          indicator.status === INDICATOR_STATUS.NOT_STARTED) &&
        dayjs(formik?.values?.nextReview) <= dayjs(new Date()).add(30, "day"))) {
      objectiveStatus = OBJECTIVE_STATUS_TITLES.REVIEW_DUE
    }

    formik.setFieldValue("objStatus", objectiveStatus);
  }, [formik.values.keyIndicators, formik?.values?.nextReview]);

  useEffect(() => {
    updateObjStatus()
  }, [updateObjStatus])

  const onChangeSelect = (
    index: number,
    key: keyof KeyIndicator,
    value: string
  ) => {
    const values = formik.values.keyIndicators;
    if (values) {
      values[index][key] = value;
      formik.setFieldValue('keyIndicators', [...values]);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.setupACompanyModal}>
        <Typography size='giant'>
          Add Objective
        </Typography>
        <Space size={24} />

        <FlexBox flexDirection='column'>
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <FlexBox flexDirection='column'>
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <Field
                      label='Objective category'
                      errorMessage={formik.errors.name}
                    >
                      <Select
                        size='large'
                        placeholder='Select'
                        options={objectiveCategoryOptions}
                        onChange={(value) =>
                          formik.setFieldValue('name', value)
                        }
                        value={formik?.values?.name}
                        status={formik.errors.name && 'error'}
                      />
                    </Field>
                  </Col>
                </Row>

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox flexDirection='column'>
                      <Field
                        label='Objective Status'
                        sideContent={<><Space horizontal size={5} />
                          <TooltipText
                            title={"This status is based on the status of the Key indicators."}
                            readMoreText={
                              <ul>
                                <li>If all of the key indicators are blank or not started then the status will be “Planned”.</li>
                                <li>If the status is Completed or abandoned, then the objective status will be “Archived”.</li>
                                <li>A Current status indicates that one or more Key indicators is “In Progress”.</li>
                              </ul>
                            }
                            defaultIconSize={true}
                          />
                        </>}
                      >
                        <Input disabled
                          size='large'
                          value={formik.values.objStatus}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                  <Col span={12}>
                    <FlexBox flexDirection='column'>
                      <Field
                        label='Last review Date'
                        errorMessage={formik.errors.lastReview}
                      >
                        <DatePicker
                          name='lastReview'
                          size='middle'
                          placeholder='__/__/____'
                          format='DD/MM/YYYY'
                          onChange={(value) => {
                            formik.setFieldValue(
                              'lastReview',
                              value?.toISOString()
                            );
                          }}
                          value={
                            formik.values.lastReview
                              ? dayjs(formik?.values?.lastReview)
                              : null
                          }
                          status={formik.errors.lastReview && 'error'}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                </Row>

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <FlexBox flexDirection='column'>
                      <Field
                        label='Review Frequency'
                        errorMessage={formik.errors.reviewFrequency}
                        sideContent={<><Space horizontal size={5} />
                          <TooltipText
                            title={"Review frequency sets the frequency that this objective is added to the board agenda for review."}
                            readMoreText={
                              // eslint-disable-next-line max-len
                              "Regularly review and adjust objectives and key indicators. As your organisation grows and market conditions change, so too may the relevance of your objectives and key indicators."
                            }
                            defaultIconSize={true}
                          />
                        </>}
                      >
                        <Select
                          size='large'
                          placeholder='Select'
                          options={reviewFrequencyOptions}
                          className={styles.fullWidth}
                          onChange={(value) =>
                            formik.setFieldValue('reviewFrequency', value)
                          }
                          value={formik.values.reviewFrequency}
                          status={formik.errors.reviewFrequency && 'error'}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                  <Col span={12}>
                    <FlexBox flexDirection='column'>
                      <Field
                        label='Next Review Date'
                        errorMessage={formik.errors.nextReview}
                      >
                        <DatePicker
                          name='nextReview'
                          disabled
                          size='middle'
                          placeholder='__/__/____'
                          format='DD/MM/YYYY'
                          value={
                            formik.values.nextReview
                              ? dayjs(formik.values.nextReview)
                              : null
                          }
                          status={formik.errors.nextReview && 'error'}
                        />
                      </Field>
                    </FlexBox>
                  </Col>
                </Row>

                {formik.values?.dateCreated && <><Space size={15} />
                  <Row gutter={[30, 0]}>
                    <Col span={12}>
                      <FlexBox flexDirection='column'>
                        <Field label='Date Created'>
                          <DatePicker
                            disabled
                            name='dateCreated'
                            size='middle'
                            placeholder='__/__/____'
                            format='DD/MM/YYYY'
                            value={dayjs(formik.values.dateCreated)}
                          />
                        </Field>
                      </FlexBox>
                    </Col>
                  </Row></>}

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={24}>
                    <Field
                      label='Description'
                      errorMessage={formik.errors.description}
                      sideContent={<><Space horizontal size={5} />
                        <TooltipText
                          title={" In your description, cover the SMART elements:"}
                          readMoreText={
                            <ul>
                              <li>
                                Specific - describe what the objective is and outline the strategy to achieve it.
                              </li>
                              <li>Measurable - The key indicators are defined in the section below so may not need repeating here.</li>
                              <li>Achievable - Affirm the attainability.</li>
                              <li>Relevant - define the link between the objective and the Mission statement.</li>
                              <li>Timebound - outline the milestones and time horizon.</li>
                            </ul>
                          }
                          defaultIconSize={true}
                        />
                      </>}
                    >

                      <TextArea
                        maxLength={500}
                        count={{
                          show: true,
                          max: 500,
                          strategy: (txt) => txt?.length,
                          exceedFormatter: (txt, { max }) => txt?.slice(0, max)
                        }}
                        name='description'
                        size='large'
                        placeholder='Enter here'
                        onChange={formik.handleChange}
                        value={formik?.values?.description}
                        status={formik.errors.description && 'error'}
                        style={{ height: 160, resize: 'none' }}
                      />
                    </Field>
                  </Col>
                </Row>
                <Space size={35} />
              </FlexBox>
            </Col>
          </Row>
        </FlexBox>
      </div>

      <div className={styles.setupACompanyModal}>
        {formik.values.keyIndicators?.map((keyIndicator: KeyIndicator, index: number) => (
          <React.Fragment key={index}>
            <Space size={25} />
            <FlexBox justifyContent='space-between'>
              <FlexBox>
                <Typography size='enormous'>Key Indicator</Typography>
                <Space horizontal size={10} />
                <TooltipText
                  title={
                    <>
                      <Typography
                        size='large'
                        blue
                        className={styles.headingStyle}
                      >
                        Guidelines for key indicators :
                      </Typography>
                      <p> Set a series of Key indicators or Metrics which will measure the progress towards your objective. </p>
                    </>}
                  readMoreText={
                    <>
                      <Typography size='large' blue className={styles.headingStyle}>Tips for key indicators :</Typography>
                      <p>Use a mix of leading indicators 
                        (predictive measures that show progress toward achieving an objective) 
                        and lagging indicators (outcome measures that indicate if you achieved the objective).</p>
                      <p><span className={styles.headingStyle}>Remember :</span> 
                      The right metrics turn your vision into action and your strategy into results. Take the time to choose them wisely.</p>
                      <p>Examples could include:</p>
                      <ul>
                        <li>For a <span className={styles.headingStyle}>Revenue Growth </span> objective: Increase sales by 10% quarterly.</li>
                        <li>For 
                          <span className={styles.headingStyle}>Customer Engagement </span>:
                           Improve customer satisfaction scores by 15% by year-end.</li>
                        <li>For 
                          <span className={styles.headingStyle}>Operational Excellence </span>: Reduce production costs by 5% over six months.</li>
                      </ul>
                    </>
                  }
                  defaultIconSize={true}
                />
              </FlexBox>

            </FlexBox>

            <Space size={24} />

            <FlexBox className={styles.card} flexDirection='column'>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <FlexBox flexDirection='column'>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field
                          label='Name'
                          errorMessage={
                            Array.isArray(formik.errors?.keyIndicators)
                              ? formik?.errors?.keyIndicators?.[index]?.name
                              : ''
                          }
                        >
                          <Input
                            name={`keyIndicators[${index}].name`}
                            size='large'
                            placeholder='Enter here'
                            onChange={formik.handleChange}
                            value={keyIndicator.name}
                            status={
                              Array.isArray(formik.errors?.keyIndicators) &&
                              formik?.errors?.keyIndicators?.[index]?.name &&
                              'error'
                            }
                          />
                        </Field>
                      </Col>
                      <Col span={12}>
                        <Field
                          label='Owner / Departament'
                          errorMessage={
                            Array.isArray(formik.errors?.keyIndicators)
                              ? formik?.errors?.keyIndicators?.[index]?.owner
                              : ''
                          }
                          sideContent={<><Space horizontal size={5} />
                            <Tooltip placement='top' 
                            // eslint-disable-next-line max-len
                              title={"Choose the person or department responsible for this key indicator. This is the person who will be asked to complete the progress update in preparation for board meetings."}
                              color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                              <InfoCircleOutlined />
                            </Tooltip>
                          </>}
                        >
                          <PeopleSelect
                            size='large'
                            allowClear
                            placeholder='Select'
                            selectFirstPerson={true}
                            onChange={(value) =>
                              onChangeSelect(index, 'owner', value)
                            }
                            value={keyIndicator.owner}
                            status={
                              Array.isArray(formik.errors?.keyIndicators) &&
                              formik?.errors?.keyIndicators?.[index]?.owner &&
                              'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>
                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Field
                          label='Indicator Type'
                          errorMessage={
                            Array.isArray(formik.errors?.keyIndicators)
                              ? formik?.errors?.keyIndicators?.[index]?.type
                              : ''
                          }
                          sideContent={<><Space horizontal size={5} />
                            <TooltipText
                              title={"You can choose either “Qualitive or Quantitive indicators."}
                              readMoreText={
                                "If you choose Quantitive then there are options for currency, numeric or percentage indicators."
                              }
                              defaultIconSize={true}
                            />
                          </>}
                        >
                          <Select
                            size='large'
                            placeholder='Select'
                            options={indicatorOptions}
                            className={styles.fullWidth}
                            onChange={(value: string) => {
                              onChangeSelect(index, 'type', value);
                              if (value === 'qualitive') {
                                formik.setFieldValue(
                                  `keyIndicators[${index}].value`,
                                  ''
                                );
                              }
                            }}
                            value={keyIndicator.type}
                            status={
                              Array.isArray(formik.errors?.keyIndicators) &&
                              formik?.errors?.keyIndicators?.[index]?.type &&
                              'error'
                            }
                          />
                        </Field>
                      </Col>
                      <Col span={12}>
                        <Field
                          label='Indicator Status'
                          errorMessage={
                            Array.isArray(formik.errors?.keyIndicators)
                              ? formik?.errors?.keyIndicators?.[index]?.status
                              : ''
                          }
                          sideContent={<><Space horizontal size={5} />
                            <Tooltip placement='top' title={"Set whether the indicator is planned, inforce, or completed/ abandoned."}
                              color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                              <InfoCircleOutlined />
                            </Tooltip>
                          </>}
                        >
                          <Select
                            defaultValue={objectiveStatus[0].value}
                            size='large'
                            placeholder='Select'
                            options={objectiveStatus}
                            className={styles.fullWidth}
                            onChange={(value) =>
                              onChangeSelect(index, 'status', value)
                            }
                            value={keyIndicator.status}
                            status={
                              Array.isArray(formik.errors?.keyIndicators) &&
                              formik?.errors?.keyIndicators?.[index]?.status &&
                              'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>

                    {formik.values.keyIndicators?.[index].type !==
                      'qualitive' && <Space size={15} />}
                    <Row gutter={[30, 0]}>
                      {formik.values.keyIndicators?.[index].type !==
                        'qualitive' && (
                        <Col span={12}>
                          <Field label='Frequency'>
                            <Select
                              size='large'
                              placeholder='Select'
                              options={frequencyOptions}
                              className={styles.fullWidth}
                              onChange={(value) =>
                                onChangeSelect(index, 'frequency', value)
                              }
                              value={keyIndicator.frequency}
                            />
                          </Field>
                        </Col>
                      )}
                      {(keyIndicator?.type === 'numeric' ||
                        keyIndicator?.type === 'percentage' ||
                        keyIndicator?.type === 'currency') && (
                        <Col span={12}>
                          <Field label='Indicator value'>
                            <Input
                              name={`keyIndicators[${index}].value`}
                              size='large'
                              placeholder='Enter here'
                              className={styles.fullWidth}
                              onChange={formik.handleChange}
                              value={keyIndicator?.value}
                            />
                          </Field>
                        </Col>
                      )}
                    </Row>

                    {keyIndicator?.type === 'currency' && <><Space size={15} />
                      <Row gutter={[30, 0]}>
                        <Col span={12}>
                          <Field label='Currency'>
                            <CurrencySelect
                              onChange={(value) => onChangeSelect(index, 'currency', value)}
                              value={keyIndicator?.currency}
                            />
                          </Field>
                        </Col>
                      </Row></>}

                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      {keyIndicator?.status === INDICATOR_STATUS.IN_PROGRESS && <Col span={12}>
                        <FlexBox flexDirection='column'>
                          <Field
                            label='Start Date'
                          >
                            <DatePicker
                              name={`keyIndicators[${index}].startDate`}
                              size='middle'
                              placeholder='__/__/____'
                              format='DD/MM/YYYY'
                              onChange={(value) => {
                                formik.setFieldValue(
                                  `keyIndicators[${index}].startDate`,
                                  value?.toISOString()
                                )
                              }}
                              defaultValue={dayjs(keyIndicator?.startDate)}
                              value={
                                dayjs(keyIndicator?.startDate)
                              }
                            />
                          </Field>
                        </FlexBox>
                      </Col>}
                      {(keyIndicator?.status === INDICATOR_STATUS.COMPLETED || keyIndicator?.status === INDICATOR_STATUS.ABANDONED) && <Col span={12}>
                        <FlexBox flexDirection='column'>
                          <Field
                            label='End Date'
                          >
                            <DatePicker
                              name={`keyIndicators[${index}].endDate`}
                              size='middle'
                              placeholder='__/__/____'
                              format='DD/MM/YYYY'
                              onChange={(value) => {
                                formik.setFieldValue(
                                  `keyIndicators[${index}].endDate`,
                                  value?.toISOString()
                                )
                              }}
                              defaultValue={dayjs(keyIndicator?.endDate)}
                              value={
                                dayjs(keyIndicator?.endDate)
                              }
                            />
                          </Field>
                        </FlexBox>
                      </Col>}
                    </Row>

                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Field
                          label='Description'
                          errorMessage={
                            Array.isArray(formik.errors?.keyIndicators)
                              ? formik?.errors?.keyIndicators?.[index]
                                ?.description
                              : ''
                          }
                        >
                          <TextArea
                            autoSize={false}
                            maxLength={500}
                            count={{
                              show: true,
                              max: 500,
                              strategy: (txt) => txt?.length,
                              exceedFormatter: (txt, { max }) => txt?.slice(0, max)
                            }}
                            name={`keyIndicators[${index}].description`}
                            size='large'
                            placeholder='Enter here'
                            onChange={formik.handleChange}
                            value={keyIndicator.description}
                            style={{ height: 160, resize: 'none' }}
                            status={
                              Array.isArray(formik.errors?.keyIndicators) &&
                              formik?.errors?.keyIndicators?.[index]
                                ?.description &&
                              'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Space size={25} />
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
          </React.Fragment>
        ))}
        <Space size={24} />

        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <div className={styles.buttonFinish}>
              <Button
                loading={savingData}
                type='primary'
                onClick={() => formik.handleSubmit()}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ObjectiveCard