"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"

import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Loading from "@/components/loading";
import * as API from "@/api";
import { TCongif, TRecords } from "@/models";
import { useAccessLevel, useAuthenticatedUser, useBreadcrumbs, useSelectedAccountCompany } from "@/hooks";
import FolderIcons from "@/shared/folder-icons";
import Toast from '@/components/toast';
import Clickable from "@/components/clickable";
import StartTour from "@/shared/start-tour";
import styles from "./page.module.scss"
import { DOCUMENT_TYPE } from "./[recordCategoryId]/records-validation-schemas";
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import { setConfigActions } from "@/store/account/setConfig"

const Page = () => {
  const [records, setRecords] = useState<TRecords[]>([]);
  const [initing, setIniting] = useState(true);
  const breadcrumbs = useBreadcrumbs();
  const companyId = useSelectedAccountCompany()?.companyId;
  const [tourStart, setTourStart] = useState<boolean>(false)
  const openStartTourModalRef = useRef<any>()
  const router = useRouter();
  const [configData, setConfigData] = useState<TCongif>()
  const { setConfig } = setConfigActions
  const dispatch = useDispatch()
  const user = useAuthenticatedUser();

  const getConfigData = async () => {
    try {
      const result = await API.getConfig();
      setConfigData(result)
    } catch (error) {
      Toast.error("Something wnet wrong")
    }
  };

  const updategetConfigData = async () => {
    try {
      if (configData?.havePlatformTour?.businessHealth !== undefined && configData?.havePlatformTour?.register !== undefined) {

        await API.updateConfig({
          havePlatformTour: {
            businessHealth: configData?.havePlatformTour?.businessHealth,
            register: configData?.havePlatformTour?.register,
            record: true,
            objective: configData?.havePlatformTour?.objective
          },
          email: user?.email,
          firstName: user?.family_name,
          lastName: user?.given_name,
          isConsentedToMarketing: configData?.isConsentedToMarketing ? configData?.isConsentedToMarketing : false
        });
      }

    } catch (error) {
      Toast.error("Something went wrong")
    }
  };

  useEffect(() => {
    getConfigData()
  }, [])

  useEffect(() => {
    if (!tourStart && !configData?.havePlatformTour?.record && configData?.havePlatformTour?.record !== undefined) {
      openStartTourModalRef?.current?.open()
    }
  }, [tourStart, configData])

  const handleConfirm = () => {
    if (records?.length > 0) {
      const recordId = records?.find((item) =>
        item?.docType === DOCUMENT_TYPE.DEAL_BIBLES || item?.docType === DOCUMENT_TYPE.DEAL_BIBLES_DOCUMENT)?.id
      dispatch(setConfig(true))
      breadcrumbs.add({
        title: records?.[0]?.name,
        link: `/documents/records/${records?.[0]?.id}`,
      });
      router.push(`/documents/records/${recordId || records?.[0]?.id}`)
      updategetConfigData()
      openStartTourModalRef?.current?.close()
      setTourStart(true)
    }
  }
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""
  const userAccess = useAccessLevel()


  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'record_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      if (companyId) {
        setIniting(true)
        const result = await API.getRecords(companyId);
        setRecords(result);
      }
    } catch (err: any) {
      Toast.error(err?.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();

    breadcrumbs.set([
      {
        title: "Records",
        link: "/documents/records",
      },
    ]);
    // eslint-disable-next-line
  }, [companyId]);

  const onItemClick = (item: any) => {
    breadcrumbs.add({
      title: item?.name,
      link: `/documents/records/${item.id}`,
    });
  };

  return (
    <ScollablePage>
      <Space size={32} />
      <Space size={36} />
      <Container>
        <Row gutter={[24, 24]}>
          {initing ? <Loading size="small" /> : (
            <FolderIcons
              records={records}
              redirectLink={"/documents/records"}
              onItemClick={onItemClick}
            />
          )}
        </Row>
        <Clickable className={styles.absolute} onClick={(e) => {
          e.stopPropagation()
          openStartTourModalRef?.current?.open()
        }}>
          <Image
            src="/icons/help-icon.svg"
            alt="App Logo"
            width={40}
            height={40}
          />
        </Clickable>
        <StartTour
          setTourStart={setTourStart}
          updateConfigData={updategetConfigData}
          ref={openStartTourModalRef}
          handleConfirm={handleConfirm}
          title="Follow the guide to Records"
          message="This is the section of the platform where you can store your corporate records such as HR, finance etc"
        />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
