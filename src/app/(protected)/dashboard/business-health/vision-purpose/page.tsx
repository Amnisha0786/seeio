'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

import ScollablePage from '@/components/scollable-page'
import Space from '@/components/space'
import Container from '@/components/container'
import BreadCrumbs from '@/components/breadcrumbs'
import Typography from '@/components/typography'
import AddVisionPurpose, { VisionPurpose as TVisionPurpose } from './add-vision-purpose'
import VisionPurposeDetails from './vision-purpose-details'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import Toast from '@/components/toast'
import ConfirmDelete from '@/shared/confirm-delete'
import Loading from '@/components/loading'
import useAmplitudeContext from '@/hooks/amplitude'
import Clickable from '@/components/clickable'
import Icon from '@/components/icon'
import styles from './page.module.scss'
import FlexBox from '@/components/flex-box'
import AskAiModal from '@/shared/ask-ai'
import { BUTTON_LOCATION, BUTTON_NAME, EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

const VisionPurpose = () => {
  const [showVisionPurposeDetails, setShowVisionPurposeDetails] =
    useState(false);
  const [initing, setIniting] = useState(true);
  const [purposeDetails, setPurposeDetails] = useState<TVisionPurpose>({
    vision: '',
    reviewDate: dayjs().toISOString(),
    mission: '',
    corporateValues: [
      {
        value: '',
        description: ''
      }
    ],
    internalValues: [
      {
        value: '',
        description: ''
      }
    ],
  })
  const [loading, setLoading] = useState(false)
  const [deleteDetails, setDeleteDetails] = useState<{ key?: "corporateValues" | "internalValues", index?: number }>({})
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteModelRef: any = useRef()
  const companyId = useSelectedAccountCompany()?.companyId;
  const [collapseAi, setCollapseAi] = useState(true)
  const [updateData, setUpdateData] = useState<any>(null)
  const [userData, setUserData] = useState<any>({})
  const config = useSelector((state: any) => state.config)
  const onEdit = () => {
    trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED, {
      button_name: BUTTON_NAME.EDIT_VISION,
      button_location: BUTTON_LOCATION.VISION,
      button_clicked_at: new Date().valueOf(),
      user_id: userAccess?.userId,
      platform: PLATFORM.WEB,
    });
    setShowVisionPurposeDetails(false)
  }

  const url = typeof window !== 'undefined' ? window.location.href : ""

  const handlecollapse = () => {
    setCollapseAi((prev) => !prev)
  }

  useEffect(() => {
    if(updateData?.vision || updateData?.mission || updateData?.reviewDate){
      setPurposeDetails({
        ...purposeDetails, ...{
          vision: updateData?.vision || purposeDetails?.vision,
          reviewDate: updateData?.reviewDate || purposeDetails?.reviewDate,
          mission: updateData?.mission || purposeDetails?.mission,
        }
      })
    }
    if (updateData?.corporateValues) {
      setPurposeDetails({
        ...purposeDetails, ...{
          corporateValues: updateData?.corporateValues.map((item: { name: string, description: string }) => ({
            value: item.name,
            description: item.description
          }))
        }
      })
    }
    if (updateData?.internalValues) {
      setPurposeDetails({
        ...purposeDetails, ...{
          internalValues: updateData?.internalValues.map((item: { name: string, description: string }) => ({
            value: item.name,
            description: item.description
          }))
        }
      })
    }

    setShowVisionPurposeDetails(false)
  }, [updateData])

  const { trackAmplitudeEvent } = useAmplitudeContext();
  const userAccess = useAccessLevel()

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
      page_or_modal_name: 'vision_page',
      page_url: url,
      user_id: userAccess?.userId,
      viewed_at: new Date().valueOf(),
      platform: PLATFORM.WEB,
    });
  }, []);

  const fetchData = useCallback(async () => {
    if (!companyId) return

    setIniting(true);
    try {
      const result = await API.getDataVision({ companyId })
      if (result && !result?.message) {
        setPurposeDetails(result)
        setUserData(result)
        setShowVisionPurposeDetails(true)
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false);
    }
  }, [companyId])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [companyId])

  const onSuccess = async (values: TVisionPurpose, isDelete?: boolean) => {
    try {
      setLoading(true)
      const result = await API.createVision({ payload: values, companyId })
      if (result) {
        fetchData()
        setShowVisionPurposeDetails(true)
        if (isDelete) {
          deleteModelRef.current.close()
          setDeleteDetails({})
        }
        trackAmplitudeEvent(EVENT_NAME.KEY_STEP, {
          user_id: userAccess?.userId,
          actioned_at: new Date().valueOf(),
          platform: PLATFORM.WEB,
        });
      }
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const onClickDelete = (data: { key: "corporateValues" | "internalValues", index?: number }) => {
    setDeleteDetails(data)
    deleteModelRef?.current?.open()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const details = { ...purposeDetails }
    if (deleteDetails?.key && deleteDetails?.index !== undefined) {
      details[deleteDetails?.key] = details[deleteDetails?.key]?.filter((_, index) => index !== deleteDetails?.index)
    }
    await onSuccess(details, true)
    setIsDeleting(false)
  }

  if (initing) return <Loading size="small" />

  return (
    <>
      <ScollablePage>
        <FlexBox alignItems='flex-start' justifyContent='center'>
          <div>
            <Space horizontal size={52} />
            <div>
              <Space size={32} />
              <Container >
                <BreadCrumbs
                  items={[
                    { title: 'Business Health', link: "/dashboard/business-health" },
                    { title: 'Vision & Purpose', link: "/dashboard/business-health/vision-purpose" }
                  ]}
                  activeItem='Vision & Purpose'
                />
                <Space size={24} />
                <Typography size='huge'>Vision & Purpose</Typography>
                <Space size={12} />
                <Typography darkgray size='large'>
                  This Corporate Purpose page is where you decide your Mission, Vision
                  and Values - to guide strategic thinking. These items inform certain
                  Board Meeting agenda items and reports. <br /> Metrics on Vision and
                  Values are also created in Board Originator.
                </Typography>
                <Space size={24} />

                {showVisionPurposeDetails && !config?.config ? (
                  <VisionPurposeDetails
                    config={config.config}
                    purposeDetails={purposeDetails}
                    onEdit={onEdit}
                    onClickDelete={onClickDelete}
                  />
                ) : (
                  <AddVisionPurpose
                    config={config.config}
                    onSuccess={onSuccess}
                    loading={loading}
                    purposeDetails={purposeDetails}
                    setShowVisionPurposeDetails={setShowVisionPurposeDetails}
                  />
                )}
              </Container>
              <Space size={52} />
              <ConfirmDelete
                ref={deleteModelRef}
                handleConfirm={handleDelete}
                loading={isDeleting}
              />
              <div className={styles.askAiIcon}>
                <Clickable onClick={() => {
                  handlecollapse()
                }}>
                  <Icon name='ask-ai-icon' size={80} />
                </Clickable>
              </div>
            </div>
          </div>
          <div className={`${styles.aiBox} ${!collapseAi ? styles.hideAi : ""}`}>
            <AskAiModal setUpdateData={setUpdateData} userData={userData} setCollapse={handlecollapse} collapse={collapseAi} />
          </div>
        </FlexBox>
      </ScollablePage>
    </>
  )
}

export default VisionPurpose
