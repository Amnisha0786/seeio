import { forwardRef, useImperativeHandle, useState } from 'react'

import Modal from '@/components/modal'
import styles from './send-invitation-modal.module.scss'


const SendInvitationModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [])

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
    >
      <div className={styles.sendInvitationModal}>
        Send Invitation
      </div>
    </Modal>
  )
})
SendInvitationModal.displayName = "SendInvitationModal"

export default SendInvitationModal
