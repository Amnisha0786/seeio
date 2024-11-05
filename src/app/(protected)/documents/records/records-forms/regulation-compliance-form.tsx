import React, { forwardRef, useCallback, useEffect } from 'react';
import { Checkbox, Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Space from '@/components/space';
import Field from '@/components/field';
import styles from './page.module.scss';
import { REVIEW_FREQUENCY_OPTIONS } from './shared-documents-forms';
import DepartmentSelect from '@/shared/department-select'

const RegulationComplianceForm = forwardRef(
  (
    {
      formik,
    }: { formik: any; },
    ref
  ) => {
    const { reviewFrequency, lastReview, needReview, expiryDate } =
      formik.values?.metadata;

    const updateReviewDate = useCallback(() => {
      let reviewDate = undefined;
      if (!expiryDate) {
        if (needReview) {
          if (lastReview) {
            if (reviewFrequency === 'Monthly') {
              reviewDate = dayjs(lastReview).add(1, 'month');
            } else if (reviewFrequency === 'Bi-Monthly') {
              reviewDate = dayjs(lastReview).add(2, 'month');
            } else if (reviewFrequency === 'Quarterly') {
              reviewDate = dayjs(lastReview).add(3, 'month');
            } else if (reviewFrequency === 'Six-Monthly') {
              reviewDate = dayjs(lastReview).add(6, 'month');
            } else if (reviewFrequency === 'Yearly') {
              reviewDate = dayjs(lastReview).add(1, 'year');
            } else {
              reviewDate = dayjs();
            }
          } else {
            reviewDate = dayjs();
          }
        }
      } else {
        reviewDate = dayjs(expiryDate).subtract(30, 'day');
      }
      formik.setFieldValue('metadata.reviewDate', reviewDate?.toISOString());
    }, [reviewFrequency, lastReview, needReview, expiryDate]);

    useEffect(() => {
      updateReviewDate();
    }, [updateReviewDate]);

    const updateNeedReview = useCallback(() => {
      if (!needReview) {
        formik.setFieldValue('metadata.reviewFrequency', undefined);
        formik.setFieldValue('metadata.lastReview', undefined);
      }
    }, [needReview]);

    useEffect(() => {
      updateNeedReview();
    }, [updateNeedReview]);

    return (
      <div className={styles.addFolderModal}>
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='2nd Reference Number Label'
              errorMessage={formik?.errors?.metadata?.secondReferenceNumberLabel}
            >
              <Input
                name='metadata.secondReferenceNumberLabel'
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={formik.values.metadata?.secondReferenceNumberLabel}
                status={
                  formik?.errors?.metadata?.secondReferenceNumberLabel && 'error'
                }
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='2nd Reference Number'
              errorMessage={formik?.errors?.metadata?.secondReferenceNumber}
            >
              <Input
                name='metadata.secondReferenceNumber'
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={formik.values.metadata?.secondReferenceNumber}
                status={
                  formik?.errors?.metadata?.secondReferenceNumber && 'error'
                }
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Owner/Department' errorMessage={formik?.errors?.metadata?.owner}>
              <DepartmentSelect
                addNewOption="Department"
                size='large'
                allowClear
                placeholder='Select'
                onChange={(value) => formik.setFieldValue('metadata.owner', value)}
                value={formik.values.metadata.owner}
                status={formik?.errors?.metadata?.owner && 'error'}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Document Date'
              errorMessage={formik?.errors?.metadata?.documentDate}
            >
              <DatePicker
                name='metadata.documentDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) =>
                  formik.setFieldValue(
                    'metadata.documentDate',
                    value?.toISOString()
                  )
                }
                value={
                  formik.values.metadata?.documentDate &&
                  dayjs(formik.values.metadata?.documentDate)
                }
                status={formik?.errors?.metadata?.documentDate && 'error'}
              />
            </Field>
          </FlexBox>
        </FlexBox>

        <Space size={24} />
        <FlexBox>
          {/* <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Commencement Date'
              errorMessage={formik?.errors?.metadata?.commencementDate}
            >
              <DatePicker
                name='metadata.commencementDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) =>
                  formik.setFieldValue(
                    'metadata.commencementDate',
                    value?.toISOString()
                  )
                }
                value={
                  formik.values.metadata?.commencementDate &&
                  dayjs(formik.values.metadata?.commencementDate)
                }
                status={formik?.errors?.metadata?.commencementDate && 'error'}
              />
            </Field>
          </FlexBox> */}

          {/* <Space horizontal size={24} /> */}
          <FlexBox flexDirection='column' flex={1}>
            <Field
              label='Expiry/ renewal date'
              errorMessage={formik?.errors?.metadata?.expiryDate}
            >
              <DatePicker
                name='metadata.expiryDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                onChange={(value) =>
                  formik.setFieldValue(
                    'metadata.expiryDate',
                    value?.toISOString()
                  )
                }
                value={
                  formik.values.metadata?.expiryDate &&
                  dayjs(formik.values.metadata?.expiryDate)
                }
                status={formik?.errors?.metadata?.expiryDate && 'error'}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection='column' flex={1}>
            <Field label='Review Date'>
              <DatePicker
                disabled={
                  !expiryDate && reviewFrequency === 'Other' ? false : true
                }
                name='metadata.reviewDate'
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                value={
                  formik.values.metadata?.reviewDate &&
                  dayjs(formik.values.metadata?.reviewDate)
                }
              />
            </Field>
          </FlexBox>
        </FlexBox>


        <Space size={24} />
        <FlexBox>
          <FlexBox flex={1}>
            <Space size={24} />
            <FlexBox flexDirection='column'>
              <Typography>No longer required</Typography>
              <Space size={24} />
              <Checkbox
                name='metadata.noLongerRequired'
                onChange={formik.handleChange}
                checked={formik.values.metadata?.noLongerRequired}
              >
                Yes
              </Checkbox>
            </FlexBox>
            <Space horizontal size={70} />
            <FlexBox flexDirection='column'>
              <Typography>Needs Review</Typography>
              <Space size={24} />
              <Checkbox
                name='metadata.needReview'
                onChange={formik.handleChange}
                checked={formik.values.metadata?.needReview}
              >
                Yes
              </Checkbox>
            </FlexBox>
          </FlexBox>

        </FlexBox>

        {needReview && (
          <>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection='column' flex={1}>
                <Field label='Last Review Date'>
                  <DatePicker
                    name='metadata.lastReview'
                    size='large'
                    placeholder='__/__/____'
                    format='DD/MM/YYYY'
                    onChange={(value) =>
                      formik.setFieldValue(
                        'metadata.lastReview',
                        value?.toISOString()
                      )
                    }
                    value={
                      formik.values.metadata?.lastReview &&
                      dayjs(formik.values.metadata?.lastReview)
                    }
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection='column' flex={1}>
                <Field
                  label='Review Frequency'
                  errorMessage={formik.errors.metadata?.reviewFrequency}
                >
                  <Select
                    size='large'
                    placeholder='Select'
                    options={REVIEW_FREQUENCY_OPTIONS}
                    onChange={(value) =>
                      formik.setFieldValue('metadata.reviewFrequency', value)
                    }
                    value={formik.values.metadata?.reviewFrequency}
                    status={formik.errors.metadata?.reviewFrequency && 'error'}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
          </>
        )}
      </div>
    );
  }
);

RegulationComplianceForm.displayName = 'RegulationComplianceForm';

export default RegulationComplianceForm;
