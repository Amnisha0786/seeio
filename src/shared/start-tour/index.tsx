import React, { forwardRef, useImperativeHandle, useState } from 'react'

import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import Icon from '@/components/icon'
import Modal from '@/components/modal'
import Space from '@/components/space'
import Typography from '@/components/typography'
import styles from "./start-tour.module.scss"

const StartTour = forwardRef(({
  handleConfirm,
  loading,
  message,
  title,
  setTourStart,
}: {
  handleConfirm: () => void,
  loading?: boolean,
  message: string
  title: string
  updateConfigData?: (key: string) => void,
  setTourStart: any
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
    setTourStart(false)
    setOpen(false);
  }

  return (
    <Modal open={open} width={610} onCancel={handleCancel}>
      <Space size={20} />
      <FlexBox flexDirection='column' alignItems={"center"} >
        <Icon name="guide-tour"
          className={styles.icon}
          alt="SEEIO logo" />
        <Typography size='enormous' bold center>{title}</Typography>
        <Space size={10} />
        <Typography size='big' center>{message}</Typography>
        <Space size={20} />
        <FlexBox>
          <Button type='primary' onClick={handleConfirm} loading={loading}>Start now</Button>
        </FlexBox>
      </FlexBox>
      <Space size={20} />
    </Modal>
  )
})

StartTour.displayName = 'StartTour'

export default StartTour
