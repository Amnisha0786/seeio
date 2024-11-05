import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

const ConfirmNextDate = forwardRef(({
  handleConfirm,
  loading,
  message = "You have not set the date of the next meeting. Do you wish to proceed?",
  handleCancel
}: {
  handleConfirm: () => void,
  loading: boolean,
  message?: string,
  handleCancel: () => void
}, ref) => {
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

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Modal open={open} width={500} onCancel={handleClose}>
      <FlexBox flexDirection='column' alignItems={"center"} >
        <Typography size='big'>{message}</Typography>
        <Space size={20} />
        <FlexBox>
          <Button onClick={handleCancel}>Set date</Button>
          <Space size={10} horizontal />
          <Button type='primary' onClick={handleConfirm} loading={loading}>Confirm</Button>
        </FlexBox>
      </FlexBox>
    </Modal>
  )
})

ConfirmNextDate.displayName = 'ConfirmNextDate'

export default ConfirmNextDate
