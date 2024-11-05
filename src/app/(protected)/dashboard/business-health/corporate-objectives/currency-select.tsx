import React, { useState, useMemo } from 'react'
import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

import FlexBox from '@/components/flex-box'
import Space from '@/components/space'
import Typography from '@/components/typography'
import { COUNTRY_CURRENCY_CODES } from '@/constants/country-currency-codes';

const { Option } = Select;

interface IProps {
  onChange?: (value: string) => void
  value?: string
}

const CurrencySelect = ({
  onChange,
  value,
  ...props
}: IProps): JSX.Element => {
  const [search, setSearch] = useState("")

  const filteredCurrencyCodes = useMemo(() => (
    COUNTRY_CURRENCY_CODES?.filter((currency) => currency.code.toLowerCase().includes(search.toLowerCase()))
  ), [search])

  return (
    <FlexBox>
      <Select
        {...props}
        size="large"
        style={{ width: "100%" }}
        placeholder='Select'
        onChange={(value) => onChange?.(value)}
        value={value || null}
        dropdownRender={(menu) => (
          <>
            <Input
              allowClear
              size="small"
              placeholder="Search"
              prefix={<SearchOutlined style={{ color: 'gray' }} />}
              onChange={(e) => setSearch(e.target.value)}
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
        {filteredCurrencyCodes.map((option) => (
          <Option key={option.code} value={option.code}>
            <FlexBox>
              <Typography gray>{`(${option.symbol})`}</Typography>
              <Space horizontal size={6} />
              <Typography>{option.code}</Typography>
            </FlexBox>
          </Option>
        ))}
      </Select>

    </FlexBox>
  )
}

export default CurrencySelect
