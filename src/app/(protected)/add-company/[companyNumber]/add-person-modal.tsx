import { forwardRef, useImperativeHandle, useState, useMemo, useEffect, useRef } from "react";
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
import { TPeople } from '@/models'
import Typography from "@/components/typography";
import AddUserModal from "../../settings/account-and-billing/manage-users/add-user-modal";

type TForm = {
  firstName: string
  lastName: string
  email: string
  departmentIds: string[] | null
  role: string
  accessLevel?: string
  userType?: string
}

export const roleOptions = [
  {
    label: "Chair",
    value: "chair"
  },
  {
    label: "CEO",
    value: "ceo"
  },
  {
    label: "CFO",
    value: "cfo"
  },
  {
    label: "C-Director",
    value: "c-director"
  },
  {
    label: "D-Director",
    value: "d-director"
  },
  {
    label: "Trustee",
    value: "trustee"
  },
  {
    label: "Board Observer",
    value: "board-observer"
  },
  {
    label: "Employee",
    value: "employee"
  },
  {
    label: "Contractor",
    value: "contractor"
  },
  {
    label: "Adviser",
    value: "adviser"
  },
]

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required."),
  lastName: yup.string().required("Last name is required."),
  email: yup.string().optional(),
  role: yup.string().required("Role is required."),
})

const AddPersonModal = forwardRef(({
  onSuccess,
  companyId,
  type
}: { companyId?: string, onSuccess: () => void, type?: string }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [person, setPerson] = useState<TPeople | null>(null)
  const [isInvite, setIsInvite] = useState(false)

  const inviteUserModalRef = useRef<any>()


  const formik = useFormik<TForm>({
    enableReinitialize: true,
    initialValues: person ? {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      departmentIds: person.departmentIds,
      role: person.role,
    } : {
      firstName: "",
      lastName: "",
      email: "",
      departmentIds: [],
      role: "",
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      if (!companyId) return

      setLoading(true)

      try {
        if (person) {
          await API.updatePerson({
            companyId,
            personId: person.id,
            updateAttributes: values
          })
          Toast.success("Update Person Successfully")
        } else {
          await API.createCompanyPerson({
            companyId,
            people: [values]
          })
          Toast.success("Create Person Successfully")
        }
        onSuccess()
        setOpen(false)
      } finally {
        if (isInvite) {
          inviteUserModalRef.current.open()
        }
        setLoading(false)
      }
    },
  });

  useImperativeHandle(ref, () => ({
    open: (person: TPeople) => {
      setOpen(true)
      setIsInvite(false)
      setPerson(person || null)
      formik.resetForm()
    },
    close: () => {
      setOpen(false)
      setIsInvite(false)
    }
    // eslint-disable-next-line
  }), [formik])

  const handleCancel = () => {
    setOpen(false);
    setIsInvite(false)
  };

  return (
    <Modal
      open={open}
      width={700}
      onCancel={handleCancel}
      footer={null}
      className="customPeopleSelect"
    >
      <h2>{person ? "Update" : "Add"} a {type ? type : 'Person'}</h2>
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

      <FlexBox justifyContent="space-between">
        <Col className={styles.w_50}>
          <Field label="Role" errorMessage={formik.errors.role}>
            <Select
              className={styles.w_100}
              size="middle"
              placeholder="Enter here"
              options={roleOptions}
              onChange={(value) => formik.setFieldValue("role", value)}
              value={formik.values.role}
              status={formik.errors.role && "error"}
            />
          </Field>
        </Col>
      </FlexBox>
      <Space size={20} />
      <Typography blue serif>
        ⓘ If you “Save and invite”, the person will receive an email invitation to register as a user.
        If you just save and close, they will not be set up as a user and will not be able to access the system.
      </Typography>
      <Space size={30} />

      <FlexBox justifyContent="flex-end">
        <Button size={"middle"} onClick={() => formik.handleSubmit()} loading={!isInvite ? loading : false}>
          Save only
        </Button>

        <Space horizontal size={10} />
        <Button type="primary" loading={isInvite ? loading : false} onClick={() => {
          formik.handleSubmit()
          setIsInvite(true)
        }}>
          Invite
        </Button>
      </FlexBox>
      <AddUserModal ref={inviteUserModalRef} onSuccess={onSuccess} companyId={companyId!} formData={formik?.values} />
    </Modal>
  )
})

AddPersonModal.displayName = "AddPersonModal"

export default AddPersonModal
