import React from 'react'
import classnames from 'classnames'

import styles from './flex-box.module.scss'

interface IProps {
  id?: string
  className?: string
  children: React.ReactNode
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around"
  alignItems?: "center" | "flex-start" | "flex-end"
  flexDirection?: "column" | "column-reverse" | "row" | "row-reverse"
  flex?: number | false
  width?: number
  gap?: number
  fullHeight?: boolean
  zeroMinWidth?: boolean
  onClick?: () => void
}

const FlexBox = ({
  id,
  className,
  children,
  justifyContent,
  alignItems,
  flexDirection,
  flex,
  gap,
  width,
  fullHeight = false,
  zeroMinWidth, // often using for wraping ellipsis text
  ...props
}: IProps): JSX.Element => (
  <div
    {...props}
    id={id}
    className={classnames(
      styles.flexBox,
      justifyContent && styles[`justify-content-${justifyContent}`],
      alignItems && styles[`align-items-${alignItems}`],
      flexDirection && styles[`flex-direction-${flexDirection}`],
      className, {
        [styles.zeroMinWidth]: zeroMinWidth,
        [styles.fullHeight]: fullHeight
      }
    )}
    style={{
      ...(flex && { flex }),
      ...(width && { width }),
      ...(gap && { gap })
    }}
  >
    {children}
  </div>
)

export default FlexBox
