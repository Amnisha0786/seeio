import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { Col, Row } from 'antd'

import styles from './page.module.scss'
import Space from '@/components/space'
import Typography from '@/components/typography'
import FlexBox from '@/components/flex-box'
import Clickable from '@/components/clickable'
import { VisionPurpose } from './add-vision-purpose'
import TourComponent from '@/components/TourComponent'
import { useAccessLevel } from '@/hooks'
import { COMPANY_USER_ACCESS_LEVEL } from '@/models'
import Loading from '@/components/loading'

type Props = {
  purposeDetails: VisionPurpose
  onEdit: () => void
  onClickDelete: (deleteDetails: { key: "corporateValues" | "internalValues", index?: number }) => void
  config?: boolean
}

const VisionPurposeDetails = ({ purposeDetails, onEdit, onClickDelete, config }: Props) => {
  const userAccess = useAccessLevel()

  if (!userAccess) {
    return <Loading size='small' />
  }

  return (
    <>
      <FlexBox className={styles.card} flexDirection='column'>
        <FlexBox
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography size='large'>Corporate Purpose</Typography>
          <FlexBox flexDirection='row'>
            {(userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
              userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && <Clickable onClick={onEdit}>
              <Image
                src='/icons/edit-icon.svg'
                alt='edit icon'
                width={24}
                height={24}
              />
            </Clickable>}
          </FlexBox>
        </FlexBox>
        <Space size={15} />
        <Row gutter={[30, 0]}>
          <Col span={24}>
            <FlexBox flexDirection='column'>
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Typography gray>Vision</Typography>
                  <Space size={8} />
                  <Typography className={styles.text}>
                    {purposeDetails?.vision}
                  </Typography>
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={8}>
                  <FlexBox flexDirection='column'>
                    <Typography gray>Review Date</Typography>
                    <Space size={8} />
                    <Typography className={styles.text}>
                      {dayjs(purposeDetails?.reviewDate)?.format('DD/MM/YYYY')}
                    </Typography>
                  </FlexBox>
                </Col>
              </Row>
              <Space size={15} />
              <Row gutter={[30, 0]}>
                <Col span={24}>
                  <Typography gray>Mission</Typography>
                  <Space size={8} />
                  <Typography className={styles.text}>
                    {purposeDetails?.mission}
                  </Typography>
                </Col>
              </Row>
            </FlexBox>
          </Col>
        </Row>
      </FlexBox>

      {purposeDetails?.corporateValues?.map((corporateValue, index) => (
        <React.Fragment key={index}>
          <Space size={24} />
          <FlexBox className={styles.card} flexDirection='column'>
            <FlexBox
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography size='large'>Corporate Value №{index + 1}</Typography>
              {(userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && <FlexBox flexDirection='row'>
                <Clickable onClick={onEdit}>
                  <Image
                    src='/icons/edit-icon.svg'
                    alt='edit icon'
                    width={24}
                    height={24}
                  />
                </Clickable>
                <Clickable onClick={() => onClickDelete({ key: 'corporateValues', index })}>
                  <Image
                    src='/icons/delete-icon.svg'
                    alt='delete icon'
                    width={24}
                    height={24}
                  />
                </Clickable>
              </FlexBox>}
            </FlexBox>
            <Space size={15} />
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <FlexBox flexDirection='column'>
                  <Row gutter={[30, 0]}>
                    <Col span={24}>
                      <Typography gray>Value</Typography>
                      <Space size={8} />
                      <Typography className={styles.text}>
                        {corporateValue.value}
                      </Typography>
                    </Col>
                  </Row>
                  <Space size={15} />
                  <Row gutter={[30, 0]}>
                    <Col span={24}>
                      <Typography gray>Value Description</Typography>
                      <Space size={8} />
                      <Typography className={styles.text}>
                        {corporateValue?.description}
                      </Typography>
                    </Col>
                  </Row>
                </FlexBox>
              </Col>
            </Row>
          </FlexBox>
        </React.Fragment>
      ))}

      {purposeDetails?.internalValues?.map((internalDetail, index) => (
        <React.Fragment key={index} >
          <Space size={24} />
          <FlexBox className={styles.card} flexDirection='column'>
            <FlexBox
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography size='large'>Internal Value №{index + 1}</Typography>
              {(userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER) && <FlexBox flexDirection='row'>
                <Clickable onClick={onEdit}>
                  <Image
                    src='/icons/edit-icon.svg'
                    alt='edit icon'
                    width={24}
                    height={24}
                  />
                </Clickable>
                <Clickable onClick={() => onClickDelete({ key: 'internalValues', index })}>
                  <Image
                    src='/icons/delete-icon.svg'
                    alt='delete icon'
                    width={24}
                    height={24}
                  />
                </Clickable>
              </FlexBox>}
            </FlexBox>
            <Space size={15} />
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <FlexBox flexDirection='column'>
                  <Row gutter={[30, 0]}>
                    <Col span={24}>
                      <Typography gray>Value</Typography>
                      <Space size={8} />
                      <Typography className={styles.text}>
                        {internalDetail?.value}
                      </Typography>
                    </Col>
                  </Row>
                  <Space size={15} />
                  <Row gutter={[30, 0]}>
                    <Col span={24}>
                      <Typography gray>Value Description</Typography>
                      <Space size={8} />
                      <Typography className={styles.text}>
                        {internalDetail?.description}
                      </Typography>
                    </Col>
                  </Row>
                </FlexBox>
              </Col>
            </Row>
          </FlexBox>
        </React.Fragment>
      ))}

      <Space size={15} />

      <TourComponent start={userAccess && config} />
    </>
  )
}

export default VisionPurposeDetails
