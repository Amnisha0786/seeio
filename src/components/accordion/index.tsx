import React, { useState } from 'react';

import Clickable from '@/components/clickable';
import FlexBox from '@/components/flex-box';
import Typography from '@/components/typography';
import Space from '@/components/space';
import Icon from '@/components/icon';
import styles from './accordion.module.scss';

interface Middle {
  text1: string;
  text2?: string;
}
interface IProps {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  middle?: Middle;
}

const Accordion = ({ children, title, right, className, middle }: IProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FlexBox flexDirection='column'>
      <Clickable
        className={className ? className : styles.accordion}
        onClick={() => setOpen(!open)}
      >
        <Typography size='huge' className={styles.titleWidth} ellipsis>{title}</Typography>
        {middle && middle.text1 && (
          <FlexBox className={styles.middleTextWidth} alignItems='center' justifyContent='space-around'>
            <Typography color='#ff0000' ellipsis>{middle.text1}</Typography>
          </FlexBox>
        )}
        {middle && middle.text2 && (
          <FlexBox className={styles.middleTextWidth} alignItems='center' justifyContent='space-around'>
            <Typography ellipsis>{middle.text2}</Typography>
          </FlexBox>
        )}
        <FlexBox alignItems='center'>
          {!!right && (
            <>
              {right}
              <Space size={20} horizontal />
            </>
          )}
          <Icon name='up-arrow' rotate={open ? 0 : 180} size={24} />
        </FlexBox>
      </Clickable>
      {open && children}
    </FlexBox>
  );
};

export default Accordion;
