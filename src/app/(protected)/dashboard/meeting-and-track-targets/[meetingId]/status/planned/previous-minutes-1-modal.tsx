import { forwardRef, useImperativeHandle, useState } from 'react'
import { Row, Col, Select, Radio } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import TextArea from 'antd/es/input/TextArea'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import styles from './page.module.scss'

interface IProps {
  onSave?: (values: TForm) => void
}

type TForm = {
  meetingMinutes: string
  approveType: string
}

const validationSchema = yup.object().shape({
  meetingMinutes: yup.string().required(),
})

const PreviousMinutes1Modal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      meetingMinutes: '',
      approveType: '1',
    },
    validationSchema,
    onSubmit: (values) => {
      onSave?.(values)
      setOpen(false)
    }
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      formik.resetForm()
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [formik])

  return (
    <Modal
      open={open}
      width={780}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.addActionModal}>
        <Typography size="giant">
          Manage agenda
        </Typography>
        <Space size={24} />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">
            Previous Minutes 1
          </Typography>
          <Clickable>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={6} />
        <Typography size="large" red>
          ⓘ When you save this meeting, the status of this minutes report will be updated.
        </Typography>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Alloted time (minutes)">
              <Select
                size="large"
                placeholder="Select"
                options={[{
                  label: "1",
                  value: "1",
                }, {
                  label: "2",
                  value: "2",
                }, {
                  label: "3",
                  value: "3",
                }]}
                onChange={(value) => formik.setFieldValue("meetingMinutes", value)}
                value={formik.values.meetingMinutes}
                status={formik.errors.meetingMinutes && "error"}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Radio.Group
              name="approveType"
              onChange={formik.handleChange}
              value={formik.values.approveType}
            >
              <Radio value="1">Approved</Radio>
              <Radio value="2">Approved with amendments</Radio>
              <Radio value="3">Pending approval</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {formik.values.approveType === "2" && (
          <>
            <Space size={16} />
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <TextArea
                  rows={4}
                  size='large'
                  placeholder='Enter here'
                  onChange={formik.handleChange}
                />
              </Col>
            </Row>
          </>
        )}
        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})
PreviousMinutes1Modal.displayName = "PreviousMinutes1Modal"

export default PreviousMinutes1Modal
