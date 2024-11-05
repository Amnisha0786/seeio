"use client";

import React, { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Input, Select } from "antd";
import moment from "moment";

import Clickable from "@/components/clickable";
import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import Table, { TColumn } from "@/components/table";
import { useBreadcrumbs, useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import Typography from "@/components/typography";
import Icon from "@/components/icon";
import BreadCrumbs from "@/shared/global-breadcrumbs";

const ALLOTMENTS_LIST = [
  {
    id: 1,
    date: new Date(),
    memberName: "James Hall",
    status: "up to date",
    currency: "$2,203.25",
    shareClass: "Lorem ipsum",
    amountPaid: "$2,203.25",
    amountUnpaid: "$2,203.25",
    total: "$2,203.25",
  },
  {
    id: 2,
    date: new Date(),
    memberName: "James Hall",
    status: "up to date",
    currency: "$2,203.25",
    shareClass: "Lorem ipsum",
    amountPaid: "$2,203.25",
    amountUnpaid: "$2,203.25",
    total: "$2,203.25",
  },
  {
    id: 3,
    date: new Date(),
    memberName: "James Hall",
    status: "up to date",
    currency: "$2,203.25",
    shareClass: "Lorem ipsum",
    amountPaid: "$2,203.25",
    amountUnpaid: "$2,203.25",
    total: "$2,203.25",
  },
];

const Page = ({ params: { shareId } }: { params: { shareId: string } }) => {
  const [data, setData] = useState<any[]>([]);

  const companyId = useSelectedAccountCompany()?.companyId;
  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();

  const columns = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "date",
        title: "Date of allotment",
        render: (record) => moment(record?.date).format("DD/MM/YYYY"),
      },
      {
        key: "memberName",
        title: "Member name",
        render: (record) => record?.memberName,
      },
      {
        key: "currency",
        title: "Currency",
        render: (record) => record?.currency,
      },
      {
        key: "shareClass",
        title: "Share class",
        render: (record) => record?.shareClass,
      },
      {
        key: "shareClass",
        title: "No Shares",
        render: (record) => record?.shareClass,
      },
      {
        key: "amountPaid",
        title: "Amount Paid on each share",
        render: (record) => record?.amountPaid,
      },
      {
        key: "amountUnpaid",
        title: "Amount unpaid on each share",
        render: (record) => record?.amountUnpaid,
      },
      {
        key: "total",
        title: "Total consideration paid",
        render: (record) => record?.total,
      },
    ],
    []
  );

  const columnsOfUpdatedStatement = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "shareClass",
        title: "Share class",
        render: (record) => record?.shareClass,
      },
      {
        key: "shareClass",
        title: "No shares (in share class)",
        render: (record) => record?.shareClass,
      },
      {
        key: "total",
        title: "Aggregate Nominal Value",
        render: (record) => record?.total,
      },
    ],
    []
  );

  const onRowClick = (recordItem: any) => {
    if (recordItem?.id === 1) {
      router.push(
        `/documents/shares/${shareId}/share-allotment/${recordItem?.id}`
      );
      breadcrumbs.add({
        title: `${recordItem?.memberName}`,
        link: `/documents/shares/${shareId}/share-allotment/${recordItem?.id}`,
      });
    }
  };

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <BreadCrumbs />
        <Space size={32} />
        <Table
          rowKey="id"
          allowSelect
          title="Allotments"
          columns={columns}
          items={ALLOTMENTS_LIST}
          loading={false}
          onRowClick={onRowClick}
          headerRight={
            <>
              <Input
                allowClear
                className={styles.searchInput}
                bordered
                size="large"
                placeholder="Type to search..."
                prefix={<SearchOutlined />}
              />
              <Space horizontal size={24} />
              <Typography gray>Sort by:</Typography>
              <Space horizontal size={16} />
              <Select
                allowClear
                className={styles.sortSelect}
                size="large"
                bordered
                placeholder="Select"
                options={[
                  {
                    label: "Recently",
                    value: 1,
                  },
                  {
                    label: "Name",
                    value: 2,
                  },
                ]}
              />
              <Space horizontal size={24} />
              <Clickable>
                <Typography gray size="large">
                  Select All
                </Typography>
              </Clickable>
              <Space horizontal size={24} />
              <Clickable>
                <Icon name="gray-delete-icon" size={24} />
              </Clickable>
            </>
          }
        />
        <Space size={32} />
        <Table
          rowKey="id"
          allowSelect
          title="Updated statement of Capital"
          columns={columnsOfUpdatedStatement}
          items={ALLOTMENTS_LIST}
          loading={false}
          onRowClick={onRowClick}
          headerRight={
            <>
              <Input
                allowClear
                className={styles.searchInput}
                bordered
                size="large"
                placeholder="Type to search..."
                prefix={<SearchOutlined />}
              />
              <Space horizontal size={24} />
              <Typography gray>Sort by:</Typography>
              <Space horizontal size={16} />
              <Select
                allowClear
                className={styles.sortSelect}
                size="large"
                bordered
                placeholder="Select"
                options={[
                  {
                    label: "Recently",
                    value: 1,
                  },
                  {
                    label: "Name",
                    value: 2,
                  },
                ]}
              />
              <Space horizontal size={24} />
              <Clickable>
                <Typography gray size="large">
                  Select All
                </Typography>
              </Clickable>
              <Space horizontal size={24} />
              <Clickable>
                <Icon name="gray-delete-icon" size={24} />
              </Clickable>
            </>
          }
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
