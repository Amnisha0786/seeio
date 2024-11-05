import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Col, Divider, Row } from 'antd';
import Image from 'next/image';
import dayjs from "dayjs";

import styles from './action-form.module.scss';
import FlexBox from '@/components/flex-box';
import Typography from '@/components/typography';
import Space from '@/components/space';
import Clickable from '@/components/clickable';
import { CorporateObjective } from '@/models/corporate-objective';
import Modal from '@/components/modal';
import * as API from '@/api';
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks';
import Toast from '@/components/toast';
import Loading from '@/components/loading';
import Status from '@/components/status';
import ConfirmDelete from '@/shared/confirm-delete';
import { frequencyOptions, indicatorOptions, reviewFrequencyOptions } from './add-action-form';
import { COMPANY_USER_ACCESS_LEVEL } from '@/models';
import useAmplitudeContext from '@/hooks/amplitude';
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

type IProps = {
  onEdit: (objective: CorporateObjective | null) => void;
  setViewObjective: (objective: CorporateObjective | null) => void;
  details: CorporateObjective | null;
  fetchDetails?: () => void;
  isEdit: boolean
  hideEditButton?: boolean
  marginLeft?: boolean
  open: boolean
  setOpen: (key: boolean) => void
};

export enum CORPORATE_OBJECTIVE_STATUSES {
  MISSING = "missing",
  COMPLETED = "completed",
  HIGH = "high", //review overdue
  MEDIUM = "medium", // review due
  LOW = "low", // current
}

export enum OBJECTIVE_STATUS_TITLES {
  CURRENT = "Current",
  COMPLETE = "Complete",
  METRICS_MISSING = 'Metrics Missing',
  REVIEW_DUE = 'Review Due',
  REVIEW_OVERDUE = 'Review Overdue',
}

const KEY_INDECAOTR_STATUSES = {
  NOT_STATRTED: { VALUE: 'not-started', LABEL: 'Not Started' },
  IN_PROGRESS: { VALUE: 'in-progress', LABEL: 'In Progress' },
  COMPLETED: { VALUE: 'completed', LABEL: 'Completed' },
  ABANDONED: { VALUE: 'abandoned', LABEL: 'Abandoned' },
}


export const getObjectiveStatus = (key: "label" | "color", status?: string,) => {
  let value = { "label": OBJECTIVE_STATUS_TITLES.CURRENT, "color": "green" }
  if (status === CORPORATE_OBJECTIVE_STATUSES.MISSING) {
    value = { "label": OBJECTIVE_STATUS_TITLES.METRICS_MISSING, "color": "red" }
  } else if (status === CORPORATE_OBJECTIVE_STATUSES.MEDIUM) {
    value = { "label": OBJECTIVE_STATUS_TITLES.REVIEW_DUE, "color": "yellow" }
  } else if (status === CORPORATE_OBJECTIVE_STATUSES.COMPLETED) {
    value = { "label": OBJECTIVE_STATUS_TITLES.COMPLETE, "color": "white" }
  } else if (status === CORPORATE_OBJECTIVE_STATUSES.HIGH) {
    value = { "label": OBJECTIVE_STATUS_TITLES.REVIEW_OVERDUE, "color": "red" }
  }
  return value[key]
}

export const getKeyIndecatorStatus = (key: "label" | "color", status?: string,) => {
  let value = { "label": KEY_INDECAOTR_STATUSES.COMPLETED.LABEL, "color": "green" }
  if (status === KEY_INDECAOTR_STATUSES.ABANDONED.VALUE) {
    value = { "label": KEY_INDECAOTR_STATUSES.ABANDONED.LABEL, "color": "red" }
  } else if (status === KEY_INDECAOTR_STATUSES.NOT_STATRTED.VALUE) {
    value = { "label": KEY_INDECAOTR_STATUSES.NOT_STATRTED.LABEL, "color": "yellow" }
  } else if (status === KEY_INDECAOTR_STATUSES.IN_PROGRESS.VALUE) {
    value = { "label": KEY_INDECAOTR_STATUSES.IN_PROGRESS.LABEL, "color": "yellow" }
  }
  return value[key]
}

