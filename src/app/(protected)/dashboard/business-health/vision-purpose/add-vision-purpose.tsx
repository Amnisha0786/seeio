import React, { useEffect } from 'react'
import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import * as yup from 'yup'

import styles from './page.module.scss'
import Space from '@/components/space'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import AddButton from '@/components/add-button'
import Button from '@/components/button'
import TourComponent from '@/components/TourComponent'
import { useAccessLevel } from '@/hooks'
import Field from '@/components/field'
import { COMPANY_USER_ACCESS_LEVEL } from '@/models'

type Value = {
  value: string
  description: string
}

export type VisionPurpose = {
  vision: string
  reviewDate: string
  mission: string
  corporateValues?: Value[]
  internalValues?: Value[]
}


interface IProps {
  onSuccess: (values: VisionPurpose) => void;
  setShowVisionPurposeDetails: (values: boolean) => void;
  purposeDetails: VisionPurpose;
  loading: boolean
  config?: boolean
}

const validationSchema = yup.object().shape({
  vision: yup.string().required('Vision is required'),
  mission: yup.string().required('Mission is required'),
  corporateValues: yup.array().of(
    yup.object().shape({
      value: yup.string().required('Value is required'),
      description: yup.string().required('Description is required'),
    })
  ),
  internalValues: yup.array().of(
    yup.object().shape({
      value: yup.string().required('Value is required'),
      description: yup.string().required('Description is required'),
    })
  ),
})

const { TextArea } = Input;

