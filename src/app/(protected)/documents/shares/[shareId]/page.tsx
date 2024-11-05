"use client";

import React, { useMemo, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Badge, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import moment from "moment";

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import TableWithHeaderControls from "@/shared/table/table";
import Clickable from "@/components/clickable";
import { TColumn } from "@/components/table";
import Status from "@/components/status";
import styles from "./page.module.scss";
import Space from "@/components/space";
import Icon from "@/components/icon";
import Misc from "@/utils/misc";
import { useBreadcrumbs } from "@/hooks";
import BreadCrumbs from "@/shared/global-breadcrumbs";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";

const SHARES_LIST = [
  {
    id: 1,
    name: "Share Allotment",
    date: new Date(),
    status: "up to date",
  },
  { id: 2, name: "Share Transfer", date: new Date(), status: "to do items" },
  {
    id: 3,
    name: "Exercise Options/Convertible Loan Conversion",
    date: new Date(),
    status: "up to date",
  },
];

const Page = ({ params: { shareId } }: { params: { shareId: string } }) => {
  const [search, setSearch] = useState("");
  const [selectedSortValue, setSelectedSortValue] = useState<
    string | undefined
  >();

  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();

  const parsedData = useMemo(() => {
    return Misc.getFilteredData(SHARES_LIST, search, selectedSortValue);
  }, [search, selectedSortValue]);

  const columns = useMemo<TColumn<any>[]>(
    () => [
      {
        key: "type",
        width: 40,
        noPadding: true,
        render: () => (
          <Icon
            name={`gray-document-icon`}
            alt="icon"
            size={24}
            className={styles.marginLeft16}
          />
        ),
      },
      {
        key: "name",
        title: "Name",
        width: 250,
      },
      {
        key: "dateCreated",
        title: "Date Created",
        render: (record) => moment(record.dateCreated).format("DD/MM/YYYY"),
      },
      {
        key: "avatars",
        title: "Users",
        render: () => (
          <Badge
            count={"All Users"}
            title={"Individual User Selection coming in a future update."}
            showZero
            color="#52c41a"
          />
        ),
      },
      {
        key: "statusLabel",
        title: "Status",
        width: 170,
        render: (record) => {
          let colors;
          if (record?.status === "up to date") {
            colors = "green";
          } else if (record?.status === "to do items") {
            colors = "red";
          } else {
            colors = "yellow";
          }
          return record?.status ? (
            <Status
              title={record.status}
              className={styles.statusWidth}
              color={colors}
            />
          ) : (
            "-"
          );
        },
      },
      {
        width: 73,
        render: (record) => (
          <Dropdown
            menu={{
              items: [
                {
                  label: "Edit",
                  key: "1",
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                  },
                },
                {
                  label: "Delete",
                  key: "2",
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                  },
                },
              ],
            }}
            trigger={["click"]}
          >
            <Clickable
              className={styles.optionButton}
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisOutlined />
            </Clickable>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const onRowClick = (recordItem: any) => {
    if (+shareId === 1) {
      if (recordItem?.id === 1) {
        router.push(`/documents/shares/${shareId}/share-allotment`);
        breadcrumbs.add({
          title: `${recordItem.name}`,
          link: `/documents/shares/${shareId}/share-allotment`,
        });
      } else if (recordItem?.id === 2) {
        router.push(`/documents/shares/${shareId}/share-transfer`);
        breadcrumbs.add({
          title: `${recordItem.name}`,
          link: `/documents/shares/${shareId}/share-transfer`,
        });
      } else {
        router.push(`/documents/shares/${shareId}/other-shares`);
        breadcrumbs.add({
          title: `${recordItem.name}`,
          link: `/documents/shares/${shareId}/other-shares`,
        });
      }
    }
  };

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox alignItems="center" justifyContent="space-between">
          <BreadCrumbs />
          <Button className={styles.updateBtn}>Update registers</Button>
        </FlexBox>
        <Space size={32} />
        <TableWithHeaderControls
          onRowClick={onRowClick}
          title={"Shares"}
          data={parsedData}
          initing={false}
          search={search}
          setSearch={setSearch}
          columns={columns}
          selectedSortValue={selectedSortValue}
          setSelectedSortValue={setSelectedSortValue}
          id="row0"
        />
        <Space size={20} />
      </Container>
    </ScollablePage>
  );
};

export default Page;
