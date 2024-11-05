import classnames from 'classnames'

import styles from './loading.module.scss'

interface IProps {
  size?: 'small'
  className?: string
}

const Loading = ({ size, className }: IProps) => (
  <div
    className={classnames(styles.loading, size ? styles[size] : '', className)}
  />
)

export default Loading
