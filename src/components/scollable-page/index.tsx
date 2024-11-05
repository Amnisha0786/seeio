import classNames from 'classnames'

import styles from './scollable-page.module.scss'

interface IProps {
  className?: string
  children: React.ReactNode
}

const ScollablePage = ({ children, className }: IProps): JSX.Element => (
  <div
    className={classNames(styles.scollablePage, className)}
  >
    {children}
  </div>
)

export default ScollablePage
