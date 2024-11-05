import React, { useMemo } from "react";
import { Switch, Select, Row, Col } from "antd"

import styles from "./page.module.scss";
import Typography from "@/components/typography";
import Chart from "@/components/chart/line-chart";
import FlexBox from "@/components/flex-box";
import Clickable from "@/components/clickable"
import Icon from "@/components/icon"
import Space from "@/components/space"
import { SYMBOLS } from '@/constants';
import { Currency } from '@/models';

interface IProps {
  handleOpenGraphModal: (data: any, axis?: boolean) => void;
  setGraphTittle: any;
  setGraphType: any;
  data: any;
  modalData: any;
  type: string;
  cardTitle: string;
  handleToggle?: () => void,
  handleCurrencyChange?: (newValue: Currency) => void;
  showAxis?: boolean
  toggle?: boolean
  currency: Currency;
  showBaseCurrency?: boolean
  details?: {
    availableCashBalance: number,
    cashMovement: number,
    runway: number | string,
    cashReserve: number | string,
  }
}
export function formatNumberWithCommas(number: number) {
  const number1 = Math.floor(number)
  return number1.toLocaleString()
}

export const currencyOptions = [
  {
    label: "GBP",
    value: "GBP"
  },
  {
    label: "USD",
    value: "USD"
  },
  {
    label: "EURO",
    value: "EURO"
  },
]


const RenderPrice = ({ text, showCurrency, currency }: { text?: number, showCurrency?: boolean, currency: Currency }) => {
  if (!text && text !== 0) {
    return <Typography size="huge" color="#00293F" bold>{'-'}</Typography>
  }

  return text < 0
    ? <Typography size="huge" color="#df3d30" bold>{`${showCurrency ? SYMBOLS[currency] : ""} `
      + formatNumberWithCommas(Number(text))}</Typography>
    : <Typography size="huge" color="#00293F" bold>{`${showCurrency ? SYMBOLS[currency] : ""} `
      + formatNumberWithCommas(Number(text))}</Typography>

}

const Graph = ({
  handleOpenGraphModal,
  setGraphTittle,
  setGraphType,
  data,
  modalData,
  cardTitle,
  type,
  handleToggle,
  toggle,
  showBaseCurrency,
  currency,
  showAxis = false,
  handleCurrencyChange,
  details
}: IProps) => {
  const options = useMemo(() => {
    return {
      scales: {
        x: {
          display: true,
        },
        y: {
          display: true,
          ticks: {
            callback: (value: any) => `${SYMBOLS[currency || "GBP"]} ${value}`,
          },
        },
        y1: showAxis && {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            callback: (value: any) => `${SYMBOLS[currency || "GBP"]} ${value}`,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      radius: 2,
    }
  }, [currency, showAxis])

  const setOpenGraph = () => {
    handleOpenGraphModal(modalData, showAxis);
    setGraphTittle(cardTitle);
    setGraphType(type);
  }

  return (
    <div className={styles.card}>
      <FlexBox flexDirection="column" gap={24}>
        <FlexBox justifyContent="space-between">
          <FlexBox alignItems="center" >

            <Typography color="#00293F" className={styles.title} size="large">
              {cardTitle}
            </Typography>

          </FlexBox>
          {handleToggle && (
            <FlexBox alignItems="center" justifyContent="center">
              <Space size={14} horizontal />
              <Switch checked={toggle} onChange={handleToggle} />
              <Space size={14} horizontal />
              <Typography size='large' color="#00293F">{toggle ? 'Average' : 'Latest'}</Typography>
              <Space size={14} horizontal />
            </FlexBox>
          )}

          {
            showBaseCurrency && (
              <FlexBox alignItems="center" justifyContent="center" flexDirection='row'>
                Currency
                <Space size={8} horizontal />
                <Select
                  className={styles.w_100}
                  size="middle"
                  placeholder="Base currency"
                  options={currencyOptions}
                  onChange={handleCurrencyChange}
                  value={currency}
                />
              </FlexBox>
            )
          }
          {data ? <Clickable onClick={setOpenGraph}>
            <Icon name='arrow-move-icon' />
          </Clickable> : <></>}
        </FlexBox>

        {data ? <Chart
          type={type === 'line' ? 'line' : 'bar'}
          data={data}
          options={options as Chart.ChartOptions}
        /> :
          <FlexBox alignItems='center' gap={15} justifyContent="center" flexDirection="column">
            <Space size={24} />

            <FlexBox justifyContent="space-between" width={330}>
              <Typography size="small" color="grey">{"Available cash balance (AC)"}</Typography>
              <RenderPrice currency={currency} text={Number(details?.availableCashBalance)} showCurrency={true} />
            </FlexBox>
            <FlexBox justifyContent="space-between" width={330}>
              <Typography size="small" color="grey">{"Monthly cash movement"}</Typography>
              <RenderPrice currency={currency} text={Number(details?.cashMovement)} showCurrency={true} />
            </FlexBox>
            <FlexBox justifyContent="space-between" width={330}>
              <Typography size="small" color="grey">{"Runway"}</Typography>
              <RenderPrice currency={currency} text={Number(details?.runway)} showCurrency={false} />
            </FlexBox>
            <FlexBox justifyContent="space-between" width={330}>
              <Typography size="small" color="grey">{"Cash reserve"}</Typography>
              <RenderPrice currency={currency} text={Number(details?.cashReserve)} showCurrency={false} />
            </FlexBox>
          </FlexBox>

        }
      </FlexBox>
    </div>
  );
};


export default Graph;
