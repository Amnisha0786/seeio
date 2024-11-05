import React from 'react'
import classnames from 'classnames'

import FlexBox from '@/components/flex-box'
import Typography, { TypographySize } from '@/components/typography'
import styles from './status.module.scss'
import Icon from '../icon'

interface IProps {
  className?: string
  title: string
  size?: TypographySize
  color?: "green" | "yellow" | "red" | string
  showArrow?: boolean
}

const getColor = (color?: string) => {
  if (color === "yellow") {
    return "#ce9f46";
  } else if (color === "red") {
    return "#a02828";
  } else if (color !== "white") {
    return color;
  } else {
    return "grey";
  }
};
const Status = ({
  className,
  color,
  title,
  showArrow,
  size
}: IProps): JSX.Element => (
  <FlexBox
    justifyContent={showArrow ? "space-between" : "center"}
    alignItems="center"
    className={classnames(
      styles.status,
      styles[color || "green"],
      className,
      color === "white" && styles.boxShadow
    )}
  >
    <Typography size={size || "small"} capitalize>
      {title}
    </Typography>
    {showArrow && (<FlexBox>
      <Icon name='arrowDown' height={10} color={getColor(color)} />
    </FlexBox>)}
  </FlexBox>
)

export default Status
