import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Row, Col } from 'antd'
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
  timeAlloted: string
}

const validationSchema = yup.object().shape({
  timeAlloted: yup.string().required("Alloted time is required."),
})

const OpeningTheMeetingModal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      timeAlloted: '',
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
            Opening the meeting
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
OpeningTheMeetingModal.displayName = "OpeningTheMeetingModal"

export default OpeningTheMeetingModal
