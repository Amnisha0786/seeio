"use client";

import React from "react";
import dayjs from "dayjs";

import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import DraftEditor from "@/components/draft-editor";
import VdrList from "@/shared/vdr-list"
import { TVdrs } from '@/models';
import { CONTRACT_STATUS_TYPES, REVIEW_PROCESS_TYPES } from "../register-forms/contract-document-form"

function ContractRegisterCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
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
              <Typography gray>Term</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.term || "-"} {data?.termDuration || ""}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Terminated</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {(data?.status?.toLowerCase() === CONTRACT_STATUS_TYPES.TERMINATED.toLowerCase()) ? "Yes" : "No"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Auto Renewal</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.reviewProcess?.toLowerCase() === REVIEW_PROCESS_TYPES.AUTO_RENEWS.toLowerCase() ? "Yes" : "No"}
            </Typography>
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
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Start Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.startDate ? dayjs(data.startDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Expiry Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.expiryDate ? dayjs(data.expiryDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Last Review Date</Typography>
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
              <Typography gray>Next Review Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.nextReview ? dayjs(data.nextReview).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Parties</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.parties || "-"}</Typography>
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
              defaultValue={data?.description || ""}
              wrapperClass={styles.fontSize}
            />
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Owner/Department</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.owner ? data?.owner?.name : "-"}</Typography>
          </FlexBox>
        </FlexBox>

        <Space size={25} />
        <VdrList vdrList={vdrList} />

      </FlexBox>
      <Space size={24} />
    </>
  );
}

export default ContractRegisterCard;
