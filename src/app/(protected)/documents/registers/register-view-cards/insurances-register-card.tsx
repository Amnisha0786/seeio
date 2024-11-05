"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";

import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import Status from "@/components/status";
import { StatusDetail, getStatusDetails } from "@/utils/document";
import DraftEditor from "@/components/draft-editor"
import VdrList from "@/shared/vdr-list"
import { TVdrs } from '@/models';

function InsurancesRegisterCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
  const showStatus = useMemo(() => {
    if (data) {
      const statusDetails: StatusDetail = getStatusDetails(data);
      return statusDetails;
    }
    return { color: "white", label: "-" }
  }, [getStatusDetails])

  const { color, label } = showStatus;

  return (
    <>
      <Space size={24} />
      <FlexBox flexDirection="column" className={styles.infoBox}>
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Name</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data.name}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Owner</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.owner?.name || "-"}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Cancelled</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data.cancelled ? " Yes" : "No"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Expiry Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.expiryDate ? dayjs(data.expiryDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Start Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.startDate ? dayjs(data.startDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Last Review</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.lastReview ? dayjs(data.lastReview).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Next Review</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.nextReview ? dayjs(data.nextReview).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Status</Typography>
            </FlexBox>
            <Space size={5} />
            <Space size={10} />

            <Status title={label} color={color} className={styles.statusWidth} />
          </FlexBox>

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
              defaultValue={data?.description}
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

export default InsurancesRegisterCard;
