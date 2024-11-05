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

function IncidentRegisterCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
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
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Owner</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.owner?.name || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Plan</Typography>
            </FlexBox>
            <Space size={5} />
            <DraftEditor
              viewOnly
              defaultValue={data?.stakeholderManagementPlan || ""}
              wrapperClass={styles.fontSize}
            />
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Cause</Typography>
            </FlexBox>
            <Space size={5} />
            <DraftEditor
              viewOnly
              defaultValue={data?.causeOfIncident || ""}
              wrapperClass={styles.fontSize}
            />
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Lessons</Typography>
            </FlexBox>
            <Space size={5} />
            <DraftEditor
              viewOnly
              defaultValue={data?.lessonsLearned || ""}
              wrapperClass={styles.fontSize}
            />
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
              {data.cancelled ? "Yes" : "No"}
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
              <Typography gray>Stakeholders</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.stakeholders || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Start Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.startDate ? dayjs(data?.startDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <VdrList vdrList={vdrList} />

      </FlexBox>
      <Space size={24} />
    </>
  );
}

export default IncidentRegisterCard;
