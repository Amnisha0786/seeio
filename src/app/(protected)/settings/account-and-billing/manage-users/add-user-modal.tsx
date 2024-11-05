import { forwardRef, useImperativeHandle, useState } from "react";
import { Input, Row, Col, Modal, Select } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

import Space from "@/components/space";
import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import styles from "./page.module.scss";
import Toast from '@/components/toast';
import * as API from '@/api'
import Field from '@/components/field';

type TForm = {
  firstName: string
  lastName: string
  email: string
  accessLevel: string
  userType: string
  isDisabled?: boolean
}

type TFormData = {
  firstName: string
  lastName: string
  email?: string
}

const USER_TYPE = [{
  label: "COMPANY",
  value: "COMPANY"
}, {
  label: "INVESTOR",
  value: "INVESTOR"
}
]

export const ACCESS_LEVEL = [{
  label: "OWNER",
  value: "OWNER"
}, {
  label: "ADMIN",
  value: "ADMIN"
}, {
  label: "USER",
  value: "USER"
},
{
  label: "BOARD MEMBER",
  value: "BOARD_MEMBER"
},
{
  label: "DATA ROOM ACCESS USER",
  value: "DATA_ROOM_ACCESS_USER"
},
{
  label: "BILLING ADMIN",
  value: "BILLING_ADMIN"
}
]

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required."),
  lastName: yup.string().required("Last name is required."),
  email: yup.string().required("Email is required."),
  accessLevel: yup.string().required("Access level is required."),
  userType: yup.string().required("User type is required."),
})

const AddUserModal = forwardRef(({
  invitedVdrId,
  companyId,
  onSuccess,
  formData,
  isEdit
}: { companyId: string, onSuccess: () => void, formData?: TFormData, isEdit?: boolean, invitedVdrId?: string }, ref) => {
  const [open, setOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState("")
  const [loading, setLoading] = useState(false)

  const initialValues = {
    firstName: formData?.firstName || "",
    lastName: formData?.lastName || "",
    email: formData?.email || "",
    accessLevel: '',
    userType: '',
  }

  const formik = useFormik<TForm>({
    initialValues,
    validationSchema,
    validateOnMount: false,
    onSubmit: async (values): Promise<void> => {
      setLoading(true)

      try {
        if (isEdit && userToEdit) {
          await API.updateUsers(
            companyId,
            {
              userId: userToEdit,
              updateAttributes: {
                accessLevel: values?.accessLevel,
                userType: values.userType,
                isDisabled: values?.isDisabled || false,
                firstName: values.firstName,
                lastName: values.lastName,
              }
            }
          )
          Toast.success("User updated successfully.")
        } else {
          await API.addUser(
            companyId,
            values.email,
            values.firstName,
            values.lastName,
            values.accessLevel,
            values.userType,
            invitedVdrId,
          )
          if (formData) {
            Toast.success("User invited successfully.")
          } else {
            Toast.success("User created successfully.")
          }
        }
        onSuccess()
        setOpen(false)
      } catch (err: any) {
        Toast.error(err.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    },
  });

  useImperativeHandle(ref, () => ({
    open: (data: API.TUsers) => {
      if (data) {
        setUserToEdit(data?.userId)
        formik.setValues({
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          accessLevel: data?.accessLevel,
          userType: data?.userType || "",
          isDisabled: data?.isDisabled,
        })
      } else {
        formik.setValues(initialValues)
      }
      setOpen(true)
    },
    close: () => setOpen(false)
  }), [formData])

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      width={700}
      onCancel={handleCancel}
      footer={null}
    >
      <h2>{isEdit ? "Edit a Person" : "Add a Person"}</h2>
      <Space size={10} />
      <Row>
        <Col span={8}>
          <Field label="First Name" errorMessage={formik.errors.firstName}>
            <Input
              name="firstName"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              status={formik.errors.firstName && "error"}
            />
          </Field>
        </Col>
        <Space size={30} horizontal />
        <Col span={8}>
          <Field label="Surname" errorMessage={formik.errors.lastName}>
            <Input
              name="lastName"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              status={formik.errors.lastName && "error"}
            />
          </Field>
        </Col>
      </Row>
      <Space size={20} />

      <Col span={12}>
        <Field label="Email" errorMessage={formik.errors.email}>
          <Input
            disabled={isEdit}
            name="email"
            size="large"
            placeholder="Enter here"
            onChange={formik.handleChange}
            value={formik.values.email}
            status={formik.errors.email && "error"}
          />
        </Field>
      </Col>
      <Space size={20} />

      <FlexBox justifyContent="flex-start">
        <Col span={8}>
          <Field label="Access Level" errorMessage={formik.errors.accessLevel}>
            <Select
              className={styles.w_100}
              options={ACCESS_LEVEL}
              size="middle"
              placeholder="Enter here"
              onChange={(value) => formik.setFieldValue("accessLevel", value)}
              value={formik.values.accessLevel}
              status={formik.errors.accessLevel && "error"}
            />
          </Field>
        </Col>
        <Space size={30} horizontal />
        <Col span={6}>
          <Field label="User Type" errorMessage={formik.errors.userType}>
            <Select
              className={styles.w_100}
              size="middle"
              placeholder="Enter here"
              options={USER_TYPE}
              onChange={(value) => formik.setFieldValue("userType", value)}
              value={formik.values.userType}
              status={formik.errors.userType && "error"}
            />
          </Field>
        </Col>
      </FlexBox>
      <Space size={20} />
      <FlexBox justifyContent="flex-end">
        <Button type="primary" className={styles.save_btn} size={"middle"} onClick={() => formik.handleSubmit()} loading={loading}>
          {isEdit ? "Update" : "Save"}
        </Button>
      </FlexBox>
    </Modal>
  )
})

AddUserModal.displayName = "AddUserModal"

export default AddUserModal