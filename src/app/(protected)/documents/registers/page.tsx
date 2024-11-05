"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux"

import ScollablePage from "@/components/scollable-page";
import Container from "@/components/container";
import Space from "@/components/space";
import Loading from "@/components/loading";
import * as API from "@/api";
import { TRegister } from "@/models/registers/register";
import FolderIcons from "@/shared/folder-icons";
import Toast from "@/components/toast";
import { useAccessLevel, useAuthenticatedUser, useBreadcrumbs, useSelectedAccountCompany } from "@/hooks";
import Clickable from "@/components/clickable";
import styles from "./page.module.scss"
import StartTour from "@/shared/start-tour";
import { DOCUMENT_TYPE } from "./registers-validation-schemas";
import { TCongif } from "@/models"
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import { setConfigActions } from "@/store/account/setConfig"
import TourComponent from '@/components/TourComponent';

const Registers = () => {
  const [registers, setRegisters] = useState<TRegister[]>([]);
  const [initing, setIniting] = useState(true);
  const [tourStart, setTourStart] = useState<boolean>(false)
  const companyId = useSelectedAccountCompany()?.companyId;
  const breadcrumbs = useBreadcrumbs();
  const openStartTourModalRef = useRef<any>()
  const router = useRouter();
  const [configData, setConfigData] = useState<TCongif>()
  const dispatch = useDispatch()
  const { setConfig } = setConfigActions

  const config = useSelector(((state: any) => state.config))

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const userAccess = useAccessLevel()
  const user = useAuthenticatedUser();

  const url = window ? window.location.href : ""
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
        configData?.havePlatformTour?.businessHealth !== undefined &&
        configData?.havePlatformTour?.record !== undefined && user
      ) {
        await API.updateConfig({
          havePlatformTour: {
            businessHealth: configData?.havePlatformTour?.businessHealth,
            register: key === "notUpdate" ? false : true,
            record: configData?.havePlatformTour?.record,
            objective: configData?.havePlatformTour?.objective
          },
          email: user.email,
          firstName: user.family_name,
          lastName: user.given_name,
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
      !configData?.havePlatformTour?.register &&
      configData?.havePlatformTour?.businessHealth !== undefined
    ) {
      openStartTourModalRef?.current?.open()
    }
  }, [tourStart, configData])

  const fetchData = useCallback(async () => {
    try {
      setIniting(true);
      if (companyId) {
        const result = await API.getRegisters(companyId);
        setRegisters(result);
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
    breadcrumbs.set([
      {
        title: "Registers",
        link: "/documents/registers",
      },
    ]);
  }, [fetchData]);

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'Registers_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const onItemClick = (register: TRegister) => {
    breadcrumbs.add({
      title: register.name,
      link: `/documents/registers/${register.id}`,
    });
    router.push(`/documents/registers/${register.id}` as any);
  };

  const handleConfirm = () => {
    if (registers?.length > 0) {
      dispatch(setConfig(true))
      openStartTourModalRef?.current?.close()
      setTourStart(true)
      const registerId = registers?.find((item) => item?.docType === DOCUMENT_TYPE.RESOLUTION)?.id
      breadcrumbs.add({
        title: registers[0]?.name,
        link: `/documents/registers/${registers[0]?.id}`,
      });
      router.push(`/documents/registers/${registerId}`);
      updategetConfigData()
    }
  }

  return (
    <ScollablePage>
      <Space size={32} />
      <Space size={36} />
      <Container>
        <Row gutter={[24, 24]}>
          {initing ? <Loading size="small" /> : (
            <FolderIcons
              records={registers}
              redirectLink={"/documents/registers"}
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
          title="Follow the guide to Registers"
          message="This is the section of the platform where you can store your corporate registers such as contracts, complaints etc"
        />
        <TourComponent start={config.config && tourStart} />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Registers;
