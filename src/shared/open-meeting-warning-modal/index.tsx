import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'

const OpenMeetingWarningModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setOpen(true)
      },
      close: () => setOpen(false),
    }),
    []
  )

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Modal open={open} width={550} onCancel={handleCancel}>
      <FlexBox flexDirection='column' alignItems={'center'}>
        <Space size={5} />
        <Typography size='big'>
          This meeting is in the future and not ready to start.
        </Typography>
        <Space size={20} />
        <Button onClick={handleCancel} type='primary'>
          Ok
        </Button>
      </FlexBox>
    </Modal>
  )
})

OpenMeetingWarningModal.displayName = 'OpenMeetingWarningModal'

export default OpenMeetingWarningModal
