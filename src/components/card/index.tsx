import classNames from 'classnames'

import styles from './styles.module.scss'
import Typography from '../typography'
import Space from '../space'

interface IProps {
  className?: string
  title?: string
  paddingHorizontal?: number
  paddingVertical?: number
  children: React.ReactNode
  [key: string]: any
}

const Card = ({
  children,
  className,
  title,
  paddingHorizontal,
  paddingVertical,
  ...props
}: IProps): JSX.Element => {
  className = classNames(styles.card, className)

  return (
    <div
      className={className}
      {...props}
      style={{
        ...(paddingHorizontal && { paddingLeft: paddingHorizontal, paddingRight: paddingHorizontal }),
        ...(paddingVertical && { paddingTop: paddingVertical, paddingBottom: paddingVertical })
      }}
    >
      {title ? (
        <>
          <Typography size='huge'>{title}</Typography>
          <Space size={16} />
        </>
      ) : null}
      {children}
    </div>
  )
}

export default Card
