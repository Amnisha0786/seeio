"use client";
import React, { useMemo, useEffect, useState } from "react";
import type { RadioChangeEvent } from 'antd';

import styles from "./page.module.scss";
import Space from "@/components/space";
import Container from "@/components/container";
import Typography from "@/components/typography";
import Table, { TColumn } from "@/components/table";
import Clickable from "@/components/clickable"
import Icon from "@/components/icon"
import ScollablePage from "@/components/scollable-page"
import MockApi from "@/utils/mock-api"
import BreadCrumbs from "@/components/breadcrumbs"

const Page = () => {
  const [initing, setIniting] = useState(true);
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [data, setData] = useState<any[]>([]);
  const dummyData = [
    {
      id: 1,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastIncident: "05/08/2022",
      lastUpdate: '05/08/2022'
    },
    {
      id: 1,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastComplaint: "05/08/2024",
      lastUpdate: '05/08/2022'
    },
    {
      id: 2,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastComplaint: "05/08/2023",
      lastUpdate: '05/08/2022'
    }
    , {
      id: 3,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastIncident: "05/08/2022",
      lastUpdate: '05/08/2022'
    },
    {
      id: 4,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastComplaint: "05/08/2023",
      lastUpdate: '05/08/2022'
    }, {
      id: 5,
      name: "Lorem ipsum dolor sit.",
      details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. nobis Optio ullam voluptatem soluta  ipsam eum asperiores ",
      lastComplaint: "05/08/2023",
      lastUpdate: '05/08/2022'
    }
  ]
  const getInvestors = () => {
    return MockApi({
      data: dummyData
    })
  }

  const fetchData = async (type?: string) => {
    setIniting(true);
    try {
      const result = await getInvestors();
      if (type === 'lastIncident') {
        setData(result.filter((item) => item.hasOwnProperty("lastIncident")))
      } else {
        setData(result.filter((item) => item.hasOwnProperty("lastComplaint")))
      }
    } finally {
      setIniting(false);
    }
  };

  const shiftTab = (currentTab: number) => {
    switch (currentTab) {
    case 1:
    {
      fetchData('lastComplaint')
      break;
    }
    case 2:
    {
      fetchData('lastIncident')
      break;
    }
    default:
      fetchData('lastComplaint')
    }
  }

  useEffect(() => {
    shiftTab(currentTab)
  }, [currentTab]);

  const columns = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "name",
        title: "Name",
        width: 202,
      },
      {
        key: "details",
        title: "Details",
        width: 666,
        render: (record) => <>
          <Typography >
            {record.details.length > 100 ? record.details.slice(0, 102) + "..." : record.details}
          </Typography>
        </>
      },
      {
        key: `${currentTab === 1 ? "lastComplaint" : 'lastIncident'}`,
        title: `${currentTab === 1 ? "Last Complaint" : 'Last Incident'}`,
        width: 150,
      },
      {
        key: "lastUpdate",
        title: "Last Update",
        width: 127
      },
    ],
    [currentTab]
  );

  const handleTabClick = (e: RadioChangeEvent) => {
    setCurrentTab(e.target.value)
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <BreadCrumbs
          items={[
            { title: "Investor", link: "/dashboard" },
            {
              title: "Complaint & Incident",
              link: "/investor/complaint-incident",
            },
          ]}
          activeItem="Complaint & Incident"
        />
        <Space size={25} />
        <Table
          rowKey="id"
          allowSelect
          title="Complaint & Incident"
          columns={columns}
          items={data}
          loading={initing}
          tabs={["Complaint", "Incident"]}
          onTabClick={handleTabClick}
          currentTab={currentTab}
          headerBottom={
            <>
              <Clickable>
                <Icon name="gray-search-icon" size={24} />
              </Clickable>
              <Space horizontal size={24} />

              <Clickable>
                <Icon name="gray-filter-icon" size={24} />
              </Clickable>
              <Space horizontal size={24} />
              <Clickable>
                <Typography gray size="large">
                  Delete
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