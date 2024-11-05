import { forwardRef, useImperativeHandle, useState, Fragment } from 'react'
import { Checkbox } from 'antd'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Button from '@/components/button'
import Space from '@/components/space'
import Field from '@/components/field'
import styles from './layout.module.scss'

const OPTIONS = [{
  label: "Clear whole meeting and start again",
  note: "ⓘ This will reset all of the meeting pack work you've carried out so far."
}, {
  label: "Clear agenda",
  note: "ⓘ This will reset all of the agenda work you've carried out so far."
}, {
  label: "Clear risk reports",
  note: "ⓘ This will reset all of the risk report work you've carried out so far."
}, {
  label: "Clear progress updates",
  note: "ⓘ This will reset all of the progress update work you've carried out so far."
}, {
  label: "Clear incident reports",
  note: "ⓘ This will reset all of the incident report work you've carried out so far."
}, {
  label: "Clear action updates",
  note: "ⓘ This will reset all of the action update work you've carried out so far."
}, {
  label: "Clear corporate objective updates",
  note: "ⓘ This will reset all of the objective update work you've carried out so far."
}]

const ResetMeetingModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [])

  return (
    <Modal
      open={open}
      width={780}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.resetMeetingModal}>
        <Typography size="huge">
          Reset Meeting
        </Typography>
        <Space size={24} />
        {OPTIONS.map((item, index) => (
          <Fragment key={index}>
            <FlexBox alignItems="center">
              <FlexBox className={styles.right}>
                <Field label={item.label}>
                  <Checkbox>Yes</Checkbox>
                </Field>
              </FlexBox>
              <Space horizontal size={8} />
              <FlexBox flex={1}>
                <Typography size="large" red>
                  {item.note}
                </Typography>
              </FlexBox>
            </FlexBox>
            <Space size={24} />
          </Fragment>
        ))}
        <FlexBox justifyContent="flex-end">
          <Button
            type="primary"
            onClick={() => setOpen(false)}
          >
            Create
          </Button>
        </FlexBox>
      </div>
    </Modal>
  )
})
ResetMeetingModal.displayName = "ResetMeetingModal"

export default ResetMeetingModal
