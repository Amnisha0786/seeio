"use client"

import React from 'react'

const Favicon = () => {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (!origin) return null

  if (!origin.includes("seeio-dev")) {
    return <link
      rel="icon"
      sizes="16x16"
      href="/favicon-prod.ico"
    />
  }
  return (
    <link
      rel="icon"
      sizes="16x16"
      type="image/png"
      href="/favicon-dev.png"
    />
  )
}

export default Favicon