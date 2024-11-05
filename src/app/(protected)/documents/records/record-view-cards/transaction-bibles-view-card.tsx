"use client";

import React from "react";

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import { TRecordDocument, TVdrs } from "@/models";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import moment from "moment";
import VdrList from "@/shared/vdr-list"

const TransactionBiblesViewCard = ({
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
                <Typography gray>Name</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.name}</Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>
                {data?.date ? moment(data?.date).format('DD/MM/YYYY') : '-'}
              </Typography>
            </FlexBox>
            <FlexBox flexDirection='column' className={styles.content}>
              <FlexBox>
                <Typography gray>Type</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size='large'>{data?.type || "-"}</Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox flexDirection='column' className={styles.content}>
            <FlexBox>
              <Typography gray>Description</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size='large'>{data?.description || "-"}</Typography>
          </FlexBox>
          <Space size={25} />
          <VdrList vdrList={vdrList} />

        </FlexBox>
      </Container>
    </ScollablePage>
  );
};

export default TransactionBiblesViewCard;
