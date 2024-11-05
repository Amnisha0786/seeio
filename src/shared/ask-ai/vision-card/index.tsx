import React, { useState } from 'react'
import { Button, Col, DatePicker, Input, Row } from 'antd'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import camelcaseKeys from "camelcase-keys"
import TextArea from 'antd/es/input/TextArea'

import * as API from "@/api";
import FlexBox from '@/components/flex-box'
import Typography from '@/components/typography'
import styles from './vision-card.module.scss'
import { VisionPurpose } from '@/app/(protected)/dashboard/business-health/vision-purpose/add-vision-purpose'
import Space from '@/components/space'
import { useSelectedAccountCompany } from '@/hooks'
import Toast from '@/components/toast'

const VisionCard = ({
  vision,
}: {
  vision: VisionPurpose;
}) => {
  const [isRiskDataSaving, setIsRiskDataSaving] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId;

  const formik = useFormik({
    initialValues: camelcaseKeys(vision),
    onSubmit: async (vision: VisionPurpose) => {
  
      if (!vision.reviewDate) {
        vision.reviewDate = dayjs(new Date()).format("YYYY/MM/DD")
      }
      try {
        setIsRiskDataSaving(true)
        const dataToSend: VisionPurpose = {
          ...vision
        };

        if (companyId) {
          await API.createVision({
            payload: dataToSend,
            companyId
          });
          Toast.success("Vision created sucessfully");
        }
        formik.resetForm();
      } catch (err: any) {
        Toast.error(err?.message || "Something went wrong.");
      } finally {
        setIsRiskDataSaving(false)
      }
    },
  });

  return (
    <div className={styles.container}>
      <Space size={20} />
      <FlexBox flexDirection='column'>
        <Typography size='huge'>Corporate Purpose</Typography>
        <Space size={15} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <FlexBox flexDirection='column'>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Typography size='big'>Vision</Typography>
                  <Space size={8} />
                  <TextArea
                    name='vision'
                    size='large'
                    rows={3}
                    placeholder='Enter here'
                    onChange={formik.handleChange}
                    value={formik.values.vision}
                    className={styles.textarea}
                  />
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={10}>
                  <FlexBox flexDirection='column'>
                    <Typography size='big'>Review Date</Typography>
                    <Space size={8} />
                    <DatePicker
                      name='reviewDate'
                      size='middle'
                      placeholder='__/__/____'
                      format='DD/MM/YYYY'
                      onChange={(value) => {
                        formik.setFieldValue('reviewDate', value?.toISOString())
                      }}
                      value={dayjs(formik.values.reviewDate)}
                    />
                  </FlexBox>
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Typography size='big'>Mission</Typography>
                  <Space size={8} />
                  <TextArea
                    rows={3}
                    name='mission'
                    size='middle'
                    placeholder='Enter here'
                    onChange={formik.handleChange}
                    value={formik.values.mission}
                    className={styles.textarea}
                  />
                </Col>
              </Row>
            </FlexBox>
          </Col>
        </Row>
      </FlexBox>
      <Space size={24} />
      {(formik?.values)?.corporateValues?.map((corporateValue, index) => {
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
                    <Typography size='big'>Value</Typography>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Space size={8} />
                        <Input
                          size='large'
                          placeholder='Enter here'
                          name={`corporateValues[${index}].value`}
                          onChange={formik.handleChange}
                          value={corporateValue.value}
                        />
                      </Col>
                    </Row>
                    <Space size={15} />
                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Typography size='big'>Value Description</Typography>
                        <Space size={8} />
                        <Input
                          size='middle'
                          placeholder='Enter here'
                          name={`corporateValues[${index}].description`}
                          onChange={formik.handleChange}
                          value={corporateValue.description}
                          style={{ width: "100%"}}
                        />
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
      {camelcaseKeys(formik?.values)?.internalValues?.map((internalValue, index) => {
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
                    <Typography size='big'> Value </Typography>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Space size={8} />
                        <Input
                          width={"100%"}
                          size='large'
                          placeholder='Enter here'
                          name={`internalValues[${index}].value`}
                          onChange={formik.handleChange}
                          value={internalValue.value}
                        />
                      </Col>
                    </Row>
                    <Space size={15} />

                    <Row gutter={[30, 0]}>
                      <Col span={24}>
                        <Typography size='big'>Value Description</Typography>
                        <Space size={8} />
                        <Input
                          name={`internalValues[${index}].description`}
                          size='middle'
                          placeholder='Enter here'
                          onChange={formik.handleChange}
                          value={internalValue.description}
                        />
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
        flexDirection='row'
        justifyContent='flex-end'
        alignItems='flex-end'
      >

        <Button
          type='primary'
          loading={isRiskDataSaving}
          onClick={() => formik.handleSubmit()}
          className={styles.saveButton}
          disabled={!formik.isValid}
        >
          Save
        </Button>
      </FlexBox>
    </div>
  );
};
export default VisionCard