const PreviewObjectiveDetails = forwardRef(
  ({ details, onEdit, fetchDetails, isEdit, setViewObjective, hideEditButton, marginLeft, open, setOpen }: IProps, ref) => {
    const deleteModelRef: any = useRef();
    const userAccess = useAccessLevel()
    const [initing, setIniting] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [data, setData] = useState<CorporateObjective | null>(null);

    const companyId = useSelectedAccountCompany()?.companyId;
    const { trackAmplitudeEvent } = useAmplitudeContext();
    const url = typeof window !== 'undefined' ? window.location.href : ""

    useEffect(() => {
      if (data) {
        trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED,
          {
            page_or_modal_name: 'objective_modal',
            page_url: url,
            user_id: userAccess?.userId,
            viewed_at: new Date().valueOf(),
            platform: PLATFORM.WEB,
            detail_name: data?.name || "NAME"
          });
      }
    }, [data]);

    const fetchData = useCallback(async () => {
      setIniting(true);

      try {
        if (!companyId || !details?.id) return;
        const result = await API.getCorporateObjective(companyId, details?.id);
        if (!result?.lastReview && result?.dateCreated) {
          result.nextReview = result.dateCreated;
        }
        setData(result);
      } catch (err: any) {
        Toast.error(err.message || 'Something went wrong.');
      } finally {
        setIniting(false);
      }
    }, [companyId, details]);

    useEffect(() => {
      if (companyId) {
        fetchData();
      }
    }, [fetchData, companyId, details]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      []
    );

    const handleCancel = () => {
      setOpen(false);
      if (!isEdit) {
        setViewObjective(null)
      }
    };

    const deleteObjective = async () => {
      try {
        setDeleting(true);
        if (!companyId || !details?.id) return;
        await API.deleteCorporateObjective(companyId, details?.id);
        Toast.success('Objective deleted successfully.');
      } catch (err: any) {
        Toast.error(err.message || 'Something went wrong.');
      } finally {
        setOpen(false);
        setDeleting(false);
        deleteModelRef?.current?.close();
        if (fetchDetails) {
          fetchDetails();
        }
      }
    };

    return (
      <Modal open={open} width={970} className={`${styles.modal} ${marginLeft ? styles.modalactive : ""}`} onCancel={handleCancel}>
        <Space size={10} />
        {initing ? (
          <Loading size='small' />
        ) : (
          <>
            <FlexBox justifyContent='space-between'>
              <Typography size='giant'>Objective Details</Typography>
              {(
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && (
                !hideEditButton && (
                  <FlexBox flexDirection='row'>
                    <Clickable
                      onClick={() => {
                        onEdit(data)
                        trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED,
                          {
                            button_name: 'edit_objective',
                            button_location: 'Corporate_objectives_page',
                            user_id: userAccess?.userId,
                            button_clicked_at: new Date().valueOf(),
                            platform: PLATFORM.WEB,
                          });
                      }}
                      className={styles.actions}
                    >
                      <Image
                        src='/icons/edit-icon.svg'
                        alt='edit icon'
                        width={24}
                        height={24}
                      />
                    </Clickable>
                    <Clickable onClick={() => deleteModelRef?.current?.open()}>
                      <Image
                        src='/icons/delete-icon.svg'
                        alt='delete icon'
                        width={24}
                        height={24}
                      />
                    </Clickable>
                  </FlexBox>
                )
              )}
            </FlexBox>
            <Space size={16} />
            <FlexBox flexDirection='column'>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <FlexBox flexDirection='column'>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Typography gray size="large">
                          Name
                        </Typography>
                        <Typography size="big">{data?.name === "Other" ? "Own Objective" : data?.name}</Typography>
                      </Col>
                      <Col span={12}>
                        <Typography gray size="large">
                          Description
                        </Typography>
                        <Typography size="big">{data?.description}</Typography>
                      </Col>
                    </Row>

                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Typography gray size='large'>
                          Next Review Date
                        </Typography>
                        <Typography size='big'>
                          {data?.nextReview
                            ? dayjs(data?.nextReview).format('DD/MM/YYYY')
                            : '-'}
                        </Typography>
                      </Col>
                      <Col span={12}>
                        <Typography gray size='large'>
                          Last Review
                        </Typography>
                        <Typography size='big'>
                          {data?.lastReview && data?.lastReview !== 'EMPTY' ?
                            dayjs(data?.lastReview).format('DD/MM/YYYY') :
                            '-'}
                        </Typography>
                      </Col>
                    </Row>

                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Typography gray size='large'>
                          Review Frequency
                        </Typography>
                        <Typography size='big'>
                          {reviewFrequencyOptions?.find((item) => +item.value === data?.reviewFrequency)?.label}
                        </Typography>
                      </Col>
                      <Col span={12}>
                        <Typography gray size='large'>
                          Status
                        </Typography>
                        <Space size={8} />
                        <Status
                          className={styles.status}
                          title={getObjectiveStatus('label', data?.status,)}
                          color={getObjectiveStatus('color', data?.status)}
                        />
                      </Col>
                    </Row>
                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      {data?.other && (
                        <Col span={12}>
                          <Typography gray size='large'>
                            Other
                          </Typography>
                          <Typography size='big'>{data?.other}</Typography>
                        </Col>
                      )}
                      <Col></Col>
                    </Row>
                    <Space size={15} />
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
            {data?.keyIndicators?.length ? (
              <>
                <Divider />
                <Typography size='giant'>Key Indicators</Typography>
                {data?.keyIndicators?.map((indicator, index) => {
                  return (
                    <>
                      {index !== 0 && <Divider />}
                      <FlexBox flexDirection='column'>
                        <Row gutter={[30, 0]}>
                          <Col span={24}>
                            <FlexBox flexDirection='column'>
                              <Row gutter={[30, 0]}>
                                <Col span={12}>
                                  <Space size={16} />
                                  <Typography gray>Indicator Name</Typography>
                                  <Typography size='large'>
                                    {indicator?.name}
                                  </Typography>
                                </Col>
                                <Col span={12}>
                                  <Space size={16} />
                                  <Typography gray>Frequency</Typography>
                                  <Typography size="large">
                                    {frequencyOptions?.find(
                                      (option: { value: number | string }) =>
                                        option.value == indicator?.frequency
                                    )?.label || "-"}
                                  </Typography>
                                </Col>
                              </Row>
                              <Space size={16} />
                              <Row gutter={[30, 0]}>
                                <Col span={12}>
                                  <Space size={16} />
                                  <Typography gray>Description</Typography>
                                  <Typography size='large'>
                                    {indicator?.description}
                                  </Typography>
                                </Col>
                                <Col span={12}>
                                  <Typography gray>Owner</Typography>
                                  <Typography size="large">
                                    {indicator?.owner?.firstName +
                                      " " +
                                      indicator?.owner?.lastName}
                                  </Typography>
                                </Col>
                              </Row>

                              <Space size={16} />
                              <Row gutter={[30, 0]}>
                                <Col span={12}>
                                  <Typography gray>Type</Typography>
                                  <Typography size="large">
                                    {indicator?.type &&
                                      indicatorOptions.find(
                                        (option: { value: number | string }) =>
                                          option.value === indicator?.type
                                      )?.label}
                                  </Typography>
                                </Col>
                                <Col span={12}>
                                  <Typography gray>Value</Typography>
                                  <Typography size="large">
                                    {indicator?.value || "-"}
                                  </Typography>
                                </Col>
                              </Row>
                              <Row gutter={[30, 0]}>
                                <Col span={12}>
                                  <Typography gray size='large'>
                                    Status
                                  </Typography>
                                  <Space size={8} />
                                  <Status
                                    className={styles.status}
                                    title={getKeyIndecatorStatus('label', indicator?.status,)}
                                    color={getKeyIndecatorStatus('color', indicator?.status)}
                                  />
                                </Col>
                              </Row>
                              <Space size={15} />
                              <Row gutter={[30, 0]}></Row>
                              <Space size={15} />
                            </FlexBox>
                          </Col>
                        </Row>
                      </FlexBox>
                    </>
                  );
                })}
              </>
            ) : null}
          </>
        )}

        <ConfirmDelete
          ref={deleteModelRef}
          handleConfirm={deleteObjective}
          loading={deleting}
        />
      </Modal>
    );
  }
);

PreviewObjectiveDetails.displayName = "PreviewObjectiveDetails";

export default PreviewObjectiveDetails;
