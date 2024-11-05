"use client";

import React from "react";
import moment from 'moment';

import Container from "@/components/container";
import ScollablePage from "@/components/scollable-page";
import Space from "@/components/space";
import { TRecordDocument, TVdrs } from "@/models";
import FlexBox from "@/components/flex-box";
import Typography from "@/components/typography";
import styles from "./document-view.module.scss";
import VdrList from "@/shared/vdr-list"

const RegulationComplianceViewCard = ({
  data,
  vdrList
}: {
  data: TRecordDocument | undefined
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
                <Typography gray>Title</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.name || "-"}</Typography>
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Reference</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.referenceNumber || "-"}</Typography>
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Document Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.documentDate ? moment(data?.documentDate).format("DD/MM/YYYY") : "-"}</Typography>
            </FlexBox>

            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Review Date</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.reviewDate ? moment(data?.reviewDate).format("DD/MM/YYYY") : "-"}</Typography>
            </FlexBox>
          </FlexBox>

          <Space size={25} />
          <FlexBox className={styles.content}>
            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>2nd Reference number label</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.secondReferenceNumberLabel || "-"}</Typography>
            </FlexBox>

            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>2nd Reference number</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.secondReferenceNumber || "-"}</Typography>
            </FlexBox>

            <FlexBox flexDirection="column" className={styles.content}>
              <FlexBox>
                <Typography gray>Expiry Date </Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{data?.expiryDate ? moment(data?.expiryDate).format("DD/MM/YYYY") : "-"}</Typography>
            </FlexBox>
            <FlexBox flexDirection="column" className={styles.content}><div></div></FlexBox>
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
          </FlexBox>

          <Space size={25} />
          <FlexBox flexDirection="column" className={styles.content}>
            <FlexBox>
              <Typography gray>Description</Typography>
            </FlexBox>
            <Space size={5} />
            <Typography size="large">{data?.description || "-"}</Typography>
          </FlexBox>

          <Space size={25} />
          <VdrList vdrList={vdrList} />

        </FlexBox>
      </Container>
    </ScollablePage>
  );
};

export default RegulationComplianceViewCard;
