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

function ComplaintsRegisterCard({ data, vdrList }: { data: any, vdrList?: TVdrs[] }) {
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
              <Typography gray>Email</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.complainantEmail || "-"}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Phone</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.complainantPhone || "-"}</Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Address</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.complainantAddress || "-"}</Typography>
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
              <Typography gray>Details</Typography>
            </FlexBox>
            <Space size={5} />
            <DraftEditor
              viewOnly
              defaultValue={data?.complaintDetails || ""}
              wrapperClass={styles.fontSize}
            />
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Acknowledgement Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateOfAcknowledgement ? dayjs(data.dateOfAcknowledgement).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Resolution Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateOfResolution ? dayjs(data.dateOfResolution).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Complaint Date</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.dateOfComplaint ? dayjs(data.dateOfComplaint).format("DD/MM/YYYY") : "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Proposed Solution</Typography>
            </FlexBox>
            <Space size={5} />
            {data?.proposedSolution ? <DraftEditor
              viewOnly={true}
              defaultValue={data?.proposedSolution}
              wrapperClass={styles.fontSize}
            /> : <Typography size="large">
              -
            </Typography>}
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Reference</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">
              {data?.complaintReferenceNumber || "-"}
            </Typography>
          </FlexBox>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Complaint About</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.whoIsComplaintAbout || "-"}</Typography>
          </FlexBox>
        </FlexBox>
        <Space size={25} />
        <FlexBox justifyContent="space-between" className={styles.content}>
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Result</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.result || "-"}</Typography>
          </FlexBox>
        </FlexBox>

        <Space size={25} />
        <VdrList vdrList={vdrList} />

      </FlexBox>
      <Space size={24} />
    </>
  );
}

export default ComplaintsRegisterCard;
