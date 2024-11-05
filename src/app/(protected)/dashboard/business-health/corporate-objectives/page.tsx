'use client'

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import dayjs from "dayjs";
import { useSelector } from 'react-redux'

import styles from './page.module.scss'
import * as API from '@/api'
import ScollablePage from '@/components/scollable-page'
import Space from '@/components/space'
import Typography from '@/components/typography'
import Container from '@/components/container'
import BreadCrumbs from '@/components/breadcrumbs'
import AddButton from '@/components/add-button'
import AddActionModal from './add-action-modal'
import { CorporateObjective } from '@/models/corporate-objective'
import Toast from '@/components/toast'
import { TColumn } from '@/components/table'
import Status from '@/components/status'
import Clickable from '@/components/clickable'
import Table from '@/components/table'
import TourComponent from '@/components/TourComponent'
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks'
import PreviewObjectiveDetails, { getObjectiveStatus } from './preview-action-details'
import { COMPANY_USER_ACCESS_LEVEL } from '@/models'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'
import FlexBox from '@/components/flex-box'
import AskAiModal from '@/shared/ask-ai'
import Icon from '@/components/icon'
import Loading from '@/components/loading';

interface Params {
  objectiveId?: string
}

interface Props {
  searchParams?: Params
}

const CorporateObjectives = (props: Props) => {
  const SetupACompanyModalRef: any = useRef();
  const ViewObjectiveModalRef: any = useRef();
  const userAccess = useAccessLevel()
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [collapseAi, setCollapseAi] = useState(true)
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState<any>([])
  const [userData, setUserData] = useState<any>({})

  const [initing, setIniting] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [viewObjective, setViewObjective] = useState<CorporateObjective | null>(
    null
  );
  const [columnsData, setColumnData] = useState<any>()
  const [data, setData] = useState({
    numObjectives: 0,
    objectives: [],
  });
  const companyId = useSelectedAccountCompany()?.companyId;
  const url = typeof window !== 'undefined' ? window.location.href : ""
  const config = useSelector((state: any) => state.config)

  useEffect(() => {
    if (updateData?.length > 0) {
      SetupACompanyModalRef.current?.open()
    }
  }, [updateData])

  const handlecollapse = () => {
    setCollapseAi((prev) => !prev)
  }

  const { trackAmplitudeEvent } = useAmplitudeContext();

  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED,
      {
        page_or_modal_name: 'coporate_objective_page',
        page_url: url,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
  }, []);

  const fetchData = useCallback(async () => {
    setIniting(true);

    try {
      if (!companyId) return;
      const result = await API.getCorporateObjectives(companyId);
      setColumnData(result)
      setData(result);
      setUserData(result)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.");
    } finally {
      setIniting(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchData();
    }
  }, [fetchData, companyId]);

  const columns = useMemo<TColumn<CorporateObjective>[]>(
    () => [
      {
        key: "objective",
        title: "Objectives",
        render: (rec) => (
          <Clickable
            onClick={() => {
              setViewObjective(rec);
              ViewObjectiveModalRef.current.open();
            }}
          >
            <Typography primary size="big">
              {rec.name === "Other" ? "Own Objective" : rec.name}
            </Typography>
          </Clickable>
        ),
      },
      {
        key: "description",
        title: "Description",
        render: (rec) => (
          <Typography size="big">
            {rec.description}
          </Typography>
        )
      },
      {
        key: "nextReview",
        title: "Next Review",
        render: (rec) => (rec?.nextReview ? <Typography size="big">{dayjs(rec?.nextReview).format("DD/MM/YYYY")}</Typography> : ""),
      },
      {
        key: "objStatus",
        title: "Status",
        render: (record) => {
          return (
            <Status
              className={styles.status}
              title={getObjectiveStatus('label', record?.status)}
              color={getObjectiveStatus('color', record?.status)}
            />
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (props?.searchParams?.
      objectiveId && data && ViewObjectiveModalRef && data?.objectives) {
      if (data?.objectives?.length > 0) {
        setViewObjective(data?.objectives?.find((objective: any) => objective?.id === props?.searchParams?.objectiveId) || null);
        ViewObjectiveModalRef?.current?.open()
      }
    }
  }, [props?.searchParams, data?.objectives])

  if (initing || !userAccess) return <Loading size="small" />

  return (
    <div className={styles.page}>
      <ScollablePage>
        <FlexBox alignItems="flex-start" gap={10} justifyContent="center">
          <div>
            <Space size={32} />
            <Container>
              <BreadCrumbs
                items={[
                  {
                    title: "Business Health",
                    link: "/dashboard/business-health",
                  },
                  {
                    title: "Corporate Objectives",
                    link: "/dashboard/business-health/corporate-objectives",
                  },
                ]}
                activeItem="Corporate Objectives"
              />
              <Space size={30} />
              <div
                className={`${collapseAi ? styles.table : styles.width}`}
                id="objectives_table"
              >
                <Table
                  rowKey="id"
                  title="Corporate Objectives"
                  columns={columns}
                  items={columnsData}
                />
              </div>
              <Space size={15} />
              {userAccess?.accessLevel !==
                COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER &&
                userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.USER && (
                <AddButton
                  onClick={() => {
                    SetupACompanyModalRef.current.open();
                    trackAmplitudeEvent(EVENT_NAME.BUTTON_CLICKED, {
                      button_name: "add_objective",
                      button_location: "Corporate_objectives_page",
                      user_id: userAccess?.userId,
                      button_clicked_at: new Date().valueOf(),
                      platform: PLATFORM.WEB,
                    });
                  }}
                />
              )}
              <TourComponent start={!initing && config.config} />
            </Container>
            <div
              className={`${styles.askAiIcon} ${open || addOpenModal ? styles.askAiModalIcon : ""
              }`}
            >
              <Clickable
                onClick={() => {
                  handlecollapse();
                }}
              >
                <Icon name="ask-ai-icon" size={80} />
              </Clickable>
            </div>
          </div>

          <div
            className={`${open || addOpenModal ? styles.aiBoxModal : styles.aiBox
            } ${!collapseAi ? styles.hideAi : ""}`}
          >
            <AskAiModal
              fullHeight={open || addOpenModal ? true : false}
              setUpdateData={setUpdateData}
              userData={userData}
              setCollapse={handlecollapse}
              collapse={collapseAi}
            />
          </div>
        </FlexBox>
      </ScollablePage>
      <AddActionModal
        marginLeft={collapseAi ? true : false}
        setUpdateData={setUpdateData}
        newObjectives={updateData}
        modalName={
          updateData?.length > 0
            ? `Add AI Generated Objectivies ${updateData?.length}`
            : ""
        }
        updateData={updateData?.length && updateData[0]}
        ref={SetupACompanyModalRef}
        viewObjective={viewObjective}
        setViewObjective={setViewObjective}
        companyId={companyId}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        fetchData={fetchData}
        open={addOpenModal}
        setOpen={setAddOpenModal}
      />
      <PreviewObjectiveDetails
        open={open}
        setOpen={setOpen}
        marginLeft={collapseAi ? true : false}
        ref={ViewObjectiveModalRef}
        onEdit={(objective: CorporateObjective | null) => {
          setViewObjective(objective);
          setIsEdit(true);
          SetupACompanyModalRef.current.open();
          ViewObjectiveModalRef.current.close();
        }}
        isEdit={isEdit}
        setViewObjective={setViewObjective}
        details={viewObjective}
        fetchDetails={fetchData}
      />
    </div>
  );
};

export default CorporateObjectives;
