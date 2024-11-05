import classNames from 'classnames'

import styles from './container.module.scss'

interface IProps {
  className?: string
  children: React.ReactNode
}

const Container = ({ children, className }: IProps): JSX.Element => {
  className = classNames(styles.container, className)

  return (
    <div className={className}>{children}</div>
  )
}

export default Container
