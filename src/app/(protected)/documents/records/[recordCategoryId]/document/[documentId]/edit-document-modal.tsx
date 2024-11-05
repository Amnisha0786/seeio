import { forwardRef, useImperativeHandle, useState } from 'react'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import * as yup from 'yup'

import Modal from '@/components/modal'
import { DOCUMENT_STATUS_TYPES, REGULATION_COMPLIANCE_STATUS_TYPE, TRecordDocument } from '@/models'
import CommonFieldsForm from '../../../records-forms/common-fields-form';
import { getMetaData } from '../../form-initial-values'
import { DOCUMENT_TYPE, metadataSchemaDocTypeMap } from '../../records-validation-schemas'

type TForm = {
  name: string;
  id?: string;
  fileName: string;
  recordCategoryId?: string;
  parentId?: string;
  description: string;
  docType: string;
  additionalFileNames?: string[]
  additionalFiles?: any[]
  metadata: {
    needReview?: boolean;
    active?: boolean;
    noLongerRequired?: boolean;
    date?: string | Date;
    reviewDate?: string | Date;
    lastReview?: string | Date;
    notes?: string;
    documentDate?: string | Date;
    commencementDate?: string;
    expiryDate?: string | Date;
    owner?: string;
    referenceNumber?: string;
    reviewFrequency?: string;
  };
};
interface IProps {
  handleDocumentUpdate: (data: any, calback: () => void) => void
  loading: boolean
  record: TRecordDocument | undefined
}


const EditDocumentModal = forwardRef(({ handleDocumentUpdate, loading, record }: IProps, ref) => {
  const [open, setOpen] = useState(false)

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required.'),
    metadata: record?.docType && metadataSchemaDocTypeMap[record?.docType],
  })

  const initialMetaData = {
    name: "",
    fileName: "",
    additionalFiles: [],
    parentId: record ? record.id : "",
    description: "",
    docType: record ? record.docType : "",
    recordCategoryId: record ? record.id : "",
    metadata: {
    },
  };

  const formik = useFormik<TForm>({
    validateOnChange: false,
    initialValues: initialMetaData,
    validationSchema,
    onSubmit: async (values: any): Promise<void> => {
      if (values?.docType === DOCUMENT_TYPE.REGULATION 
          || values?.docType === DOCUMENT_TYPE.REGULATION_COMPLIANCE 
          || values?.docType === DOCUMENT_TYPE.FINANCE 
          || values?.docType === DOCUMENT_TYPE.FINANCE_DOCUMENT) {
        values.metadata.referenceNumberLabel = values.name 
      }
      if (values?.docType === DOCUMENT_TYPE.REGULATION || values?.docType === DOCUMENT_TYPE.REGULATION_COMPLIANCE) {      
        if (values?.metadata?.noLongerRequired) {
          values.metadata.statusLabel = REGULATION_COMPLIANCE_STATUS_TYPE.STATIC;
          values.metadata.statusColor = "white"
        } else if (values?.metadata?.reviewDate && dayjs(values?.metadata?.reviewDate).isBefore(dayjs())) {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.OVERDUE
          values.metadata.statusColor = "red"
        } else if (values?.metadata?.needReview && values?.metadata?.reviewDate
          && (Math.abs(dayjs(values?.metadata?.reviewDate).diff(dayjs(), 'day')) <= 60)) {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.REVIEW_DUE
          values.metadata.statusColor = "yellow"
        } else {
          values.metadata.statusLabel = REGULATION_COMPLIANCE_STATUS_TYPE.CURRENT
          values.metadata.statusColor = "green"
        }
      } else {
        if (!values?.metadata?.documentDate && !values?.metadata?.date) {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.MISSING;
          values.metadata.statusColor = "red"
        } else if (values?.metadata?.reviewDate && dayjs(values?.metadata?.reviewDate).isBefore(dayjs())) {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.OVERDUE
          values.metadata.statusColor = "red"
        } else if (values?.metadata?.reviewDate && (dayjs(values?.metadata?.reviewDate).diff(dayjs(), 'days') <= 30)) {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.REVIEW_DUE
          values.metadata.statusColor = "yellow"
        } else {
          values.metadata.statusLabel = DOCUMENT_STATUS_TYPES.UP_TO_DATE
          values.metadata.statusColor = "green"
        }
      }
      handleDocumentUpdate(values, () => {
        formik.resetForm()
        setOpen(false)
      })
    }
  });

  useImperativeHandle(ref, () => ({
    open: (data: TRecordDocument) => {
      formik.setValues({
        id: data?.id || "",
        recordCategoryId: data?.recordCategoryId || "",
        name: data?.name || "",
        description: data?.description || "",
        fileName: data?.fileName || "",
        additionalFiles: data?.additionalFiles,
        docType: data?.docType || "",
        parentId: data?.recordCategoryId || "",
        metadata: {
          ...getMetaData(data?.docType, data)
        }
      })
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [formik, record])

  return (
    <Modal open={open} width={780} onCancel={() => setOpen(false)}>
      <CommonFieldsForm
        ref={ref}
        type={record ? record.docType : ""}
        formik={formik}
        loading={loading}
        isEdit={true}
      />
    </Modal>
  )
})

EditDocumentModal.displayName = "EditDocumentModal"

export default EditDocumentModal
