import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'

const UploadWarningModal = forwardRef(
  (
    {
      handleConfirm,
      loading,
    }: {
      handleConfirm: () => void
      loading: boolean
    },
    ref
  ) => {
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
          <FlexBox alignItems='center'>
            <span style={{ color: '#c2a33b', marginRight: 5 }}>WARNING:</span>{' '}
            <Typography size='big'>
              Uploading this document will override the existing one.
            </Typography>
          </FlexBox>
          <Typography size='big'>Are you
            sure you want to proceed?</Typography>
          <Space size={20} />
          <FlexBox>
            <Button onClick={handleCancel} disabled={loading}>Cancel</Button>
            <Space size={10} horizontal />
            <Button type='primary' onClick={handleConfirm} loading={loading}>
              {loading ? "Uploading" : "Upload Anyway"}
            </Button>
          </FlexBox>
        </FlexBox>
      </Modal>
    )
  }
)

UploadWarningModal.displayName = 'UploadWarningModal'

export default UploadWarningModal
