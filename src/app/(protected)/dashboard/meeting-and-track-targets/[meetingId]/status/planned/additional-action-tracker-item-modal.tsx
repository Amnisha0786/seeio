import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Row, Col } from 'antd'
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
import FilePicker from '@/components/file-picker'
import Icon from '@/components/icon'
import PeopleSelect from '@/shared/people-select'
import styles from './page.module.scss'

interface IProps {
  onSave?: (values: TForm) => void
}

type TForm = {
  timeAlloted: string
  presenter: string
  agendaTopic: string
  details: string
  notes: string
}

const validationSchema = yup.object().shape({
  timeAlloted: yup.string().required(),
  presenter: yup.string().required(),
})

const AdditionalActionTrackerItemModal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      timeAlloted: '',
      presenter: '',
      agendaTopic: '',
      details: '',
      notes: '',
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
            Additional Action Tracker Item
          </Typography>
          <Clickable>
            <Icon name="black-delete-icon" size={24} />
          </Clickable>
        </FlexBox>
        <Space size={24} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Alloted time (minutes)" errorMessage={formik.errors.timeAlloted}>
              <Input
                name="timeAlloted"
                size="large"
                type="number"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.timeAlloted}
                status={formik.errors.timeAlloted && "error"}
              />
            </Field>
          </Col>
          <Col span={12}>
            <Field label="Agenda Topic" errorMessage={formik.errors.agendaTopic}>
              <Input
                name="agendaTopic"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.agendaTopic}
                status={formik.errors.agendaTopic && "error"}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Presenter" errorMessage={formik.errors.presenter}>
              <PeopleSelect
                size="large"
                allowClear
                placeholder="Select"
                onChange={(value) => formik.setFieldValue("presenter", value)}
                value={formik.values.presenter}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Notes">
              <Input
                name="notes"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.notes}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Details of the board decision">
              <TextArea
                rows={4}
                name={`details`}
                size='large'
                placeholder='Enter here'
                onChange={formik.handleChange}
                value={formik.values.details}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Associated document(s)">
              <FilePicker />
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
AdditionalActionTrackerItemModal.displayName = "AdditionalActionTrackerItemModal"

export default AdditionalActionTrackerItemModal
