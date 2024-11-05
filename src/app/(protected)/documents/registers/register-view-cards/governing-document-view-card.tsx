"use client";

import React from "react";
import moment from "moment";

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import DraftEditor from "@/components/draft-editor";
import { StatusDetail, getStatusDetails } from "@/utils/document";
import Status from "@/components/status";
import { TStorageObject, TVdrs } from "@/models";
import VdrList from "@/shared/vdr-list"


const GoverningDocumentViewCard = ({
  data,
  vdrList
}: {
  data: TStorageObject;
  vdrList?: TVdrs[]
}) => {
  const onClickStatus = () => {
    if (data) {
      const statusDetails: StatusDetail = getStatusDetails(data);
      return statusDetails;
    }
    return { color: "white", label: "-" }
  };

  const { color, label } = onClickStatus();

  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <Space size={24} />
        <FlexBox flexDirection="column" className={styles.infoBox}>
          <FlexBox justifyContent="space-between" className={styles.content}>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Name</Typography>
              </FlexBox>

              <Space size={5} />
              <Typography size="large">{data?.name}</Typography>
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Document Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">
                {data?.documentDate
                  ? moment(data.documentDate).format("DD/MM/YYYY")
                  : "-"}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox justifyContent="space-between" className={styles.content}>

            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Need Review</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">
                {data?.needReview ? "Yes" : "No"}
              </Typography>
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Review Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">
                {data?.reviewDate
                  ? moment(data.reviewDate).format("DD/MM/YYYY")
                  : "-"}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox justifyContent="space-between" className={styles.content}>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Status</Typography>
              </FlexBox>
              <Space size={10} />

              <Status title={label} color={color} className={styles.statusWidth} />
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Last Review </Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">
                {data?.lastReview
                  ? moment(data.lastReview).format("DD/MM/YYYY")
                  : "-"}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
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

          <Space size={25} />
          <VdrList vdrList={vdrList} />
        </FlexBox>
      </Container>
    </ScollablePage>
  );
};

export default GoverningDocumentViewCard;
