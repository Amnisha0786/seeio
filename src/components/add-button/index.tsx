import React from 'react'
import { PlusOutlined } from '@ant-design/icons'

import Clickable from '../clickable'
import styles from './add-button.module.scss'

interface IProps {
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

const AddButton = ({ onClick, className }: IProps) => {
  return (
    <Clickable className={`${styles.addButton} ${className}`} onClick={onClick}>
      <PlusOutlined />
    </Clickable>
  )
}

export default AddButton
