import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";

import Modal from "@/components/modal";
import StrategicRisksPreview from "./strategic-risks-preview";
import { TRisksFormValues } from "@/models/strategic-risks";
import * as API from "@/api";
import { useAccessLevel, useSelectedAccountCompany } from "@/hooks";
import Loading from "@/components/loading";
import StrategicRisksForm from "./strategic-risks-form";
import Toast from "@/components/toast";
import { CorporateObjective } from "@/models/corporate-objective";
import useAmplitudeContext from "@/hooks/amplitude";
import { EVENT_NAME, PLATFORM } from "@/contexts/AmplitudeContext"
import styles from './page.module.scss'

const StrategicRisksViewModal = forwardRef(
  (
    {
      fetchData,
      corporateObjectives,
      marginLeft,
      open,
      setOpen
    }: {
      fetchData: () => void;
      corporateObjectives?: CorporateObjective[] | null;
      marginLeft?: boolean
      open: boolean,
      setOpen: (state: boolean) => void
    },
    ref
  ) => {
    const url = typeof window !== 'undefined' ? window.location.href : ""
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const userAccess = useAccessLevel()
    const [viewData, setViewData] = useState<TRisksFormValues>({
      id: "",
      name: "",
      other: "",
      description: "",
      riskType: "",
      nextReview: dayjs().format("DD/MM/YYYY"),
      dateCreated: dayjs().format("DD/MM/YYYY"),
      lastReview: dayjs().format("DD/MM/YYYY"),
      owner: "",
      impact: 0,
      probability: 0,
      reviewFrequency: 0,
      mitigations: [],
    });
    const companyId = useSelectedAccountCompany()?.companyId;

    useEffect(() => {

      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'Risk_modal',
        page_url: url,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: async (riskId: any) => {
          setShowPreview(true);
          setOpen(true);
          try {
            if (companyId) {
              setLoading(true);
              const response = await API.viewStrategicRisk(companyId, riskId);
              setViewData(response);
            }
          } catch (error) {
            Toast.error("Something went wrong");
          } finally {
            setLoading(false);
          }
        },
        close: () => setOpen(false),
      }),
      [companyId]
    );

    const { trackAmplitudeEvent } = useAmplitudeContext();


    const onSuccess = (values: TRisksFormValues) => {
      setViewData(values);
      setOpen(false);
      fetchData();
      Toast.success("Updated successfully !");
    };

    return (
      <>
        <Modal className={`${styles.modal} ${marginLeft ? styles.modalactive : ""}`} open={open} width={800} onCancel={() => setOpen(false)}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <>
              {showPreview ? (
                <StrategicRisksPreview
                  formData={viewData}
                  setShowPreview={setShowPreview}
                  setOpen={setOpen}
                  fetchData={fetchData}
                  companyId={companyId}
                />
              ) : (
                <StrategicRisksForm
                  formData={viewData}
                  onSuccess={onSuccess}
                  isEdit={true}
                  fetchData={fetchData}
                  corporateObjectives={corporateObjectives}
                />
              )}
            </>
          )}
        </Modal>
      </>
    );
  }
);

StrategicRisksViewModal.displayName = "StrategicRisksViewModal";

export default StrategicRisksViewModal;
