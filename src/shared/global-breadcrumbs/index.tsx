"use client"

import React, { useEffect } from 'react'

import BreadCrumbs from '@/components/breadcrumbs'
import { TBreadCrumb } from '@/models'
import { useBreadcrumbs } from '@/hooks'

const GlobalBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs()

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event) {
        breadcrumbs.back()
      }
    }
  })

  const onItemClick = (item: TBreadCrumb, index: number) => {
    breadcrumbs.pop(index)
  }

  return (
    <BreadCrumbs
      items={breadcrumbs.items}
      activeItem={breadcrumbs.items[breadcrumbs.items.length - 1]?.title}
      onItemClick={onItemClick}
    />
  )
}

export default GlobalBreadcrumbs
