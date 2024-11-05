'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import Modal from '@/components/modal'
import styles from './all-plans-modal.module.scss'
import FlexBox from '@/components/flex-box'
import Container from '@/components/container'
import Header from '@/app/(protected)/header';
import {  useSelectedAccountCompany } from '@/hooks';

let instance: any

const AllPlansModal = forwardRef((prop, ref) => {
  const [open, setOpen] = useState(false)
  const [closable, setClosable] = useState(true)


  const companyId = useSelectedAccountCompany()?.companyId;

  useEffect(() => {    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: (force?: boolean) => {
        if (companyId) {
          setOpen(true)
          // setClosable(!force)
        }
      },
      close: () => setOpen(false),
    }),
    [companyId]
  )

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      className={styles.setupModal}
    //   closable={closable}
    //   maskClosable={closable}
    >
      <Header setOpenAllCompanyModal={setOpen} openAllCompanyModal={open} />
      <div className={styles.size}>
        <Container>
          <FlexBox
            flexDirection='column'
            justifyContent='center'
          >
            {companyId && React.createElement('stripe-pricing-table', {
              'pricing-table-id': process.env.NEXT_PUBLIC_PRICING_TABLE_ID,
              'publishable-key': process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
              'client-reference-id': companyId
            })}
          </FlexBox>
        </Container>
      </div>
    </Modal>
  )
})
AllPlansModal.displayName = 'AllPlansModal'

export const setInstance = (ref: any) => {
  instance = ref
}

export const open = (force?: boolean) => {
  if (instance) {
    return instance.open(force)
  }

  return null
}

export const close = (force?: boolean) => {
  if (instance) {
    return instance.close(force)
  }

  return null
}

export default AllPlansModal;
