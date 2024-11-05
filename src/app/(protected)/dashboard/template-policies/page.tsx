"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";

import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Table, { TColumn } from "@/components/table";
import { useBreadcrumbs } from "@/hooks";
import Status from "@/components/status"
import * as API from '@/api';
import Toast from "@/components/toast"
import { TPolicy } from "@/models"
import Typography from "@/components/typography";
import styles from "./page.module.scss"
import Misc from "@/utils/misc";

const SEARCH_OPTIONS = [{
  label: "Name",
  value: "title",
}, {
  label: "Type",
  value: "type",
}]

const Page = () => {
  const [policyData, setPolicyData] = useState<TPolicy[]>()
  const [initing, setIniting] = useState(false);
  const [search, setSearch] = useState("")
  const [typeSearch, setTypeSearch] = useState<string>("title")

  const route = useRouter()
  const breadcrumb = useBreadcrumbs()

  useEffect(() => {
    const fetchData = async () => {
      setIniting(true);
      try {
        const result = await API.getPolicyData();
        setPolicyData(result)
      } catch (error: any) {
        Toast.error(error?.message || "Something went wrong!")
      } finally {
        setIniting(false);
      }
    };
    fetchData()
  }, [])

  const columns = useMemo<TColumn<TPolicy>[]>(
    () => [
      {
        key: "title",
        title: "Document Title",
        width: 600,
        render: (record) => (
          <Typography>
            {record?.title?.length > 81 ? record?.title.slice(0, 80) + "..." : record?.title}

          </Typography>

        ),
      },
      {
        key: "type",
        title: "Type",
        width: 130
      },
      {
        key: "subscriptionLevel",
        title: "Subscription Level",
        width: 150,
        render: (record) => (
          <Typography style={{ color: "#749715" }} >{record?.subscriptionLevel ? record?.subscriptionLevel : "-"}</Typography>
        ),
      },
      {
        key: "status",
        title: "Status",
        width: 130,
        render: (record) => (
          <>
            {record?.status ? <Status title={`${record?.status}`} color="green" /> : <></>}
          </>
        )
      },
    ],
    []
  );

  const onRowClick = (recordItem: TPolicy) => {
    breadcrumb.set([
      { title: "Template policies", link: "/dashboard/template-policies" },
      {
        title: recordItem?.title,
        link: `/dashboard/template-policies/${recordItem?.id}`,
      },
    ])
    route.push(`/dashboard/template-policies/${recordItem.id}`)
  };

  const parsedData = useMemo(() => {
    return Misc.getFilteredData(policyData || [], search, '', typeSearch) || [];
  }, [policyData, search, typeSearch]);

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <Table
          rowKey="id"
          title="Template policies"
          columns={policyData ? columns : []}
          items={parsedData || []}
          loading={initing}
          showTableHeaders={policyData ? true : false}
          noDataProps={{
            title: "There are no Policies yet",
          }}
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
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <Space horizontal size={35} />
              <Typography gray>Search by:</Typography>
              <Space horizontal size={16} />
              <Select
                className={styles.sortSelect}
                size="large"
                bordered
                placeholder="Select"
                defaultValue={SEARCH_OPTIONS[0]?.value}
                value={typeSearch}
                onChange={(value) => setTypeSearch(value)}
                options={SEARCH_OPTIONS}
              />
            </>
          }
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
