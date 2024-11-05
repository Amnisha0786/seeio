import { Fragment, forwardRef, useCallback, useEffect } from 'react'
import { Select, DatePicker, Input, Tooltip, Checkbox } from 'antd'
import { InfoCircleOutlined } from "@ant-design/icons"
import dayjs, { Dayjs } from 'dayjs'

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Field from '@/components/field'
import { RESOLUTION_STATUS } from '../registers-validation-schemas'
import AddButton from '@/components/add-button'
import Clickable from '@/components/clickable'
import Image from 'next/image'
import Typography from '@/components/typography'
import styles from "./page.module.scss"
import { addLeadingZeros } from '@/utils/leading-zeros'

const COMPANY_HOUSE_OPTIONS = [
  {
    label: 'Not required',
    value: 'Not required',
  },
  {
    label: 'Filed',
    value: 'Filed',
  },
  {
    label: 'Pending',
    value: 'Pending',
  },
]

const RESOLUTION_TYPE = [
  { label: 'Ordinary', value: 'Ordinary ' },
  { label: 'Special', value: 'Special' },
  {
    label: 'Ordinary and special',
    value: 'Ordinary and special',
  },
]

const ResolutionsDocumentForm = forwardRef(
  ({ formik, highestResolutionNumber, isEdit = false }: { formik: any, highestResolutionNumber?: number, isEdit?: boolean }, ref) => {
    const {
      name,
      status,
      typeOfResolution,
      boardApprovalDate,
      companiesActReference,
      circulated,
      circulationDate,
      approved,
      approvalDeadline,
      cancelled,
      resolutionNumber,
      companiesHouse,
      dateApproved,
      additionalResolutionNumbers,
      dateFiled
    } = formik.values?.metadata


    const updateStatus = useCallback(() => {
      let status = undefined, color;
      const today = dayjs().startOf('day');
      const approvalDeadlineDate = dayjs(approvalDeadline).startOf('day');
      if (cancelled) {
        status = RESOLUTION_STATUS.CANCELLED
        color = "white"
      } else if (!boardApprovalDate) {
        status = RESOLUTION_STATUS.PENDING_BOARD_APPROVAL
        color = "yellow"
      } else if (!circulated) {
        status = RESOLUTION_STATUS.APPROVED_FOR_CIRCULATION
        color = "yellow"
      } else if (!approved) {
        if (
          approvalDeadline &&
          today.isAfter(dayjs(approvalDeadlineDate))
        ) {
          status = RESOLUTION_STATUS.DEFUNCT
          color = "white"
        } else {
          status = RESOLUTION_STATUS.CIRCULATED
          color = "yellow"
        }
      } else if (companiesHouse == 'Pending') {
        if (dateApproved && dayjs(dateApproved).isBefore(dayjs().subtract(14, 'days'), 'day')) {
          status = RESOLUTION_STATUS.OVERDUE
          color = "red"
        } else {
          status = RESOLUTION_STATUS.PENDING
          color = "yellow"
        }
      } else {
        status = RESOLUTION_STATUS.PASSED
        color = "green"
      }

      formik.setFieldValue('metadata.status', status)
      formik.setFieldValue('metadata.statusColor', color)
    }, [cancelled, circulated, approvalDeadline, approved, companiesHouse, dateApproved, boardApprovalDate])

    useEffect(() => {
      updateStatus()
    }, [updateStatus])

    const updateCirculatedFields = useCallback(() => {
      if (!circulated) {
        formik.setFieldValue('metadata.circulationDate', undefined);
        formik.setFieldValue('metadata.approved', undefined);
        formik.setFieldValue('metadata.approvalDeadline', undefined);
      }
    }, [circulated]);

    useEffect(() => {
      updateCirculatedFields();
    }, [updateCirculatedFields]);

    const updateApprovedFields = useCallback(() => {
      if (!approved) {
        formik.setFieldValue('metadata.dateApproved', undefined);
      }
    }, [approved]);

    useEffect(() => {
      updateApprovedFields();
    }, [updateApprovedFields]);

    const updateCompaniesHouseFields = useCallback(() => {
      if (companiesHouse != 'Filed') {
        formik.setFieldValue('metadata.dateFiled', undefined);
      }
    }, [companiesHouse]);

    useEffect(() => {
      updateCompaniesHouseFields();
    }, [updateCompaniesHouseFields]);

    const updateApprovalDeadline = useCallback(() => {
      let deadlineDate = undefined
      if (circulationDate) {
        deadlineDate = dayjs(circulationDate).add(28, 'day')
      }
      formik.setFieldValue('metadata.approvalDeadline', deadlineDate?.toISOString());
    }, [circulationDate]);

    useEffect(() => {
      if (circulationDate) {
        updateApprovalDeadline();
      }
    }, [updateApprovalDeadline]);

    const onClickDelete = (index: number) => {
      if (formik.values?.metadata?.additionalResolutionNumbers) {
        const additionalResolutionNumbers = [...formik.values?.metadata?.additionalResolutionNumbers];
        additionalResolutionNumbers.pop();
        formik.setFieldValue('metadata.additionalResolutionNumbers', additionalResolutionNumbers);
      }
    };

    function disabledDate(current: Dayjs) {
      return current && current.isAfter(dayjs().endOf('day'));
    }

    const resolutionNumberCalculation = useCallback(() => {
      let resolutionNo = `${(Number(resolutionNumber || 0) + 1)}`;
      if (additionalResolutionNumbers) {
        additionalResolutionNumbers?.map((res: any) => {
          if (res) {
            resolutionNo = `${(Number(res) + 1)}`
          }
        })
      }

      formik.setFieldValue("metadata.additionalResolutionNumbers", [
        ...(additionalResolutionNumbers || []),
        addLeadingZeros(resolutionNo)
        ,
      ])
    }, [additionalResolutionNumbers, resolutionNumber])


    useEffect(() => {
      let number;
      if (highestResolutionNumber) {
        number = `${highestResolutionNumber + 1}`
        formik.setFieldValue('metadata.resolutionNumber', addLeadingZeros(number));
      }
    }, [highestResolutionNumber, resolutionNumber])


    useEffect(() => {
      if (!boardApprovalDate) {
        formik.setFieldValue('metadata.circulated', false);
      }
    }, [boardApprovalDate])

    return (
      <div>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Name'
              errorMessage={formik.errors.metadata?.name}
            >
              <Input
                name='metadata.name'
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={name}
                status={formik.errors.metadata?.name && 'error'}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            {approved && (
              <Field label='Passed date' errorMessage={formik.errors.metadata?.dateApproved}>
                <DatePicker
                  name='metadata.dateApproved'
                  size='large'
                  placeholder='__/__/____'
                  format='DD/MM/YYYY'
                  onChange={(value: Dayjs | null) =>
                    formik.setFieldValue(
                      'metadata.dateApproved',
                      value?.toISOString()
                    )
                  }
                  value={dateApproved && dayjs(dateApproved)}
                  status={formik.errors.metadata?.dateApproved && 'error'}
                />
              </Field>
            )}
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox alignItems='flex-end' justifyContent='space-between'>
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Resolution Number'
              errorMessage={formik.errors.metadata?.resolutionNumber}
              sideContent={<><Space horizontal size={5} />
                <Tooltip placement='top' title={"If this record contains multiple resolutions, click + to add additional resolution numbers."}
                  color='#ECEFF2' overlayInnerStyle={{ color: "#005F73" }}
                  className={styles.cursor}>
                  <InfoCircleOutlined className={styles.size} />
                </Tooltip>
              </>}
            >
              <Input
                name={`metadata.resolutionNumber`}
                disabled
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={resolutionNumber || "001"}
                status={formik.errors.metadata?.resolutionNumber && 'error'}
              />
            </Field>

          </FlexBox>

          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            {!isEdit && <AddButton
              onClick={() => {
                resolutionNumberCalculation()
              }
              }
            />}


          </FlexBox>
        </FlexBox>
        <Space size={24} />

        {formik.values?.metadata?.additionalResolutionNumbers?.map((number: any, index: number) => {
          return (
            <Fragment key={index}>
              <FlexBox alignItems='flex-end' justifyContent='space-between'>
                <FlexBox flexDirection='column' flex={1}>
                  <Field
                    label='Resolution Number'>
                    <Input
                      name={`metadata.additionalResolutionNumbers${index}`}
                      disabled
                      size='large'
                      placeholder='Enter here'
                      onChange={formik.handleChange}
                      value={number}
                    />
                  </Field>
                </FlexBox>

                <Space horizontal size={24} />
                <FlexBox flexDirection='column' flex={1}>
                  {!isEdit && <Clickable onClick={() => onClickDelete(index)}>
                    <Image
                      src='/icons/delete-icon.svg'
                      alt='delete icon'
                      width={24}
                      height={24}
                    />
                  </Clickable>}

                </FlexBox>
              </FlexBox>
              <Space size={24} />
            </Fragment>
          )
        })}

        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Board approval date'
              errorMessage={formik.errors?.metadata?.boardApprovalDate}
            >
              <DatePicker
                disabledDate={disabledDate}
                name='metadata.boardApprovalDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value: Dayjs | null) =>
                  formik.setFieldValue(
                    'metadata.boardApprovalDate',
                    value?.toISOString()
                  )
                }
                value={boardApprovalDate && dayjs(boardApprovalDate)}
                status={formik.errors?.metadata?.boardApprovalDate && "error"}

              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>

            {circulated && (<Field label='Circulation date'>
              <DatePicker
                name='metadata.circulationDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value: Dayjs | null) =>
                  formik.setFieldValue(
                    'metadata.circulationDate',
                    value?.toISOString()
                  )
                }
                value={circulationDate && dayjs(circulationDate)}
                status={formik.errors.metadata?.circulationDate && 'error'}
              />
            </Field>)}
          </FlexBox>
        </FlexBox>

        <Space size={24} />

        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Companies Act Reference'
              errorMessage={formik.errors?.metadata?.companiesActReference}
            >
              <Input
                name='metadata.companiesActReference'
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={companiesActReference}
                status={formik.errors?.metadata?.companiesActReference && "error"}

              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Type of Resolution'
              errorMessage={formik.errors?.metadata?.typeOfResolution}
            >
              <Select
                size='large'
                placeholder='Select'
                options={RESOLUTION_TYPE}
                onChange={(value) =>
                  formik.setFieldValue('metadata.typeOfResolution', value)
                }
                value={typeOfResolution}
                status={formik.errors?.metadata?.typeOfResolution && "error"}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <FlexBox flexDirection="column">
              <Typography size="small">Cancelled</Typography>
              <Space size={16} />
              <Checkbox
                name="metadata.cancelled"
                onChange={formik.handleChange}
                checked={cancelled}
              >
                Yes
              </Checkbox>
            </FlexBox>
            {boardApprovalDate && <><Space horizontal size={70} />
              <FlexBox flexDirection="column">
                <Typography size="small">Circulated</Typography>
                <Space size={16} />
                <Checkbox
                  name="metadata.circulated"
                  onChange={formik.handleChange}
                  checked={circulated}
                >
                  Yes
                </Checkbox>
              </FlexBox></>}
            {circulated && (<> <Space horizontal size={70} />
              <FlexBox flexDirection="column">
                <Typography size="small">Passed</Typography>
                <Space size={16} />
                <Checkbox
                  name="metadata.approved"
                  onChange={formik.handleChange}
                  checked={approved}
                >
                  Yes
                </Checkbox>
              </FlexBox></>)}

          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field
              label='Status'
            >
              <Input
                name='metadata.status'
                size='large'
                disabled
                onChange={formik.handleChange}
                value={status}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Company House Status' errorMessage={formik.errors.metadata?.companiesHouse}>
              <Select
                size='large'
                placeholder='Select'
                options={COMPANY_HOUSE_OPTIONS}
                onChange={(value) =>
                  formik.setFieldValue('metadata.companiesHouse', value)
                }
                value={companiesHouse}
                status={
                  formik.errors.metadata?.companiesHouse && 'error'
                }
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />

          <FlexBox flexDirection='column' flex={1}>
            {companiesHouse == 'Filed' && (
              <Field label='Company House Filing Date' errorMessage={formik.errors.metadata?.dateFiled}>
                <DatePicker
                  name='metadata.dateFiled'
                  size='large'
                  placeholder='__/__/____'
                  format='DD/MM/YYYY'
                  onChange={(value: Dayjs | null) =>
                    formik.setFieldValue(
                      'metadata.dateFiled',
                      value?.toISOString()
                    )
                  }
                  value={dateFiled && dayjs(dateFiled)}
                  status={
                    formik.errors.metadata?.dateFiled && 'error'
                  }
                />
              </Field>
            )}
          </FlexBox>
        </FlexBox>

        {circulated && (
          <>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field
                  label='Approval Deadline'
                  errorMessage={formik.errors.metadata?.approvalDeadline}
                >
                  <DatePicker
                    name='metadata.approvalDeadline'
                    size='large'
                    placeholder='__/__/____'
                    format='DD/MM/YYYY'
                    onChange={(value: Dayjs | null) =>
                      formik.setFieldValue(
                        'metadata.approvalDeadline',
                        value?.toISOString()
                      )
                    }
                    value={approvalDeadline && dayjs(approvalDeadline)}
                    status={
                      formik.errors.metadata?.approvalDeadline && 'error'
                    }
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection='column' flex={1}>
                <div></div>
              </FlexBox>
            </FlexBox>
          </>
        )}
      </div>
    )
  }
)

ResolutionsDocumentForm.displayName = 'ResolutionsDocumentForm'

export default ResolutionsDocumentForm;
