import React, { useCallback, useState } from 'react'
import { InfoCircleOutlined } from "@ant-design/icons"

import styles from './tooltip.module.scss'
import { Tooltip } from 'antd'
import FlexBox from '../flex-box'

interface IProps {
  title?: string | React.ReactElement
  readMoreText?: string | React.ReactElement
  defaultIconSize?: boolean
}

const TooltipText = ({ title, readMoreText, defaultIconSize }: IProps) => {
  const [showMoreText, setShowMoreText] = useState(false)

  const onExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMoreText((prev) => !prev)
  }, [])

  return (
    <Tooltip
      placement='top'
      title={
        <FlexBox alignItems='center' flexDirection='column' justifyContent='center'>
          <p>{title} <button className={styles.buttonStyle} onClick={onExpand}>{!showMoreText ? "Read More" : "Read Less"}</button> </p>
          <p>{showMoreText && readMoreText}</p>
        </FlexBox>
      }
      color='#ECEFF2'
      overlayInnerStyle={{ color: "#005F73" }}
    >
      <InfoCircleOutlined className={!defaultIconSize ? styles.size : ""} />
    </Tooltip>
  );
};

export default TooltipText;