const AddVisionPurpose = ({ onSuccess, purposeDetails, loading, setShowVisionPurposeDetails, config }: IProps) => {
  const userAccess = useAccessLevel()

  const formik = useFormik<VisionPurpose>({
    validateOnChange: true,
    validateOnMount: false,
    initialValues: {
      vision: '',
      reviewDate: dayjs().toISOString(),
      mission: '',
      corporateValues: [
        {
          value: '',
          description: ''
        }
      ],
      internalValues: [
        {
          value: '',
          description: ''
        }
      ],
    },
    validationSchema,
    onSubmit: async (values: VisionPurpose): Promise<void> => {
      onSuccess(values)
    },
  })

  useEffect(() => {
    if (Object.keys(purposeDetails)?.length)
      formik.resetForm({ values: purposeDetails })
  }, [purposeDetails])

  return (
    <>
      <FlexBox className={styles.card} flexDirection='column' id="create_purpose">
        <Typography size='huge'>Corporate Purpose</Typography>
        <Space size={15} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <FlexBox flexDirection='column'>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Field
                    label='Vision'
                    errorMessage={
                      formik.errors?.vision
                        ? formik?.errors?.vision
                        : ''
                    }
                  >
                    <Input
                      name='vision'
                      size='large'
                      placeholder='Enter here'
                      onChange={formik.handleChange}
                      value={formik.values.vision}
                      className={styles.textarea}
                      status={formik.errors.vision && 'error'}
                    />
                  </Field>
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={8}>
                  <FlexBox flexDirection='column'>
                    <Field
                      label='Review Date'
                      errorMessage={
                        formik.errors?.reviewDate
                          ? formik?.errors?.reviewDate
                          : ''
                      }
                    >
                      <DatePicker
                        name='reviewDate'
                        size='middle'
                        placeholder='__/__/____'
                        format='DD/MM/YYYY'
                        onChange={(value) => {
                          formik.setFieldValue('reviewDate', value?.toISOString())
                        }}
                        value={dayjs(formik.values.reviewDate)}
                        status={formik.errors.reviewDate && 'error'}
                      />
                    </Field>
                  </FlexBox>
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Field
                    label='Mission'
                    errorMessage={
                      formik.errors?.mission
                        ? formik?.errors?.mission
                        : ''
                    }
                  >
                    <TextArea
                      rows={3}
                      name='mission'
                      size='middle'
                      placeholder='Enter here'
                      onChange={formik.handleChange}
                      value={formik.values.mission}
                      className={styles.textarea}
                      status={formik.errors.mission && 'error'}
                    />
                  </Field>
                </Col>
              </Row>
            </FlexBox>
          </Col>
        </Row>
      </FlexBox>
      <Space size={24} />
      {formik.values.corporateValues?.map((corporateValue, index) => {
        return (
          <>
            <FlexBox
              className={styles.card}
              flexDirection='column'
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Typography size='huge'>Corporate Value №{index + 1}</Typography>
              <Space size={15} />
              <Row className={styles.fullWidth}>
                <Col span={24}>
                  <FlexBox flexDirection='column'>
                    <Row gutter={[30, 0]}>
                      <Col span={8}>
                        <Space size={8} />
                        <Field
                          label='Value'
                          errorMessage={
                            Array.isArray(formik.errors?.corporateValues)
                              ? formik?.errors?.corporateValues?.[index]?.value 
                              : ''
                          }
                        >  
                          <Input
                            size='large'
                            placeholder='Enter here'
                            name={`corporateValues[${index}].value`}
                            onChange={formik.handleChange}
                            value={corporateValue.value}
                            status={
                              Array.isArray(formik.errors?.corporateValues) &&
                            formik?.errors?.corporateValues?.[index]?.value &&
                            'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>
                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Field
                          label='Value Description'
                          errorMessage={
                            Array.isArray(formik.errors?.corporateValues)
                              ? formik?.errors?.corporateValues?.[index]?.description
                              : ''
                          }
                        >
                          <Input
                            size='middle'
                            placeholder='Enter here'
                            name={`corporateValues[${index}].description`}
                            onChange={formik.handleChange}
                            value={corporateValue.description}
                            status={
                              Array.isArray(formik.errors?.corporateValues) &&
                            formik?.errors?.corporateValues?.[index]?.description &&
                            'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
            <Space size={24} />
          </>
        )
      })}

      <FlexBox
        className={styles.card}
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        id="create_value"
      >
        <Typography size='huge'>
          Corporate Value №{formik.values.corporateValues?.length ? formik.values.corporateValues?.length : 0 + 1}
        </Typography>
        <AddButton
          onClick={() =>
            formik.setFieldValue('corporateValues', [
              ...(formik.values?.corporateValues || []),
              {
                value: '',
                description: '',
              },
            ])
          }
        />
      </FlexBox>
      <Space size={24} />
      {formik.values.internalValues?.map((internalValue, index) => {
        return (
          <>
            <FlexBox
              className={styles.card}
              flexDirection='column'
              justifyContent='space-between'
              alignItems='flex-start'
            >
              <Typography size='huge'>Internal Value №{index + 1}</Typography>
              <Space size={24} />
              <Row gutter={[30, 0]} className={styles.fullWidth}>
                <Col span={24}>
                  <FlexBox flexDirection='column'>
                    <Row gutter={[30, 0]}>
                      <Col span={8}>
                        <Field
                          label='Value'
                          errorMessage={
                            Array.isArray(formik.errors?.internalValues)
                              ? formik?.errors?.internalValues?.[index]?.value
                              : ''
                          }
                        >
                          <Input
                            size='large'
                            placeholder='Enter here'
                            name={`internalValues[${index}].value`}
                            onChange={formik.handleChange}
                            value={internalValue.value}
                            status={
                              Array.isArray(formik.errors?.internalValues) &&
                            formik?.errors?.internalValues?.[index]?.value &&
                            'error'
                            }
                          />
                        </Field>
                      </Col>
                    </Row>
                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Field
                          label='Value Description'
                          errorMessage={
                            Array.isArray(formik.errors?.internalValues)
                              ? formik?.errors?.internalValues?.[index]?.description
                              : ''
                          }
                        >
                          <Input
                            name={`internalValues[${index}].description`}
                            size='middle'
                            placeholder='Enter here'
                            onChange={formik.handleChange}
                            value={internalValue.description}
                            status={
                              Array.isArray(formik.errors?.internalValues) &&
                            formik?.errors?.internalValues?.[index]?.description &&
                            'error'
                            }
                          />
                        </Field>

                      </Col>
                    </Row>
                  </FlexBox>
                </Col>
              </Row>
            </FlexBox>
            <Space size={24} />
          </>
        )
      })}

      <Space size={24} />
      <FlexBox
        className={styles.card}
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        id="create_internal_value"
      >
        <Typography size='huge'>
          Internal Value №{formik.values.internalValues?.length ?  formik.values.internalValues?.length : 0 + 1}
        </Typography>
        <AddButton
          onClick={() =>
            formik.setFieldValue('internalValues', [
              ...formik.values.internalValues || [],
              {
                value: '',
                description: '',
              },
            ])
          }
        />
      </FlexBox>

      <Space size={15} />

      {(
        userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
        userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && (
        <FlexBox
          flexDirection='row'
          justifyContent='flex-end'
          alignItems='flex-end'
        >
          <Button
            type='default'
            onClick={() => setShowVisionPurposeDetails(true)}
            className={styles.cancelButton}
          >
              Cancel
          </Button>
          <Button
            type='primary'
            loading={loading}
            onClick={() => formik.handleSubmit()}
            className={styles.saveButton}
          >
              Save
          </Button>
        </FlexBox>
      )}
      <TourComponent start={!loading && config} />
    </>
  )
}

export default AddVisionPurpose
