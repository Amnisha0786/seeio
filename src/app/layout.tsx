"use client"

import { pdfjs } from 'react-pdf'
import 'draft-js/dist/Draft.css';
import localFont from 'next/font/local'
import classnames from 'classnames'
import Hotjar from '@hotjar/browser';

import ThemeProvider from '@/theme/theme-provider'
import Confirmable from '@/components/confirmable'
import * as SetupACompanyModal from '@/shared/setup-a-company-modal'
import Init from './init'
import Store from '@/store'
import styles from './layout.module.scss'
import * as CompanySetupModal from '@/shared/company-setup-modal';
import * as AllPlansModal from '@/shared/all-plans-modal';
import AmplitudeContextProvider from '@/contexts/AmplitudeContext';
import Favicon from '@/components/favicon';
import { isProduction } from '@/constants';

const siteId = 3823462;
const hotjarVersion = 6;
try {
  if (typeof window !== 'undefined') {
    if (isProduction) {
      Hotjar.init(siteId, hotjarVersion);
    }
  }
} catch (error) {
  console.log(error, "Hotjar init error")
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const neueHaasDisplay = localFont({
  src: [{
    path: './NeueHaasDisplay-Medium-Font.woff2',
    weight: 'normal',
    style: 'normal',
  }, {
    path: './NeueHaasDisplay-Roman-Font.woff2',
    weight: 'normal',
    style: 'normal',
  }],
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={styles.html} lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>SEEIO</title>
        <Favicon />
      </head>
      <body className={classnames(styles.body, neueHaasDisplay.className)}>
        <div id="preloading" className={styles.preloading}>
          <div className={styles.circle}></div>
        </div>
        <Store>
          <ThemeProvider>
            <AmplitudeContextProvider>
              <Init>
                {children}
              </Init>
            </AmplitudeContextProvider>
            <CompanySetupModal.default
              ref={(ref) => CompanySetupModal.setInstantce(ref)}
            />
            <SetupACompanyModal.default
              ref={(ref) => SetupACompanyModal.setInstantce(ref)}
            />
            <AllPlansModal.default
              ref={(ref) => AllPlansModal.setInstance(ref)}
            />
            <Confirmable
              ref={(ref) => Confirmable.setInstance(ref)}
            />
          </ThemeProvider>
        </Store>
      </body>
    </html>
  )
}

export default RootLayout
