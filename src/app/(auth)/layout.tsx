"use client"

import styles from './layout.module.scss'

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className={styles.layout}>
      <div className={styles.authBox}>
        {children}
      </div>
    </div>
  )
}

export default Layout
