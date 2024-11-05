/* eslint-disable max-len */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, DatePicker, Input, Row, Select, Tooltip } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons"
import Image from 'next/image';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import FlexBox from '@/components/flex-box';
import Typography from '@/components/typography';
import AddButton from '@/components/add-button';
import styles from './action-form.module.scss';
import Button from '@/components/button';
import Space from '@/components/space';
import Clickable from '@/components/clickable';
import {
  ActionDetails,
  CorporateObjective,
  KeyIndicator,
} from '@/models/corporate-objective';
import Field from '@/components/field';
import PeopleSelect from '@/shared/people-select';
import CurrencySelect from './currency-select';
import TextArea from 'antd/es/input/TextArea';
import TooltipText from '@/components/tooltip';
import { OBJECTIVE_STATUS_TITLES } from './preview-action-details';
import useAmplitudeContext from '@/hooks/amplitude'
import { useAccessLevel } from '@/hooks'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'
import StartTour from '@/shared/start-tour'
import TourComponent from '@/components/TourComponent'
import { DATA_ROOM_STEPS } from '@/constants'
import { TCongif } from '@/models'

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export enum INDICATOR_STATUS {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export const objectiveCategoryOptions = [
  { value: "Revenue Growth", label: "Revenue Growth" },
  { value: "Financial Stability ", label: "Financial Stability" },
  { value: "Customer and Market Engagement", label: "Customer and Market Engagement" },
  { value: "Innovation and Product Development", label: "Innovation and Product Development" },
  { value: "Operational Excellence", label: "Operational Excellence" },
  { value: 'Sustainability and ESG', label: 'Sustainability and ESG' },
  { value: 'Regulatory Compliance and Data Protection', label: 'Regulatory Compliance and Data Protection' },
  { value: 'Brand and Reputation Enhancement', label: 'Brand and Reputation Enhancement' },
  { value: 'Organisational Culture and Employee Development', label: 'Organisational Culture and Employee Development' },
  { value: 'Corporate Development', label: 'Corporate Development' },
  { value: 'Customer Experience and Service Excellence', label: 'Customer Experience and Service Excellence' },
  { value: 'Digital Transformation and Business Innovation', label: 'Digital Transformation and Business Innovation' },
  { value: 'Market Expansion and Diversification', label: 'Market Expansion and Diversification' },
  { value: 'Stakeholder and Shareholder Value', label: 'Stakeholder and Shareholder Value' },
  { value: 'Product market fit', label: 'Product market fit' },
  { value: 'Proof of concept', label: 'Proof of concept' },
  { value: "Other", label: "Define your own objectiive" },
]

export const reviewFrequencyOptions = [
  { value: 1, label: '1 Month' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '12 Months' },
]

export const objectiveStatus = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
];

export const reviewDurationOptions = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export const frequencyOptions = [
  { value: 0, label: 'One Off' },
  { value: 0.5, label: 'Bi-Monthly' },
  { value: 1, label: 'Monthly' },
  { value: 3, label: 'Quarterly' },
  { value: 6, label: 'Bi-Annually' },
  { value: 12, label: 'Annually' },
];

export const indicatorOptions = [
  { value: 'qualitive', label: 'Qualitive' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'currency', label: 'Currency' },
  { value: 'percentage', label: 'Percentage' },
];

