import React from 'react'
import classnames from 'classnames'
import Image from 'next/image'

import FlexBox from '@/components/flex-box'
import styles from './avatars.module.scss'

interface IProps {
  className?: string
  sources: string[]
}

const Avatars = ({
  className,
  sources
}: IProps): JSX.Element => (
  <FlexBox className={classnames(styles.avatars, className)}>
    {sources.map((source, index) => (
      <Image
        className={styles.avatar}
        key={index}
        src={source}
        alt="avatar"
        width={32}
        height={32}
      />
    ))}
  </FlexBox>
)

export default Avatars
