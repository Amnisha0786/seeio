import { Input } from "antd";
import { FormikProps } from "formik";
// import * as yup from 'yup'

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Field from "@/components/field";
import Card from "@/components/card";
import AddButton from "@/components/add-button";
import { AddCode } from "@/models/pass-store";

// const validationSchema = yup.object().shape({
//   title: yup.string().required(),
// })

interface IProps {
  loading: boolean
  saveButtonText: string
  formik: FormikProps<AddCode>
}

const AddPasswordForm = ({ loading, saveButtonText, formik }: IProps) => {

  return (

    <>
      {formik.values.passwords.map((password, index) => {
        return (
          <>
            <Space size={24} />
            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="URL">
                  <Input
                    name={`passwords[${index}].url`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.url}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Username">
                  <Input
                    name={`passwords[${index}].username`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.username}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Password">
                  <Input
                    name={`passwords[${index}].password`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.password}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Pin Code">
                  <Input
                    name={`passwords[${index}].pin`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.pin}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Associated email">
                  <Input
                    name={`passwords[${index}].associatedEmail`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.associatedEmail}
                  />
                </Field>
              </FlexBox>
              <Space horizontal size={24} />
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Associated phone">
                  <Input
                    name={`passwords[${index}].associatedPhone`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.associatedPhone}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
            <Space size={24} />

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Notes">
                  <Input
                    name={`passwords[${index}].notes`}
                    size="large"
                    placeholder="Enter here"
                    onChange={formik.handleChange}
                    value={password.notes}
                  />
                </Field>
              </FlexBox>
            </FlexBox>
          </>
        );
      })}

      <Space size={24} />
      <Card>
        <FlexBox justifyContent="space-between">
          <Typography size="huge">
            Password {formik.values.passwords.length + 1}
          </Typography>
          <AddButton
            onClick={() =>
              formik.setFieldValue("passwords", [
                ...formik.values.passwords,
                {
                  url: "",
                  username: "",
                  password: "",
                  pin: "",
                  associatedEmail: "",
                  associatedPhone: "",
                  notes: "",
                },
              ])
            }
          />
        </FlexBox>
      </Card>
      <Space size={24} />

      <FlexBox justifyContent="flex-end">
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={() => formik.handleSubmit()}
        >
          {saveButtonText}
        </Button>
      </FlexBox>
    </>
  );
}


AddPasswordForm.displayName = "AddPasswordForm";

export default AddPasswordForm;
