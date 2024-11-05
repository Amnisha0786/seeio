import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, DatePicker, Select, Checkbox } from 'antd'
import { useFormik } from 'formik'
import * as yup from 'yup'
import dayjs from 'dayjs'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Toast from '@/components/toast'
import Field from '@/components/field'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import styles from './page.module.scss'
import { MEETING_TYPES, MEETING_TYPES_OTHER } from '@/constants'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_TYPE, PLATFORM } from '@/contexts/AmplitudeContext'
import { COMPANY_USER_ACCESS_LEVEL } from '@/models'

type TForm = {
  location: string
  date: dayjs.Dayjs | null
  allotedTime: string
  isVirtual: boolean
  type: string | null
}

const validationSchema = yup.object().shape({
  location: yup.string().required("Link / Location is required"),
  date: yup
    .object()
    .nullable()
    .required("Date & Time is required"),
  type: yup.string().required("Type is required")
})

const AddMeetingModal = forwardRef(({ onSuccess }: { onSuccess: () => void }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const companyId = useSelectedAccountCompany()?.companyId
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const userAccess = useAccessLevel()

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: {
      location: '',
      isVirtual: false,
      date: null,
      allotedTime: '',
      type: null
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        if (!companyId) return

        await API.addMeeting({
          companyId,
          ...values,
          date: values.date?.toString() || ""
        })
        Toast.success("Add Meeting Successfully")
        trackAmplitudeEvent(EVENT_TYPE.KEY_STEP, {
          user_id: userAccess?.userId,
          actioned_at: new Date().valueOf(),
          platform: PLATFORM.WEB
        });
        onSuccess()
        setOpen(false)
      } finally {
        setLoading(false)
      }
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
        <Typography size="huge">
          Add Meeting
        </Typography>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Link / Location" errorMessage={formik.errors.location}>
              <Input
                name="location"
                size="large"
                placeholder="Enter here"
                onChange={formik.handleChange}
                value={formik.values.location}
                status={formik.errors.location && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Date & Time" errorMessage={formik.errors.date}>
              <DatePicker
                showTime
                name="date"
                size='large'
                placeholder='__/__/____ __:__'
                format='DD/MM/YYYY HH:mm'
                onChange={(value) => formik.setFieldValue('date', value)}
                value={formik.values.date}
              />
            </Field>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Field label="Type" errorMessage={formik.errors.type}>
              <Select
                size="large"
                placeholder="Select"
                allowClear
                options={(
                  userAccess?.accessLevel?.toUpperCase() === COMPANY_USER_ACCESS_LEVEL.ADMIN || 
                  userAccess?.accessLevel?.toUpperCase() === COMPANY_USER_ACCESS_LEVEL.OWNER ||
                  userAccess?.accessLevel?.toUpperCase() === COMPANY_USER_ACCESS_LEVEL.USER
                ) ? MEETING_TYPES : MEETING_TYPES_OTHER}
                onChange={(value) => formik.setFieldValue("type", value)}
                value={formik.values.type}
                status={formik.errors.type && "error"}
              />
            </Field>
          </FlexBox>
          <Space horizontal size={24} />
          <FlexBox flexDirection="column" flex={1}>{""}</FlexBox>
        </FlexBox>
        <Space size={24} />
        <FlexBox>
          <FlexBox flexDirection="column" flex={1}>
            <Typography>Add a via video conference/telephone dial-in</Typography>
            <Space size={8} />
            <Checkbox
              name="isVirtual"
              onChange={formik.handleChange}
              checked={formik.values.isVirtual}
            >
              Yes
            </Checkbox>
          </FlexBox>
        </FlexBox>
        <Space size={24} />
        {/*{formik.values.isVirtual && (*/}
        {/*  <>*/}
        {/*    <FlexBox>*/}
        {/*      <FlexBox flexDirection="column" flex={1}>*/}
        {/*        <Typography>Method of managing conflict</Typography>*/}
        {/*        <Space size={8} />*/}
        {/*        <Radio.Group onChange={() => null}>*/}
        {/*          <Radio value={1}>Articles permit voiting</Radio>*/}
        {/*          <Radio value={2}>Didn`t vote or form part of quorum</Radio>*/}
        {/*          <Radio value={3}>Recuse from meetinf</Radio>*/}
        {/*        </Radio.Group>*/}
        {/*      </FlexBox>*/}
        {/*    </FlexBox>*/}
        {/*    <Space size={24} />*/}
        {/*  </>*/}
        {/*)}*/}
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})
AddMeetingModal.displayName = "AddMeetingModal"

export default AddMeetingModal
