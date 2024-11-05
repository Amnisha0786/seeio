import React from 'react';
import { Button } from 'antd'

import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Space from '@/components/space';
import Modal from '@/components/modal';
import Icon from '@/components/icon'

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  open: boolean
}
const CompanyExistModal = ({ setOpen, open }: Props) => {
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} width={450} onCancel={handleCancel}>
      <Space size={10} />
      {(
        <>
          <FlexBox alignItems='center' flexDirection='column'>
            <Typography size='giant' >Company already exists</Typography>
            <Typography size='huge' color='#A0A4B6'>Would you like to request access?</Typography>
          </FlexBox>
          <Space size={25} />
          <FlexBox alignItems='center' justifyContent='center'>
            <Icon
              name={"company-already-exist"}
              alt="side bar item icon"
              size={120}
            />
          </FlexBox>
          <Space size={25} />
          <FlexBox justifyContent='space-between'>
            <Button style={{ border: "none", width: "48%" }}>Back</Button>
            <Button style={{ width: "48%" }} type='primary'>Yes</Button>
          </FlexBox>
        </>
      )}
    </Modal>
  );
}

CompanyExistModal.displayName = 'CompanyExistModal';

export default CompanyExistModal;
