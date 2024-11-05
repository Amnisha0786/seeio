import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Row, Col, DatePicker, Select } from 'antd'
import { useFormik } from 'formik'

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
  agendaItem: string
  actionDescription: string
  dueByDate: string
  owner: string
  status: string
  note: string
}

const OPTIONS = [{
  label: "Option 1",
  value: "1"
}, {
  label: "Option 1",
  value: "2"
}]

const Action1Modal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      agendaItem: '',
      actionDescription: '',
      dueByDate: '',
      owner: '',
      status: '',
      note: '',
    },
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
          Actions Report
        </Typography>
        <Space size={24} />
        <FlexBox justifyContent="space-between" alignItems="center">
          <Typography size="huge">
            Action 1
          </Typography>
          <Clickable>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Agenda Item">
              <Input
                name="agendaItem"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.agendaItem}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Action Description">
              <Input
                name="actionDescription"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.actionDescription}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Due by Date">
              <DatePicker
                name="dateAdded"
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                // onChange={(value) => formik.setFieldValue('dueByDate', value)}
                // value={formik.values.dueByDate}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Owner">
              <Select
                size="large"
                placeholder="Select"
                options={OPTIONS}
                onChange={(value) => formik.setFieldValue("owner", value)}
                value={formik.values.owner}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Status">
              <Select
                size="large"
                placeholder="Select"
                options={OPTIONS}
                onChange={(value) => formik.setFieldValue("status", value)}
                value={formik.values.status}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Notes">
              <Input
                name="note"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.note}
              />
            </Field>
          </Col>
        </Row>
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
Action1Modal.displayName = "Action1Modal"

export default Action1Modal
