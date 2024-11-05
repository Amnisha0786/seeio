import React, { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { TBreadCrumb } from '@/models'
import styles from './breadcrumbs.module.scss'
import Typography from '../typography'
import Space from '../space'
import FlexBox from '../flex-box'

interface IProps {
  items: TBreadCrumb[]
  activeItem?: string
  onItemClick?: (item: TBreadCrumb, index: number) => void
  classname?: string
}

const BreadCrumbs = ({ items, activeItem, onItemClick, classname }: IProps) => {
  return (
    <div className={classname ? classname: styles.breadcrumbs}>
      <FlexBox alignItems='center'>
        {items?.map((item, index) => (
          <Fragment key={index}>
            <Link
              onClick={() => onItemClick && onItemClick(item, index)}
              href={{
                pathname: item.link,
              }}
              className={styles.link}
            >
              <Typography className={styles.text} primary={item.title === activeItem}>
                {item.title}
              </Typography>
            </Link>
            {index !== items.length - 1 ? (
              <>
                <Space horizontal size={5} />
                <Image
                  src='/icons/chevron-right.svg'
                  alt='icon'
                  width={18}
                  height={18}
                />
                <Space horizontal size={5} />
              </>
            ) : null}
          </Fragment>
        ))}
      </FlexBox>
    </div>
  )
}

export default BreadCrumbs
