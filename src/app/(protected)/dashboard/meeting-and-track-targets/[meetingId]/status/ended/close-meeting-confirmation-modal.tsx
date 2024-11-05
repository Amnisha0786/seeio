import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'
import { useRouter } from 'next/navigation'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

const ConfirmToClose = forwardRef(
  (
    {
      handleConfirm,
      loading,
      handleCancel
    }: {
      handleConfirm: () => void
      loading: boolean
      handleCancel: () => void
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()

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



    return (
      <Modal open={open} width={650} onCancel={handleCancel}>
        <FlexBox flexDirection='column' alignItems={'center'}>
          <Typography size='big'>
            <span style={{ color: "Orange", marginRight: "5px" }}>WARNING! </span>You are about to finalise this meeting and you will not be
            able to edit the minutes later! Finalising the meeting will create
            the minutes and update underlying records.
          </Typography>
          <Space size={20} />
          <FlexBox >
            <Button onClick={() => router.push("/dashboard/meeting-and-track-targets")}>Come back later</Button>
            <Space size={30} horizontal />
            <Button type='primary' onClick={handleConfirm} loading={loading}>
              Finalise
            </Button>
          </FlexBox>
        </FlexBox>
      </Modal>
    )
  }
)

ConfirmToClose.displayName = 'ConfirmToClose'

export default ConfirmToClose
