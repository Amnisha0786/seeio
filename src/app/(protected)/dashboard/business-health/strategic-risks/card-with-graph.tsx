import React from 'react'
import { Col, Row, Card } from "antd";

import styles from "./page.module.scss";
import Typography from "@/components/typography";
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
  data?: ChartData,
  cardTitle: string,
  amount: string,
}

const CardWithGraph = ({
  cardTitle = "",
  amount = "",
}: IProps) => {

  return (
    <Card className={styles.card}>
      <Row gutter={16}>
        <Col span={24}>
          <Typography
            size="large"
            className={styles.title}
          >
            {cardTitle}
          </Typography>
          <Typography
            size="enormous"
            bold
            color='#121212'
          >
            {amount}
          </Typography>
        </Col>
      </Row>
    </Card>
  )
}

export default CardWithGraph