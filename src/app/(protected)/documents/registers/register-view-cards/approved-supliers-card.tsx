"use client";

import React from "react";
import dayjs from "dayjs";

import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import VdrList from "@/shared/vdr-list"
import { TVdrs } from '@/models';

function ApprovedSupliersCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
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
              <Typography gray>Owner/Department</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.owner ? data.owner?.name : "-"}</Typography>
          </FlexBox>

        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Supplier Type</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.supplierType || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Review Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.reviewDate ? dayjs(data.reviewDate).format("DD/MM/YYYY") : "-"}
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
              <Typography gray>Contract Renewal Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data.contractRenewalDate ? dayjs(data.contractRenewalDate).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Date First Approved</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateFirstApproved ? dayjs(data.dateFirstApproved).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Date Last Reviewed</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateLastReviewed ? dayjs(data.dateLastReviewed).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>

        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Review Process</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.reviewProcess ? data.reviewProcess : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Notice Period</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.noticePeriod ?  data.noticePeriod : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>

        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          {data?.notes && (
            <>
              <FlexBox flexDirection="column" className={styles.content}>
                <FlexBox>
                  <Typography gray>Notes</Typography>
                </FlexBox>
                <Space size={5} />
                <Typography size="large">{data?.notes || "-"}</Typography>
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

export default ApprovedSupliersCard;
