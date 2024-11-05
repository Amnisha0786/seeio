"use client";

import { Col } from "antd";
// import { EllipsisOutlined } from "@ant-design/icons";
// import type { MenuProps } from "antd";
import Link from "next/link";

import Typography from "@/components/typography";
import Space from "@/components/space";
// import Clickable from "@/components/clickable";
import Icon from "@/components/icon";
import FlexBox from "@/components/flex-box";
import styles from "./page.module.scss";
import { TRecords } from "@/models";
import { TRegister } from "@/models/registers/register";

// const actionOptions: MenuProps["items"] = [
//   {
//     label: "Rename",
//     key: "0",
//   },
//   {
//     label: "Delete",
//     key: "1",
//   },
// ];

interface TProps {
  redirectLink: "/documents/registers" | "/documents/records";
  records: TRegister[] | TRecords[];
  onItemClick?: (item: any, index: number) => void;
}

const FolderIcons = ({ records, redirectLink, onItemClick }: TProps) => {
  // const getStatusColor = (status: string) => {
  //   if (status === "overdue") {
  //     return "red";
  //   } else if (status === "todo") {
  //     return "yellow";
  //   }
  //   return "green";
  // };

  return (
    <>
      {records?.map((record: any, index: number) => (
        <Col span={6} key={record.id}>
          <Link
            href={{
              pathname: `${redirectLink}/${record.id}`,
            }}
            className={styles.roomBox}
            onClick={() => onItemClick && onItemClick(record, index)}
          >
            <FlexBox justifyContent="space-between" alignItems="center">
              <Icon name="gray-folder-icon" size={32} />
              {/* <Dropdown menu={{ items: actionOptions }} trigger={["click"]}>
                <Clickable
                  className={styles.optionButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <EllipsisOutlined />
                </Clickable>
              </Dropdown> */}
            </FlexBox>
            <Space size={16} />
            <Typography size="huge">{record.name}</Typography>
            <Space size={16} />
            {/* <Typography size="large" gray>
              {record.numFiles} files
            </Typography> */}
            {/* <Space size={16} />
            <FlexBox>
              <Status
                className={styles.statusBox}
                title={record.statusText}
                color={getStatusColor(record.status)}
              />
            </FlexBox> */}
          </Link>
        </Col>
      ))}
      <Space size={50} />
    </>
  );
};

export default FolderIcons;