const CorporateObjectiveForm = ({
  isEdit = false,
  loading = false,
  formik,
  modalName,
  configData,
  updategetConfigData
}: {
  onSuccess: (values: ActionDetails) => void;
  companyId: string | undefined;
  viewObjective: CorporateObjective | null;
  isEdit: boolean;
  isOpen?: boolean;
  loading?: boolean;
  formik: any;
  modalName?: string
  configData?: TCongif
  updategetConfigData: () => void
}) => {
  const onClickDelete = (index: number) => {
    if (formik.values?.keyIndicators) {
      const keyIndicators = [...formik.values?.keyIndicators];
      keyIndicators.splice(index, 1);
      formik.setFieldValue('keyIndicators', keyIndicators);
    }
  };
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const [tourStart, setTourStart] = useState(false)
  const userAccess = useAccessLevel()

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
  const openStartTourModalRef = useRef<any>();

  const handleConfirm = () => {
    setTourStart(prev => !prev);
    updategetConfigData()
    openStartTourModalRef?.current?.close();
  };

  useEffect(() => {
    if (
      !tourStart &&
      !configData?.havePlatformTour?.objective &&
      configData?.havePlatformTour?.objective !== undefined
    ) {
      openStartTourModalRef?.current?.open()
    }
  }, [tourStart, configData])


  const updateNextDate = useCallback(
    () => {
      let nextReviewDate = dayjs();
      if (formik.values?.lastReview && formik.values?.reviewFrequency && formik.values?.lastReview !== 'EMPTY') {
        nextReviewDate = dayjs(formik.values?.lastReview).add(parseInt(formik.values?.reviewFrequency), "month");
      } else if (formik.values?.dateCreated) {
        nextReviewDate = dayjs(formik.values.dateCreated);
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

  return (
    <>
      <div className={styles.setupACompanyModal}>
        <FlexBox alignItems='center' justifyContent='flex-start' gap={8}>
          <Typography size='giant'>
            {modalName ? modalName : (isEdit ? 'Edit Objective' : 'Add Objective')}
          </Typography>
          <Clickable
            className={styles.helpIcon}
            onClick={(e) => {
              e.stopPropagation();
              openStartTourModalRef?.current?.open();
            }}>
            <Image
              src="/icons/help-icon.svg"
              alt="App Logo"
              width={20}
              height={20}
            />
          </Clickable>
        </FlexBox>
        <Space size={24} />

        <FlexBox flexDirection='column'>
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <FlexBox flexDirection='column'>
                <Row gutter={[30, 0]}>
                  <Col span={12} >
                    <div id='step1'>
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
                    </div>

                  </Col>
                  <Col span={12}>
                    {formik?.values?.name === "Other" && (
                      <Field label="Define your own objectiive*" errorMessage={formik.errors.other}>
                        <Input
                          name="other"
                          size="large"
                          placeholder="Enter here"
                          onChange={formik.handleChange}
                          value={formik?.values?.other}
                          status={formik.errors?.other && "error"}
                        />
                      </Field>
                    )}
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
                    <div id='step2'>
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
                              formik.values.lastReview &&
                                formik.values.lastReview !== "EMPTY" ?
                                dayjs(formik?.values?.lastReview)
                                : null
                            }
                            status={formik.errors.lastReview && 'error'}
                          />
                        </Field>
                      </FlexBox>
                    </div>
                  </Col>
                </Row>

                <Space size={15} />
                <Row gutter={[30, 0]}>
                  <Col span={12}>
                    <div id='step3'>
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
                    </div>
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
                    <div id='step4'>
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
                    </div>
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
                      <p>Use a mix of leading indicators (predictive measures that show progress toward achieving an objective) and lagging indicators (outcome measures that indicate if you achieved the objective).</p>
                      <p><span className={styles.headingStyle}>Remember :</span> The right metrics turn your vision into action and your strategy into results. Take the time to choose them wisely.</p>
                      <p>Examples could include:</p>
                      <ul>
                        <li>For a <span className={styles.headingStyle}>Revenue Growth </span> objective: Increase sales by 10% quarterly.</li>
                        <li>For <span className={styles.headingStyle}>Customer Engagement </span>: Improve customer satisfaction scores by 15% by year-end.</li>
                        <li>For <span className={styles.headingStyle}>Operational Excellence </span>: Reduce production costs by 5% over six months.</li>
                      </ul>
                    </>
                  }
                  defaultIconSize={true}
                />
              </FlexBox>

              <Clickable onClick={() => onClickDelete(index)}>
                <Image
                  src='/icons/delete-icon.svg'
                  alt='delete icon'
                  width={24}
                  height={24}
                />
              </Clickable>
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
                        <div id='step6'>
                          <Field
                            label='Owner / Departament'
                            errorMessage={
                              Array.isArray(formik.errors?.keyIndicators)
                                ? formik?.errors?.keyIndicators?.[index]?.owner
                                : ''
                            }
                            sideContent={<><Space horizontal size={5} />
                              <Tooltip placement='top' title={"Choose the person or department responsible for this key indicator. This is the person who will be asked to complete the progress update in preparation for board meetings."}
                                color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}>
                                <InfoCircleOutlined />
                              </Tooltip>
                            </>}
                          >
                            <PeopleSelect
                              addNewOption='Person'
                              size='large'
                              allowClear
                              placeholder='Select'
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
                        </div>

                      </Col>
                    </Row>
                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <div id='step5'>
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
                        </div>
                      </Col>
                      <Col span={12}>
                        <div id='step7'>
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
                        </div>
                      </Col>
                    </Row>

                    {formik.values.keyIndicators?.[index].type !==
                      'qualitive' && <Space size={15} />}
                    <Row gutter={[30, 0]}>
                      {formik.values.keyIndicators?.[index].type !==
                        'qualitive' && (
                        <Col span={12}>
                          <div id='step8'>

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
                          </div>

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
                        <div id='step9'>
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
                        </div>
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
        <FlexBox
          className={styles.addKeyIndicator}
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography size='huge'>Add Key Indicator</Typography>
          <AddButton
            onClick={() => {
              formik.setFieldValue('keyIndicators', [
                ...(formik.values?.keyIndicators || []),
                {
                  name: '',
                  owner: '',
                  type: '',
                  status: '',
                  descriptionOfKey: '',
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString()
                },
              ])
              trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED,
                {
                  button_name: 'add_key_indicaror',
                  button_location: 'Corporate_objectives_page',
                  user_id: userAccess?.userId,
                  button_clicked_at: new Date().valueOf(),
                  platform: PLATFORM.WEB,
                });
            }
            }
          />
        </FlexBox>

        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <div className={styles.buttonFinish}>
              <Button
                type='primary'
                loading={loading}
                onClick={() => formik.handleSubmit()}
                className={styles.saveButtonAndFinish}
                style={{ marginRight: '2%' }}
              >
                Save And Finish
              </Button>

              <Button
                loading={loading}
                type='primary'
                onClick={() => formik.handleSubmit()}
              >
                Save
              </Button>
            </div>
          </Col>
        </Row>
        <StartTour
          setTourStart={setTourStart}
          ref={openStartTourModalRef}
          handleConfirm={handleConfirm}
          title="Follow the guide to add or edit objective"
          message="This is the section of the platform that helps with operational alignment and includes Vision, Mission, objectives and risks."
        />
        <TourComponent
          start={tourStart}
          onGoingStep={DATA_ROOM_STEPS.ADD_OBJECTIVE}
        />
      </div>
    </>
  );
};

export default CorporateObjectiveForm;
