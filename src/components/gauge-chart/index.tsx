import classnames from 'classnames'

import styles from './gauge-chart.module.scss'

interface IProps {
  value: number
}

const GaugeChart = ({ value }: IProps): JSX.Element => {
  value = value > 1 ? 1 : value < 0 ? 0 : value
  const deg = 180 * value + 90

  return (
    <div className={styles.chart}>
      <div className={styles.circleOuter}>
        <div
          className={classnames(styles.circle, {
            [styles.circleRed]: value < 0.5,
            [styles.circleOrange]: value >= 0.5 && value < 0.7,
          })}
        >
          <div className={styles.circleMask}>
            <div className={styles.innerCircle} />
          </div>
        </div>
      </div>
      <div className={styles.needleOuter}>
        <div
          className={styles.needleRotate}
          style={{
            transform: `rotate(${deg}deg)`
          }}
        >
          <div className={styles.needle}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GaugeChart
