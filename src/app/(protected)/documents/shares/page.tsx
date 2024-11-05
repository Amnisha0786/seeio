"use client";

import { useEffect } from "react";
import { Col, Row } from "antd";
import Link from "next/link";

import Typography from "@/components/typography";
import styles from "./page.module.scss";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Container from "@/components/container";
import FlexBox from "@/components/flex-box";
import Status from "@/components/status";
import { useBreadcrumbs } from "@/hooks";

const SHARES = [
  {
    id: 1,
    name: "Update Share Registers",
    file: 204,
    status: "up to date",
  },
  {
    id: 2,
    name: "View Share Registers",
    file: 204,
    status: "105 days overdue",
  },
];

const Page = () => {
  const breadcrumbs = useBreadcrumbs();

  const getStatusColor = (status: string) => {
    if (status === "up to date") {
      return "green";
    } else if (status === "105 days overdue") {
      return "red";
    }
    return "yellow";
  };

  useEffect(() => {
    breadcrumbs.set([
      {
        title: "Shares",
        link: "/documents/shares",
      },
    ]);
  }, []);

  const onItemClick = (item: any) => {
    breadcrumbs.add({
      title: item?.name,
      link: `/documents/shares/${item.id}`,
    });
  };

  return (
    <ScollablePage>
      <Space size={32} />
      <Space size={36} />
      <Container>
        <Row gutter={[24, 24]}>
          {SHARES?.map((item) => (
            <Col span={6} key={item?.id}>
              <Link
                href={{
                  pathname: `/documents/shares/${item?.id}`,
                }}
                className={styles.roomBox}
                onClick={() => onItemClick && onItemClick(item)}
              >
                <Typography size="huge">{item?.name}</Typography>
                <Space size={16} />
                <Typography size="large" gray>
                  {item?.file} files
                </Typography>
                <Space size={16} />
                <FlexBox>
                  <Status
                    className={styles.statusBox}
                    title={item?.status}
                    color={getStatusColor(item?.status)}
                  />
                </FlexBox>
                <Space size={24} />
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </ScollablePage>
  );
};

export default Page;
