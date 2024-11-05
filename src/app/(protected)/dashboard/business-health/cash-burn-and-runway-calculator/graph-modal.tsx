import React, { useMemo } from "react";

import styles from "./page.module.scss";
import Chart from "@/components/chart/line-chart";
import FlexBox from "@/components/flex-box";
import Modal from "@/components/modal";
import Typography from "@/components/typography";
import { Currency } from '@/models';
import { SYMBOLS } from '@/constants';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface IProps {
  data?: ChartData;
  open: any;
  setOpen: () => void;
  tittle: string;
  type: string;
  currency: Currency;
}

const CalculationGraphModal = ({
  data,
  open,
  setOpen,
  tittle,
  type,
  currency,
}: IProps) => {
  const options = useMemo(() =>{
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
        y1: {
          type: 'linear',
          display: tittle === 'Cash Balance (monthly)' ? true : false,
          position: 'right',
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
  }, [currency,tittle])

  return (
    <Modal open={open} onCancel={setOpen}>
      <FlexBox flexDirection="column">
        <FlexBox justifyContent="space-between">
          <FlexBox alignItems="center" gap={2}>
            <Typography color="#00293F" className={styles.title} size="large">
              {tittle}
            </Typography>
          </FlexBox>
        </FlexBox>

        <Chart
          type={type === "line" ? "line" : "bar"}
          data={data}
          options={options as Chart.ChartOptions}
        />
      </FlexBox>
    </Modal>
  );
};

export default CalculationGraphModal;
