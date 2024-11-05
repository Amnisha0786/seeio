import { forwardRef, useImperativeHandle, useState } from "react";
import { Input, Row, Col, Modal } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";

import Space from "@/components/space";
import Button from "@/components/button";
import FlexBox from "@/components/flex-box";
import styles from "./page.module.scss";
import Toast from '@/components/toast';
import * as API from '@/api'
import Field from '@/components/field';
import { TDepartment } from "@/models/company";
import PeopleSelect from "@/shared/people-select";

type TForm = {
  name: string,
  description: string,
  ownerId: string
}

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
})

const AddDepartmentModal = forwardRef(({ onSuccess, companyId }: { companyId?: string, onSuccess: () => void }, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState<TDepartment | null>(null); // Add this line

  const formik = useFormik<TForm>({
    initialValues: department ? { // Use department data if available
      name: department.name,
      description: department.description,
      ownerId: department.ownerId
    } : {
      name: "",
      description: "",
      ownerId: ""
    },
    validationSchema,
    onSubmit: async (values): Promise<void> => {
      if (!companyId) return;

      setLoading(true);

      try {
        if (department) { // Check if editing an existing department
          await API.updateCompanyDepartment({ // Replace with appropriate update API call
            companyId,
            departmentId: department.id,
            updateAttributes: values
          });
          Toast.success("Update Department Successfully");
        } else {
          await API.createCompanyDepartment({ // Replace with appropriate create API call
            companyId,
            department: values
          });
          Toast.success("Create Department Successfully");
        }
        onSuccess();
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCancel = () => setOpen(false)

  useImperativeHandle(ref, () => ({
    open: (dept: TDepartment | null) => {
      setDepartment(dept || null);
      setOpen(true);
      formik.resetForm({
        values: dept
          ? { name: dept.name, description: dept.description, ownerId: dept.ownerId }
          : { name: '', description: '', ownerId: '' }
      });
    },
    close: () => setOpen(false)
  }), [formik, department]); // Add department to the dependency array

  return (
    <Modal open={open} width={500} onCancel={handleCancel} footer={null}>
      <h2>{department ? "Edit Department" : "Add Department"}</h2>
      <Space size={10} />
      <Row>
        <Col span={24}>
          <Field label="Name" errorMessage={formik.errors.name}>
            <Input
              name="name"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.name}
              status={formik.errors.name && "error"}
            />
          </Field>
        </Col>
      </Row>
      <Space size={10} />
      <Row>
        <Col span={24}>
          <Field label="Description" errorMessage={formik.errors.description}>
            <Input
              name="description"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.description}
              status={formik.errors.description && "error"}
            />
          </Field>
        </Col>
      </Row>
      <Space size={20} />
      <FlexBox flexDirection='column' flex={1}>
        <Field label='Owner' errorMessage={formik.errors.ownerId}>
          <PeopleSelect
            addNewOption="Owner"
            companyNumber={companyId}
            size='large'
            allowClear
            placeholder='Select'
            onChange={(value) => formik.setFieldValue('ownerId', value)}
            value={formik.values.ownerId}
            status={formik.errors.ownerId && 'error'}
          />
        </Field>
      </FlexBox>
      <Space size={20} />
      <FlexBox justifyContent="flex-end">
        <Button
          type="primary"
          className={styles.save_btn}
          size={"middle"}
          loading={loading}
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>
      </FlexBox>
    </Modal>
  )
})

AddDepartmentModal.displayName = "AddDepartmentModal"

export default AddDepartmentModal
