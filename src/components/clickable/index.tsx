import React, { FC } from 'react'
import classnames from 'classnames'

import styles from './clickable.module.scss'

interface IProps {
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

const Clickable: FC<IProps> = ({ children, onClick, className }) => (
  <div
    className={classnames(styles.clickable, className)}
    onClick={onClick}
  >
    {children}
  </div>
)

export default Clickable
