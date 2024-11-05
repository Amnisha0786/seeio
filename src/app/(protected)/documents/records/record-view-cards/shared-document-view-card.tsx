"use client";

import React from "react";

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import { TRecordDocument, TVdrs } from "@/models";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import moment from 'moment';
import VdrList from "@/shared/vdr-list"

const SharedDocumentsViewCard = ({
  data,
  vdrList
}: {
  data: TRecordDocument | undefined;
  vdrList?: TVdrs[]
}) => {
  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <Space size={24} />
        <FlexBox flexDirection="column" className={styles.infoBox}>
          <FlexBox justifyContent="space-between" className={styles.content}>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.date || data?.documentDate
                  ? moment(data?.date).format('DD/MM/YYYY') ||
                  moment(data?.documentDate).format('DD/MM/YYYY')
                  : '-'}
              </Typography>
            </FlexBox>

            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Review Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.reviewDate
                  ? moment(data?.reviewDate).format('DD/MM/YYYY')
                  : '-'}
              </Typography>
            </FlexBox>

            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Last Review </Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.lastReview
                  ? moment(data?.lastReview).format('DD/MM/YYYY')
                  : '-'}
              </Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox justifyContent='space-between' className={styles.content}>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Active</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.active ? 'Yes' : 'No'}
              </Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Need Review</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.needReview ? 'Yes' : 'No'}
              </Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Review Frequency</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.reviewFrequency || "-"}</Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox justifyContent="space-between" className={styles.content}>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Type</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.type || "-"}</Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Description</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.description || "-"}</Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Owner/Department</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.owner?.name || "-"}</Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <VdrList vdrList={vdrList} />

        </FlexBox>
        <Space size={24} />
      </Container>
    </ScollablePage>
  );
};

export default SharedDocumentsViewCard;
