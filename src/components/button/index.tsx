"use client"

import React from 'react'
import { Button as AntButton, ButtonProps } from 'antd'
import styles from './button.module.scss'
import classnames from 'classnames'

interface ButtonProp extends ButtonProps {
  fullWidth?: boolean
}

const Button = (props: ButtonProp) => {
  return (
    <AntButton 
      {...props} 
      className={classnames(styles.button,
        props.className ?? "",
        { [styles.fullWidth]: props.fullWidth })
      } 
    />
  )
}

export default Button
