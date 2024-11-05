"use client"

import { ConfigProvider } from 'antd';

import './antd-override.scss'
import variables from './variables.module.scss'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      token: {
        fontFamily: "Arial",
        borderRadius: 5,
        controlHeight: 44,
        controlHeightLG: 44,
        colorTextPlaceholder: variables.grayText,
        colorPrimary: variables.primaryColor,
      },
      components: {
        Button: {
          fontSize: 16,
          fontSizeLG: 20,
          colorBorder: "#9ec23b",
          lineWidth: 2,
          controlOutlineWidth: 0
        },
      }
    }}
  >
    {children}
  </ConfigProvider>
);

export default ThemeProvider;
