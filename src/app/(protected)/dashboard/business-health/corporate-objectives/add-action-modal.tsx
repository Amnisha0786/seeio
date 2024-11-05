import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';

import Modal from '@/components/modal'
import * as API from '@/api';
import AddActionForm, { INDICATOR_STATUS } from './add-action-form'
import { ActionDetails, CorporateObjective, KeyIndicator } from '@/models/corporate-objective'
import Toast from '@/components/toast';
import { useAccessLevel, useAuthenticatedUser } from '@/hooks'
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'
import styles from './page.module.scss'
import { TCongif } from '@/models'

interface Props {
  viewObjective: CorporateObjective | null
  companyId: string | undefined
  setViewObjective: (newValue: CorporateObjective | null) => void
  isEdit: boolean
  setIsEdit: (newValue: boolean) => void
  fetchData: () => void
  marginLeft?: boolean
  updateData: any
  setUpdateData: any
  newObjectives: any
  modalName?: string
  open: boolean
  setOpen: (key: boolean) => void
}

const initialValues = {
  objStatus: '',
  name: '',
  description: '',
  reviewFrequency: 3,
  lastReview: "",
  nextReview: new Date().toISOString(),
  keyIndicators: [
    {
      name: "",
      owner: "",
      type: "",
      status: "",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString()
    }
  ],
  other: '',
  frequencyDuration: '',
};

export const validationSchema = yup.object().shape({
  name: yup.string().required('Objective Category are required'),
  other: yup.string().when("name", {
    is: (name: string) => name === "Other",
    then: () => yup.string().required("Objective field is required."),
  }),
  description: yup.string().required('Objective description is required'),
  objStatus: yup.string().required('Objective status is required'),
  reviewFrequency: yup
    .number()
    .required('Review Frequency is required'),
  keyIndicators: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      owner: yup.string().required('Owner is required'),
      description: yup.string().required('Description is required'),
      type: yup.string().required('Type is required'),
      status: yup.string().required('Status is required'),
    })
  ),
});

const AddActionModal = forwardRef(({ viewObjective, setViewObjective, companyId, isEdit, setIsEdit, fetchData, marginLeft, updateData,
  setUpdateData,
  newObjectives,
  modalName = "",
  open,
  setOpen }: Props, ref) => {
  const [loading, setLoading] = useState(false)
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const userAccess = useAccessLevel()
  const url = typeof window !== 'undefined' ? window.location.href : ""

  const [formData, setFormData] = useState<ActionDetails>(initialValues);
  const [configData, setConfigData] = useState<TCongif>()
  const user = useAuthenticatedUser();

  const getConfigData = async () => {
    try {
      const result = await API.getConfig();
      setConfigData(result)
    } catch (error) {
      Toast.error("Something wnet wrong")
    }
  };

  useEffect(() => {
    getConfigData()
  }, [])

  const updategetConfigData = async () => {
    try {
      if (
        configData?.havePlatformTour?.register !== undefined &&
        configData?.havePlatformTour?.record !== undefined &&
        user
      ) {
        await API.updateConfig({
          havePlatformTour: {
            businessHealth: configData?.havePlatformTour?.businessHealth,
            register: configData?.havePlatformTour?.register,
            record: configData?.havePlatformTour?.record,
            objective: true
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
    if (updateData) {

      setFormData(
        {
          objStatus: updateData?.objStatus || "",
          name: updateData?.name || '',
          description: updateData?.description || '',
          reviewFrequency: updateData?.reviewFrequency || 3,
          lastReview: updateData?.lastReview || "",
          nextReview: updateData?.lastReview ? new Date(updateData?.lastReview).toISOString() : new Date().toISOString(),
          keyIndicators: updateData?.keyIndicators,
          other: updateData?.other || '',
          frequencyDuration: updateData?.frequencyDuration || '',
        }
      )
    } else {
      setFormData(initialValues)
    }
  }, [updateData])


  useEffect(() => {
    trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED,
      {
        page_or_modal_name: 'objective_modal',
        page_url: url,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
      });
  }, []);

  const transformedViewObjective = useMemo(() => {
    if (viewObjective) {
      const apiObject = { ...viewObjective };
      apiObject?.keyIndicators?.forEach((indicator: KeyIndicator) => {
        if (typeof indicator?.owner !== 'string') {
          indicator.owner = indicator?.owner?.id || '';
        }
      });
      if (!apiObject?.lastReview && apiObject?.dateCreated) {
        apiObject.nextReview = apiObject?.dateCreated
      }
      if (!apiObject.reviewFrequency) {
        apiObject.reviewFrequency = 3
      }
      return apiObject;
    }
    return viewObjective;
  }, [viewObjective]);

  const formik = useFormik<ActionDetails>({
    validateOnChange: false,
    initialValues: transformedViewObjective
      ? {
        ...transformedViewObjective,
      }
      : updateData ? formData : initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const apiObject = { ...values };
      apiObject?.keyIndicators?.map((indicator: KeyIndicator) => {
        if (indicator?.type === 'qualitive') {
          delete indicator?.value;
        }
        if (indicator?.status !== INDICATOR_STATUS.IN_PROGRESS) {
          delete indicator?.startDate
        }
        if (indicator?.status !== INDICATOR_STATUS.COMPLETED && indicator?.status !== INDICATOR_STATUS.ABANDONED) {
          delete indicator?.endDate
        }
      });
      try {
        if (isEdit) {
          if (!values?.lastReview) {
            values.lastReview = 'EMPTY'
          }
          await API.editCorporateObjective(
            values,
            companyId,
            viewObjective?.id
          );
        } else {
          if (!values?.lastReview) {
            delete values.lastReview
          }
          await API.createCorporateObjectiveActions(values, companyId);
        }
        formik.resetForm();
        onSuccess();
        trackAmplitudeEvent(EVENT_NAME.KEY_STEP,
          {
            user_id: userAccess?.userId,
            actioned_at: new Date().valueOf(),
            platform: PLATFORM.WEB,
          });

      } catch (err: any) {
        Toast.error(err?.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setOpen(true)
      },
      close: () => {
        handleCancel()
      }
    }),
    []
  )

  const onSuccess = () => {
    setIsEdit(false)
    setUpdateData(newObjectives?.filter((item: any) => item?.id !== updateData?.id));
    if (newObjectives?.length < 2) {
      setOpen(false);
    } else if (!modalName) {
      setOpen(false);
    }
    setViewObjective(null)
    fetchData()
  }

  const handleCancel = () => {
    setUpdateData(newObjectives?.filter((item: any) => item?.id !== updateData?.id));
    if (newObjectives?.length < 2) {
      setOpen(false);
    } else if (!modalName) {
      setOpen(false);
    }
    setViewObjective(null)
    setIsEdit(false)
    formik.resetForm()
  }

  return (
    <Modal open={open} className={`${styles.modal} ${marginLeft ? styles.modalactive : ""}`} width={970} onCancel={handleCancel}>
      <AddActionForm
        isEdit={isEdit}
        onSuccess={onSuccess}
        modalName={modalName}
        companyId={companyId}
        viewObjective={viewObjective}
        isOpen={open}
        formik={formik}
        loading={loading}
        configData={configData}
        updategetConfigData={updategetConfigData}
      />
    </Modal>
  )
})

AddActionModal.displayName = 'AddActionModal'

export default AddActionModal
