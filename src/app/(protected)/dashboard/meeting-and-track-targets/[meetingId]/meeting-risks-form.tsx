import React, { forwardRef } from 'react'
import { Col, DatePicker, Input, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'

import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import { RISK_TYPES } from '../../business-health/strategic-risks/strategic-risks-form'
import Field from '@/components/field'

export function getFullLabel(valueToMatch: string): string | undefined {
  const matchedRiskType = RISK_TYPES.find((item) => item.value === valueToMatch);
  return matchedRiskType ? matchedRiskType.label : valueToMatch;
}

const MeetingRiskForm = forwardRef(
  ({ formik, index }: { formik: any; index: number }, ref) => {
    return (
      <>
        <Space size={24} />

        <React.Fragment>
          <FlexBox flexDirection='column'>
            <Space size={15} />
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <Field label='Name'>
                  <Input
                    name={`risks[${index}].name`}
                    size='large'
                    placeholder='Enter name'
                    onChange={formik.handleChange}
                    value={formik?.values?.risks?.[index]?.name}
                  />
                </Field>
              </Col>
            </Row>
            <Space size={15} />
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <FlexBox flexDirection='column'>
                  <Row gutter={[30, 0]}>
                    <Col span={12}>
                      <Field label='Risk Type'>
                        <Select
                          size='large'
                          placeholder='Select'
                          options={RISK_TYPES}
                          onChange={(value) =>
                            formik.setFieldValue(
                              `risks[${index}].riskType`,
                              value
                            )
                          }
                          value={formik?.values?.risks?.[index]?.riskType}
                        />
                      </Field>
                    </Col>
                    <Col span={12}>
                      <FlexBox flexDirection='column'>
                        <Field label='Next Review'>
                          <DatePicker
                            name={`risks[${index}].nextReview`}
                            size='large'
                            placeholder='__/__/____'
                            format='DD/MM/YYYY'
                            onChange={(value) => {
                              formik.setFieldValue(
                                `risks[${index}].nextReview`,
                                value?.toISOString()
                              )
                            }}
                            value={
                              formik?.values?.risks?.[index]?.nextReview &&
                              dayjs(formik?.values?.risks?.[index]?.nextReview)
                            }
                          />
                        </Field>
                      </FlexBox>
                    </Col>
                  </Row>

                  <Space size={15} />

                  <Row gutter={[30, 0]}>
                    <Col span={24}>
                      <Field label='Description'>
                        <TextArea
                          rows={4}
                          name={`risks[${index}].description`}
                          size='large'
                          placeholder='Enter here'
                          onChange={formik.handleChange}
                          value={formik?.values?.risks?.[index]?.description}
                        />
                      </Field>
                      <Space size={5} />
                    </Col>
                  </Row>

                  <Space size={15} />
                </FlexBox>
              </Col>
            </Row>
          </FlexBox>
        </React.Fragment>
      </>
    )
  }
)

MeetingRiskForm.displayName = 'MeetingRiskForm'

export default MeetingRiskForm
