import React from 'react'
import classnames from 'classnames'

import styles from './typography.module.scss'

export type TypographySize = "tiny" | "small" | "medium" | "large" | 'extraLarge' | "big" | "huge" | "giant" | "enormous"

export interface ITypography {
  className?: string
  size?: TypographySize
  link?: boolean
  light?: boolean
  underline?: boolean
  center?: boolean
  bold?: boolean
  roboto?: boolean
  serif?: boolean
  gray?: boolean
  darkgray?: boolean
  red?: boolean
  darkBlue?: boolean
  blue?: boolean,
  primary?: boolean
  ellipsis?: boolean
  clickable?: boolean
  capitalize?: boolean
  children?: React.ReactNode
  style?: any,
  color?: string,
  onClick?: (e: React.MouseEvent) => void,
  dangerouslySetInnerHTML?: any
}

const Typography = ({
  className,
  children,
  link,
  underline,
  light,
  center,
  size,
  bold,
  roboto,
  serif,
  gray,
  darkgray,
  red,
  darkBlue,
  blue,
  primary,
  color,
  ellipsis,
  dangerouslySetInnerHTML,
  clickable,
  capitalize,
  ...props
}: ITypography): JSX.Element => (
  <p
    style={{
      color,
      ...props.style
    }}
    className={classnames(
      styles.typography,
      size ? styles[size] : '',
      {
        [styles.link]: link,
        [styles.capitalize]: capitalize,
        [styles.underline]: underline,
        [styles.light]: light,
        [styles.center]: center,
        [styles.bold]: bold,
        [styles.roboto]: roboto,
        [styles.serif]: serif,
        [styles.gray]: gray,
        [styles.darkgray]: darkgray,
        [styles.red]: red,
        [styles.darkBlue]: darkBlue,
        [styles.blue]: blue,
        [styles.primary]: primary,
        [styles.ellipsis]: ellipsis,
        [styles.clickable]: clickable,
      },
      className
    )}
    dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    {...props}
  >
    {children}
  </p>
)

export default Typography
