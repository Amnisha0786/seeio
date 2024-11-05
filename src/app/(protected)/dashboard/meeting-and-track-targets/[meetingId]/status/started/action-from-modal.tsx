import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Row, Col, DatePicker, Select } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'

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
  task: string
  dueDate: string
  actionOwner: string
}

const validationSchema = yup.object().shape({
  agendaItem: yup.string().required(),
  presenter: yup.string().required(),
  boardPaper: yup.string().required(),
})

const OPTIONS = [{
  label: "Option 1",
  value: "1"
}, {
  label: "Option 1",
  value: "2"
}]

const ActionFromModal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      agendaItem: '',
      task: '',
      dueDate: '',
      actionOwner: '',
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
            Action from
          </Typography>
          <Clickable>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Agenda Item" errorMessage={formik.errors.agendaItem}>
              <Input
                name="agendaItem"
                size="large"
                type="number"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.agendaItem}
                status={formik.errors.agendaItem && "error"}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Details of Action (task)" errorMessage={formik.errors.task}>
              <Input
                name="task"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.task}
                status={formik.errors.task && "error"}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Due by Date" >
              <DatePicker
                name="dueDate"
                size='large'
                placeholder='__/__/____'
                format='DD/MM/YYYY'
                // onChange={(value) => formik.setFieldValue('dueDate', value)}
                // value={formik.values.dueDate}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Action Owner">
              <Select
                size="large"
                placeholder="Select"
                options={OPTIONS}
                onChange={(value) => formik.setFieldValue(" actionOwner", value)}
                value={formik.values. actionOwner}
                status={formik.errors. actionOwner && "error"}
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
ActionFromModal.displayName = "ActionFromModal"

export default ActionFromModal
