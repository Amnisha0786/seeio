import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Row, Col, Radio, Checkbox, Select } from 'antd'
import { useFormik } from 'formik'
import TextArea from 'antd/es/input/TextArea'
import * as yup from 'yup'

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
  boardPaper: string
  moveToAgenda: boolean
  moveToAgendaLocation: string
  agendaTopic: string
  statusOfAgendaItem: string
  details: string
  movedBoardMeeting: string
  moveToSection: string
}

const validationSchema = yup.object().shape({
  timeAlloted: yup.string().required("Alloted Time is required."),
  presenter: yup.string().required("Presenter is required."),
  boardPaper: yup.string().required("Board paper is required."),
})

const OPTIONS = [{
  label: "Option 1",
  value: "1"
}, {
  label: "Option 1",
  value: "2"
}]

const RiskRegisterModal = forwardRef(({ onSave }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      timeAlloted: '',
      presenter: '',
      boardPaper: '',
      moveToAgenda: false,
      moveToAgendaLocation: 'a_different_meeting',
      agendaTopic: '',
      statusOfAgendaItem: '',
      details: '',
      movedBoardMeeting: '',
      moveToSection: '',
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
            Risk Register
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
          <Col span={12}>
            <Field label="Board Paper" errorMessage={formik.errors.boardPaper}>
              <Input
                name="boardPaper"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.boardPaper}
                status={formik.errors.boardPaper && "error"}
              />
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <Field label="Status of Agenda Item">
              <Radio.Group
                name="statusOfAgendaItem"
                onChange={formik.handleChange}
                value={formik.values.statusOfAgendaItem}
              >
                <Radio value="1">The Board approved</Radio>
                <Radio value="2">The Board approved with the following amendments</Radio>
                <Radio value="3">The Board did not approve</Radio>
                <Radio value="4">The Board resolved</Radio>
              </Radio.Group>
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
        <Space size={16} />
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Field label="Move this agenda item?">
              <Checkbox
                name="moveToAgenda"
                onChange={formik.handleChange}
                checked={formik.values.moveToAgenda}
              >
                Yes
              </Checkbox>
            </Field>
          </Col>
        </Row>
        <Space size={16} />
        {formik.values.moveToAgenda && (
          <>
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <Field label="Move this agenda item?">
                  <Radio.Group
                    name="moveToAgendaLocation"
                    onChange={formik.handleChange}
                    value={formik.values.moveToAgendaLocation}
                  >
                    <Radio value="a_different_meeting">A different meeting</Radio>
                    <Radio value="a_Section_within_this_meeting">A Section within this meeting</Radio>
                  </Radio.Group>
                </Field>
              </Col>
            </Row>
            <Space size={16} />
            <Row gutter={[30, 0]}>
              <Col span={12}>
                {formik.values.moveToAgendaLocation === "a_different_meeting" ? (
                  <Field label="Board meeting this agenda item was moved to">
                    <Select
                      size="large"
                      placeholder="Select"
                      options={OPTIONS}
                      onChange={(value) => formik.setFieldValue("movedBoardMeeting", value)}
                      value={formik.values.movedBoardMeeting}
                      status={formik.errors.movedBoardMeeting && "error"}
                    />
                  </Field>
                ) : (
                  <Field label="Move to section:">
                    <Radio.Group
                      name="moveToSection"
                      onChange={formik.handleChange}
                      value={formik.values.moveToSection}
                    >
                      <Radio value="1">For Information</Radio>
                      <Radio value="2">For Approval</Radio>
                    </Radio.Group>
                  </Field>
                )}
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
RiskRegisterModal.displayName = "RiskRegisterModal"

export default RiskRegisterModal
