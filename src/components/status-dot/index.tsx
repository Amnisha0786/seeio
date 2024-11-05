import React from 'react'

import styles from './status.module.scss'

interface IProps {
  color: "green" | "yellow" | "red"
}

const StatusDot = ({
  color = "green",
}: IProps): JSX.Element => (
  <span className={`${styles.dot} ${styles[color]}`}></span>
)

export default StatusDot
