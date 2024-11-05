"use client";

import React, {  useEffect, useRef, useState } from "react";

import * as API from '@/api'
import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import styles from "./page.module.scss";
import FlexBox from "@/components/flex-box"
import Typography from "@/components/typography"
import Icon from "@/components/icon"
import Clickable from "@/components/clickable"
import Loading from "@/components/loading"
import Toast from "@/components/toast"
import { TPolicy } from "@/models"
import Breadcrumbs from "@/shared/global-breadcrumbs"
import { openDownloadDialog } from "@/utils/file-reader"
import ConfirmDelete from "@/shared/confirm-delete"
import moment from "moment"

interface Props { params: { policyId: string } }

// eslint-disable-next-line max-len
const POLICY_WARNING_TEXT = "Policies set principles intended to be aligned with relevant legislation and guidance, and it is for this company using this policy to draw upon resources, the skills of its staff and to ensure it obtains legal advice where necessary, to update and keep policies in step with any legal or regulatory change.  This policy does not amount to the giving of legal advice.  This policy is provided fully customisable and editable by the company subscriber.";

const Page = ({ params: { policyId } }: Props) => {
  const [policyData, setPolicyData] = useState<TPolicy>();
  const [initing, setIniting] = useState(false);
  const downloadRef = useRef<any>();
  const [downloading ,setDownloading] = useState(false)

  const fetchData = async () => {
    setIniting(true);
    try {
      const result = await API.getPolicy(policyId);

      setPolicyData(result)
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong!")
    } finally {
      setIniting(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const handleDownload = () => {
    setDownloading(true)
    if (policyData?.fileUrl) {
      setTimeout(() => {
        openDownloadDialog({
          url: policyData?.fileUrl,
          filename: policyData?.fileName || "document",
        })
        setDownloading(false)
        downloadRef.current.close()
      }, 1000)
    }
    else {
      openDownloadDialog({
        url: policyData?.fileUrl,
        filename: policyData?.fileName || "document",
      })
      setDownloading(false)
      downloadRef.current.close()
    }
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <FlexBox justifyContent="space-between">
          <Breadcrumbs />
          <FlexBox>
            <Clickable onClick={()=>downloadRef.current.open()} className={styles.icon}><Icon name="upload-icon" rotate={180} /></Clickable>
          </FlexBox>
        </FlexBox>
        <Space size={30} />

        <FlexBox className={styles.contentBody} flexDirection="column">
          {initing ? (
            <Loading size="small" />
          ) : (
            <>
              <FlexBox flexDirection="column">
                <Typography size="medium" className={styles.title}>
                  Document Title
                </Typography>
                <Space size={8} />
                <Typography>{policyData?.title}</Typography>
              </FlexBox>
              <Space size={16} />
              <FlexBox>
                <FlexBox flexDirection="column">
                  <Typography size="medium" className={styles.title}>
                    Type
                  </Typography>
                  <Space size={8} />
                  <Typography>{policyData?.type}</Typography>
                </FlexBox>

                <Space horizontal size={50} />
                <FlexBox flexDirection="column">
                  <Typography size="medium" className={styles.title}>
                    Description
                  </Typography>
                  <Space size={8} />
                  <Typography>{policyData?.description}</Typography>
                </FlexBox>
                <Space horizontal size={50} />
                <FlexBox flexDirection="column">
                  <Typography size="medium" className={styles.title}>
                  Last Updated(date of update)
                  </Typography>
                  <Space size={8} />
                  <Typography>{policyData?.updatedAt ? moment(policyData?.updatedAt).format("MMM D,YYYY h:mm a") : "-"}</Typography>
                </FlexBox>
              </FlexBox>
            </>
          )}
        </FlexBox>
      </Container>

      <Space size={50} />
      <ConfirmDelete
        ref={downloadRef}
        handleConfirm={handleDownload}
        loading={downloading}
        message={POLICY_WARNING_TEXT}
        width={700}
        confirmText='Proceed'
      />
    </ScollablePage>
  );
};

export default Page;
