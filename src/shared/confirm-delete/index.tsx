import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

const ConfirmDelete = forwardRef(({
  handleConfirm,
  loading,
  message = "Are you sure to delete?",
  width = 500,
  confirmText = "Confirm"
}: {
  handleConfirm: () => void,
  loading: boolean,
  message?: string,
  confirmText?: string,
  width?: number
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

  const handleCancel = () => {
    setOpen(false);
  }

  return (
    <Modal open={open} width={width} onCancel={handleCancel}>
      <FlexBox flexDirection='column' alignItems={"center"} >
        <Typography size='big'>{message}</Typography>
        <Space size={20} />
        <FlexBox>
          <Button onClick={handleCancel}>Cancel</Button>
          <Space size={10} horizontal />
          <Button type='primary' onClick={handleConfirm} loading={loading}>{confirmText}</Button>
        </FlexBox>
      </FlexBox>
    </Modal>
  )
})

ConfirmDelete.displayName = 'ConfirmDelete'

export default ConfirmDelete
