import { forwardRef, useImperativeHandle, useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'

import Modal from '@/components/modal'
import Typography from '@/components/typography'
import styles from './create-data-room-modal.module.scss'
import DataRoomForm from './addDataRoomForm'


const CreateDataRoomModal = forwardRef(({ onSuccess }: { onSuccess: () => void }, ref) => {
  const [open, setOpen] = useState(false)
  const [value, setValues] = useState<any>({
    name: "",
    description: "",
  });
  const [step, setStep] = useState(1);


  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required field"),
    description: yup.string().required("Description is required filed"),
  });

  const formik = useFormik<any>({
    validateOnChange: false,
    initialValues: { name: "", description: "" },
    validationSchema,
    onSubmit: async (values): Promise<any> => {
      setValues({ ...value, ...values });
      setStep(2);
    },
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      formik.resetForm()
      setOpen(true)
    },
    close: () => {
      setValues({})
      setOpen(false)
    }
  }), [formik])

  return (
    <Modal
      open={open}
      width={780}
      onCancel={() => {
        setValues({})
        setStep(1)
        setOpen(false)
      }}
    >
      <div className={styles.modal}>
        <Typography size="huge">
          Create Data Room
        </Typography>
        <DataRoomForm
          onSuccess={onSuccess}
          closeModal={() => {
            setOpen((prev) => !prev)
          }}
          setValues={setValues}
          formik={formik}
          value={value}
          setStep={setStep}
          step={step}
        />
      </div>
    </Modal>
  )
})

CreateDataRoomModal.displayName = "CreateDataRoomModal"

export default CreateDataRoomModal
