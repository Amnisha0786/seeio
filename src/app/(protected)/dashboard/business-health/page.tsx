"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux"

import ScollablePage from "@/components/scollable-page";
import Table, { TColumn } from "@/components/table";
import Space from "@/components/space";
import styles from "./page.module.scss";
import Typography from "@/components/typography";
import Container from "@/components/container";
import TourComponent from "@/components/TourComponent";
import StartTour from "@/shared/start-tour";
import Clickable from "@/components/clickable";
import * as API from '@/api';
import { TCongif } from "@/models"
import Toast from "@/components/toast"
import useAmplitudeContext from "@/hooks/amplitude";
import { setConfigActions } from "@/store/account/setConfig"
import { useAccessLevel, useAuthenticatedUser } from "@/hooks"
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"

interface DataType {
  key: React.Key;
  name: string;
  description: string;
  link: string;
}

const data: DataType[] = [
  {
    key: "1",
    name: "Vision and Purpose",
    description: "Set and monitor your business vision and purpose",
    link: "/dashboard/business-health/vision-purpose",
  },
  {
    key: "2",
    name: "Corporate Objectives",
    description: "Set and keep track of the goals you want to achieve",
    link: "/dashboard/business-health/corporate-objectives",
  },
  {
    key: "3",
    name: "Strategic Risks",
    description: "Monitor the risks that could affect your business",
    link: "/dashboard/business-health/strategic-risks",
  },
];

const Page = () => {
  const [tourStart, setTourStart] = useState<boolean>(false)
  const openStartTourModalRef = useRef<any>()
  const [configData, setConfigData] = useState<TCongif>()
  const dispatch = useDispatch()
  const { setConfig } = setConfigActions
  const config = useSelector(((state: any) => state.config))
  const user = useAuthenticatedUser();
  const useAccess = useAccessLevel()

  const getConfigData = async () => {
    try {
      const result = await API.getConfig();
      setConfigData(result)
    } catch (error) {
      Toast.error("Something wnet wrong")
    }
  };

  const updategetConfigData = async (key?: string) => {
    try {
      if (
        configData?.havePlatformTour?.register !== undefined && 
        configData?.havePlatformTour?.record !== undefined && 
        user
      ) {
        await API.updateConfig({
          havePlatformTour: {
            businessHealth: key === "notUpdate" ? false : true,
            register: configData?.havePlatformTour?.register,
            record: configData?.havePlatformTour?.record,
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
    if (
      !tourStart &&
      !configData?.havePlatformTour?.businessHealth &&
      configData?.havePlatformTour?.businessHealth !== undefined
    ) {
      openStartTourModalRef?.current?.open()
    }
  }, [tourStart, configData])

  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'business_health_page',
      page_url:  typeof window !== 'undefined' ? window.location.href: "",
      user_id: useAccess?.userId && useAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const columns = useMemo<TColumn<DataType>[]>(() => [
    {
      title: "Data",
      key: "name",
      width: 300,
      render: (rec) => (
        <Link
          href={{
            pathname: rec.link,
          }}
          className={styles.link}
        >
          <Typography primary size="large">
            {rec.name}
          </Typography>
        </Link>
      ),
    },
    {
      title: "Description",
      key: "description",
      width: 600
    },
  ], []);

  const handleConfirm = () => {
    dispatch(setConfig(true))
    updategetConfigData("update")
    setTourStart(true)
    openStartTourModalRef?.current?.close()
  }

  return (
    <div className={styles.page}>
      <ScollablePage>
        <Container>
          <Space size={30} />
          <div className={styles.table}>
            <Table headerRight={
              <Clickable onClick={(e) => {
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
            } rowKey="key" columns={columns} items={data} title="Business plan, objectives, and contingencies" id="row0" />
          </div>
        
          <StartTour
            setTourStart={setTourStart}
            updateConfigData={updategetConfigData}
            ref={openStartTourModalRef}
            handleConfirm={handleConfirm}
            title="Follow the guide to Business Health"
            message="This is the section of the platform that helps with operational alignment and includes Vision, Mission, objectives and risks."
          />
          <TourComponent start={tourStart && config.config} />
        </Container>
      </ScollablePage>
    </div>
  );
};

export default Page;
