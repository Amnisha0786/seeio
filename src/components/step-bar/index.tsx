import classnames from 'classnames'
import Image from 'next/image'

import Typography from '@/components/typography'
import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import styles from './step-bar.module.scss'

interface IProps {
  className?: string
  steps: {
    value: number
    title: string
  }[]
  activeIndex?: number
}

const StepBar = ({ className, steps, activeIndex = 0 }: IProps) => (
  <FlexBox className={classnames(styles.stepBar, className)} alignItems="center">
    {steps.map((step, index) => (
      <FlexBox
        className={classnames(styles.stepBarItem, {
          [styles.behind]: activeIndex > index,
          [styles.active]: activeIndex >= index
        })}
        key={index}
        flex={index < steps.length - 1 && 1}
      >
        <FlexBox flexDirection="column">
          <FlexBox alignItems="center" className={styles.titleBox}>
            <Typography size="enormous" bold>{index + 1}</Typography>
            <Space horizontal size={6} />
            <Typography serif>{step.title}</Typography>
          </FlexBox>
          <Space horizontal size={6} />
          <FlexBox className={styles.circle} justifyContent="center" alignItems="center">
            <Image
              className={styles.tickIcon}
              src="/icons/white-tick-icon.svg"
              alt="icon"
              width={16}
              height={12}
            />
          </FlexBox>
        </FlexBox>
        {index < steps.length - 1 && (
          <div className={styles.progressLine} />
        )}
      </FlexBox>
    ))}
  </FlexBox>
)

export default StepBar
