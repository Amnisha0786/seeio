"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "antd";
import { useRouter } from "next/navigation"
import { useRootfiLink } from "rootfi-react-sdk"

import * as API from "@/api";
import FlexBox from "@/components/flex-box";
import { useSelectedAccountCompany } from "@/hooks";
import styles from "./page.module.scss";
import Icon from "@/components/icon";
import Typography from "@/components/typography";
import Toast from "@/components/toast";
import { TXeroData } from '@/models';

const XeroIntegration = () => {
  const [loading, setLoading] = useState(false);
  const company = useSelectedAccountCompany();
  const [inviteLinkId, setInviteLinkId] = useState("");
  const [integration, setXeroIntegration] = useState<TXeroData>();

  const { isReady, closeLink, openLink } = useRootfiLink({
    environment: "global",
    inviteLinkId: inviteLinkId,
    onSuccess: () => {
      setTimeout(() => closeLink(), 2000);
    },
    onExit: () => {
      closeLink();
    },
  });

  const router = useRouter()
  const sendInvite = async () => {
    if (!company) return;
    try {
      setLoading(true);
      const result = await API.xeroIntegration({
        companyId: company?.companyId,
        companyName: company?.companyName,
      });
      if (result?.inviteLinkId) {
        setInviteLinkId(result?.inviteLinkId);
      }
    } catch (error: any) {
      if (error?.data?.invite_link_id) {
        setInviteLinkId(error?.data?.invite_link_id)
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inviteLinkId) {
      openLink(inviteLinkId);
    }
  }, [inviteLinkId, isReady]);

  const getXeroIntegration = async () => {

    try {
      if (!company) return;
      const result = await API.getXeroIntegration({
        companyId: company?.companyId,
      });
      if (result) {
        setXeroIntegration(result?.data);
      }
    } catch (error) {
      Toast.error("Something Went Wrong");
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setInviteLinkId('')
    setLoading(true)
    sendInvite();
  };

  useEffect(() => {
    setLoading(true)
    getXeroIntegration();
  }, [company?.companyId]);

  const isConnected = useMemo(() => !loading && integration?.isConnected && !integration?.isExpired, [loading, integration])

  return (
    <>
      <FlexBox className={styles.page} flexDirection="column">
        <FlexBox className={styles.contentBody} flexDirection="column">
          <Typography size="medium" serif blue>
            ⓘ After successful integration, you need to go back to the app and wait for 5-10 minutes to sync the data.
          </Typography>
          <Row gutter={[30, 0]}>
            <Col span={24}>
              <FlexBox
                className={styles.xero}
                alignItems="center"
                justifyContent="space-between"
              >
                <FlexBox alignItems="center" justifyContent="center" gap={5}>
                  <div className={styles.logoIcons}>
                    <Icon name="xero" size={60} />
                  </div>
                  <FlexBox flexDirection="column" gap={5}>
                    <Typography size="giant" color="#00293F">
                      Xero
                    </Typography>
                    <Typography color="grey">
                      App ready to be installes
                    </Typography>
                  </FlexBox>
                </FlexBox>
                <Button
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  onClick={() => {
                    isConnected
                      ? router.push('/dashboard/business-health/cash-burn-and-runway-calculator')
                      : handleClick()
                  }}
                >
                  {isConnected ? 'View record' : 'Connect'}
                </Button>
              </FlexBox>
            </Col>
          </Row>
        </FlexBox>
      </FlexBox>

    </>
  );
};

export default XeroIntegration;
