import React, { useState, useMemo } from 'react'
import classnames from 'classnames'
import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import { COUNTRY_PHONE_CODES } from '@/constants'
import styles from './phone-input.module.scss'

const { Option } = Select;

interface IProps {
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  status?: "" | 'error' | 'warning'
}

const PhoneInput = ({
  className,
  onChange,
  placeholder,
  status = ""
}: IProps): JSX.Element => {
  const [search, setSearch] = useState("")
  const [phone, setPhone] = useState("+44")
  const [selectedCode, setSelectedCode] = useState<string | null>('GB')

  const filteredCountryPhoneCodes = useMemo(() => (
    COUNTRY_PHONE_CODES.filter((code) => code.short.toLowerCase().includes(search.toLowerCase()))
  ), [search])

  const onCodeChange = (value: string) => {
    setSelectedCode(value)
    const findedCode = COUNTRY_PHONE_CODES.find((code) => code.short === value)

    if (!findedCode) return

    setPhone(`+${findedCode.value}`)
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
    setPhone(e.target.value)
  }

  return (
    <FlexBox
      className={classnames(
        styles.phoneInput,
        className
      )}
    >
      <Select
        size="large"
        style={{ width: 80 }}
        dropdownMatchSelectWidth={false}
        onChange={onCodeChange}
        value={selectedCode}
        dropdownRender={(menu) => (
          <>
            <Input
              allowClear
              size="small"
              placeholder="Search"
              prefix={<SearchOutlined style={{ color: 'gray' }} />}
              onChange={(e) => setSearch(e.target.value)}
              status={status}
            />
            <div
              style={{
                margin: '6px 0',
                height: 1,
                background: 'rgba(128, 128, 128, 0.2)',
              }}
            />
            {menu}
          </>
        )}
      >
        {filteredCountryPhoneCodes.map((option) => (
          <Option key={option.short} value={option.short}>
            <FlexBox>
              <Typography>{option.emoji}</Typography>
              <Space horizontal size={6} />
              <Typography>{option.short}</Typography>
            </FlexBox>
          </Option>
        ))}
      </Select>
      <Space horizontal size={10} />
      <Input
        size="large"
        style={{ flex: 1 }}
        value={phone}
        placeholder={placeholder}
        onChange={onTextChange}
      />
    </FlexBox>
  )
}

export default PhoneInput
