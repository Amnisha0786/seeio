"use client";

import React from "react";
import dayjs from "dayjs";

import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import { frequencyOptions } from "../register-forms/contract-document-form"
import VdrList from "@/shared/vdr-list"
import { TVdrs } from '@/models';

interface Frequency {
  value: number,
  label: string
}

function PoliciesProcedureCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
  const renderFrequency = (frequency: number) => {
    const result: Frequency[] = frequencyOptions.filter((fre) => fre.value === frequency)
    return result[0]?.label
  }

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
              <Typography gray>Next Review Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.nextReview ? dayjs(data.nextReview).format("DD/MM/YYYY") : "-"}
            </Typography>
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
              <Typography gray>Review Frequency</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{renderFrequency(data?.reviewFrequency) || "-"}</Typography>
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
          {/* <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Frequency Duration</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.frequencyDuration || "-"}</Typography>
          </FlexBox> */}
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>

          {data?.lastReview && (
            <>
              <FlexBox flexDirection="column" className={styles.content}>
                <FlexBox>
                  <Typography gray>Last Review Date</Typography>
                </FlexBox>
                <Space size={5} />
                <Typography size="large">
                  {dayjs(data.lastReview).format("DD/MM/YYYY")}
                </Typography>
              </FlexBox>
            </>
          )}
        </FlexBox>

        <Space size={25} />
        <VdrList vdrList={vdrList} />

      </FlexBox>
      <Space size={24} />
    </>
  );
}

export default PoliciesProcedureCard;
