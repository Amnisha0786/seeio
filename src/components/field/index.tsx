import React from 'react'
import classnames from 'classnames'

import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import Typography, { ITypography } from '@/components/typography'

interface IProps {
  className?: string
  children: React.ReactNode
  label?: string
  errorMessage?: string
  labelProps?: Omit<ITypography, "children">
  sideContent?: React.ReactNode
}

const Field = ({
  className,
  children,
  label,
  labelProps,
  errorMessage,
  sideContent
}: IProps): JSX.Element => (
  <FlexBox
    flexDirection="column"
    className={classnames(className)}
  >
    {label && (
      <>
        <FlexBox alignItems='center'>
          <Typography color="#00293F" {...labelProps} >{label}</Typography>
          {sideContent}
        </FlexBox>
        <Space size={8} />
      </>
    )}
    {children}
    {errorMessage && (
      <>
        <Space size={5} />
        <Typography red size="small">{errorMessage}</Typography>
      </>
    )}
  </FlexBox>
)

export default Field
