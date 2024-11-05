"use client";

import React from "react";
import moment from "moment";

import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import DraftEditor from "@/components/draft-editor";
import VdrList from "@/shared/vdr-list"
import { TVdrs } from '@/models';

function ResolutionRegisterCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
  return (
    <>
      <Space size={24} />
      <FlexBox flexDirection="column" className={styles.infoBox}>
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Resolution Number</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.resolutionNumber || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Resolution Name</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.name ?? "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Date Created</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateCreated ? moment(data?.dateCreated).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Circulation Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.circulationDate ? moment(data?.circulationDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Companies House Status</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.companiesHouse || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Type of resolution</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.typeOfResolution || "-"}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Status</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.status || "-"}</Typography>
          </FlexBox>
          {/* <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Resolution Number</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.resolutionNumber || "-"}</Typography>
          </FlexBox> */}
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Description</Typography>
            </FlexBox>
            <Space size={5} />
            <DraftEditor
              viewOnly
              defaultValue={data?.description || ""}
              wrapperClass={styles.fontSize}
            />
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <VdrList vdrList={vdrList} />

      </FlexBox>
      <Space size={24} />
    </>
  );
}

export default ResolutionRegisterCard;
