"use client"

import { Component, ReactNode } from 'react'
import { Modal } from 'antd'

import Typography from '@/components/typography'
import Button from '@/components/button'
import Space from '@/components/space'
import FlexBox from '@/components/flex-box'
import styles from './confirmable.module.scss'

type TOpenParams = {
  content: string | ReactNode,
  acceptButtonText?: string
  hideCancelButton?: string
}

let instance: any

class Confirmable extends Component {
  state = {
    visible: false,
    content: null,
    acceptButtonText: null,
    hideCancelButton: false
  }

  _resolve?: (value: unknown) => void

  static setInstance = (ref: any) => {
    instance = ref
  }

  static open = (params: TOpenParams) => {
    if (instance) {
      return instance.open(params)
    }

    return null
  }

  open = ({
    content,
    acceptButtonText,
    hideCancelButton
  } : TOpenParams) => new Promise((resolve) => {
    this._resolve = resolve
    this.setState({
      visible: true,
      content,
      acceptButtonText,
      hideCancelButton
    })
  })

  _onClose = () => {
    this.setState({
      visible: false
    })
  }

  _onCancel = () => {
    this._resolve?.(false)

    this._onClose()
  }

  _onAccept = () => {
    this._onClose()

    setTimeout(() => {
      this._resolve?.(true)
    }, 300)
  }

  render() {
    const { visible, content, acceptButtonText, hideCancelButton } = this.state

    return (
      <Modal
        open={visible}
        centered
        destroyOnClose
        className={styles.confirmable}
        onCancel={this._onCancel}
        footer={null}
      >
        <div className="modal-content">
          <div className="body">
            <Typography size="big" className={styles.content}>
              {content}
            </Typography>
            <Space size={20} />
            <div className="action-box">
              <FlexBox justifyContent="flex-end">
                {!hideCancelButton && (
                  <>
                    <Button
                      onClick={this._onCancel}
                      className="action-button"
                    >
                      Close
                    </Button>
                    <Space horizontal size={15} />
                  </>
                )}
                <Button
                  type="primary"
                  onClick={this._onAccept}
                  className="action-button"
                >
                  {acceptButtonText || 'OK'}
                </Button>
              </FlexBox>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Confirmable
