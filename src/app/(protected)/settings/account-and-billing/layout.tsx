"use client"
import styles from './layout.module.scss'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <ScollablePage className={styles.page}>
      <Space size={24} />
      <Container>
        <Space size={24} />
        {children}
      </Container>
      <Space size={50} />
    </ScollablePage>
  )
}

export default Layout
