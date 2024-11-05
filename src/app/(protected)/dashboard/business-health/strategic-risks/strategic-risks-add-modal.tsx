import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import Modal from "@/components/modal";
import Space from "@/components/space";
import Typography from "@/components/typography";
import StrategicRisksForm, { riskScores } from "./strategic-risks-form";
import { TRisksFormValues } from "@/models/strategic-risks";
import { CorporateObjective } from '@/models/corporate-objective';
import styles from './page.module.scss'

const StrategicRisksAddModal = forwardRef(
  (
    {
      fetchData,
      corporateObjectives,
      open,
      setOpen,
      marginLeft,
      updateData,
      setUpdateData,
      newRisks,
      modalName = ""
    }: {
      fetchData: () => void;
      corporateObjectives?: CorporateObjective[] | null;
      open: boolean
      setOpen: (state: boolean) => void
      marginLeft?: boolean
      updateData: any
      setUpdateData: any
      newRisks: any
      modalName?: string
    },
    ref
  ) => {

    const getValue = (label?: string, type?: string) => {
      let result: any
      if (type === 'impact' || type === 'probability') {
        result = riskScores.filter((item: any) => item.label === label)[0]?.value
      }
      return result
    }
    const intialValues = {
      name: "",
      description: "",
      riskType: "",
      nextReview: new Date().toISOString(),
      lastReview: new Date().toISOString(),
      owner: "",
      other: "",
      impact: 1,
      probability: 1,
      reviewFrequency: 2,
      mitigations: [],
    }
    const [formData, setFormData] = useState<TRisksFormValues>(intialValues);
    
    useEffect(() => {
      if (updateData) {

        setFormData(
          {
            name: updateData?.name || '',
            description: updateData?.description || '',
            riskType: updateData?.riskType || '',
            nextReview: new Date().toISOString(),
            lastReview: new Date().toISOString(),
            owner: updateData?.owner ||"",
            other: updateData?.other || "" ,
            impact: updateData?.impact ? getValue(updateData?.impact, 'impact') : 1,
            probability:updateData?.probability ? getValue(updateData?.probability, "probability") : 1,
            reviewFrequency: updateData?.reviewFrequency || 2,
            mitigations: updateData.mitigations?.map((item: any) => ({ ...item, status: item.status ? item.status : 'To Do' })),
          }
        )
      } else {
        setFormData(intialValues)
      }
    }, [updateData])

    const onSuccess = (values: TRisksFormValues) => {
      setFormData(values);
      fetchData();
      setUpdateData(newRisks?.filter((item: any) => item?.id !== updateData?.id))
      if (newRisks?.length < 2) {
        setOpen(false);
      } else if (!modalName) {
        setOpen(false);
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      []
    );

    return (
      <Modal open={open} width={800} className={`${styles.modal} ${marginLeft ? styles.modalactive : ""}`} onCancel={() => {
        setUpdateData(newRisks?.filter((item: any) => item?.id !== updateData?.id))
        if (newRisks?.length < 2) {
          setOpen(false);
        } else if (!modalName) {
          setOpen(false);
        }
      }}>
        <Space size={10} />
        <Typography size="huge">{modalName ? modalName : "Add Risk"}</Typography>

        <Typography size="large" red>
          Enter here the risks you face as a company, that may stop you
          achieving your goals. SEEIO adds these risks to Board
          Meetings for discussion, and for monitoring real-time. Enter the
          probability of risk occurring – and impact it could cause to your
          company, and frequency of discussion will be auto-generated in the
          meeting planner.
        </Typography>
        <Space size={24} />

        <StrategicRisksForm
          formData={formData}
          onSuccess={onSuccess}
          isEdit={false}
          corporateObjectives={corporateObjectives}
        />

        <Space size={24} />
      </Modal>
    );
  }
);

StrategicRisksAddModal.displayName = "StrategicRisksAddModal";

export default StrategicRisksAddModal;
