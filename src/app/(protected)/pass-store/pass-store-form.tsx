import { Input, Select } from "antd";
import { FormikProps } from "formik";
// import * as yup from 'yup'

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Space from "@/components/space";
import Field from "@/components/field";
import FilePicker from "@/components/file-picker";
import Card from "@/components/card";
import AddButton from "@/components/add-button";
import { AddCode } from "@/models/pass-store";

// const validationSchema = yup.object().shape({
//   title: yup.string().required(),
// })

const DOCUMENT_TYPES = [
  {
    label: "Document type 1",
    value: 1,
  },
  {
    label: "Document type 2",
    value: 2,
  },
];


interface IProps {
  loading: boolean
  saveButtonText: string
  formik: FormikProps<AddCode>
}

const PassStoreForm = ({ loading, saveButtonText, formik }: IProps) => {

  return (
    <>
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field
            label="Type of Document"
            errorMessage={formik.errors.documentType}
          >
            <Select
              size="large"
              placeholder="Select"
              options={DOCUMENT_TYPES}
              onChange={(value) => formik.setFieldValue("documentType", value)}
              value={formik.values.documentType}
              status={formik.errors.documentType && "error"}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Space horizontal size={24} />
        </FlexBox>
      </FlexBox>

      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Code 1" errorMessage={formik.errors.code1Name}>
            <Input
              name="code1Name"
              size="large"
              placeholder="Name of code"
              onChange={formik.handleChange}
              value={formik.values.code1Name}
              status={formik.errors.code1Name && "error"}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Space size={30} />
          <Input
            name="code1"
            size="large"
            placeholder="Code"
            onChange={formik.handleChange}
            value={formik.values.code1}
            status={formik.errors.code1 && "error"}
          />

        </FlexBox>
      </FlexBox>
      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Code 2" errorMessage={formik.errors.code2Name}>
            <Input
              name="code2Name"
              size="large"
              placeholder="Name of code"
              onChange={formik.handleChange}
              value={formik.values.code2Name}
              status={formik.errors.code2Name && "error"}
            />
          </Field>
        </FlexBox>
        <Space horizontal size={24} />
        <FlexBox flexDirection="column" flex={1}>
          <Space size={30} />
          <Input
            name="code2"
            size="large"
            placeholder="Code"
            onChange={formik.handleChange}
            value={formik.values.code2}
            status={formik.errors.code2 && "error"}
          />

        </FlexBox>
      </FlexBox>

      <Space size={24} />
      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Notes" errorMessage={formik.errors.notes}>
            <Input
              name="notes"
              size="large"
              placeholder="Enter here"
              onChange={formik.handleChange}
              value={formik.values.notes}
              status={formik.errors.notes && "error"}
            />
          </Field>
        </FlexBox>
      </FlexBox>
      <Space size={24} />

      <FlexBox>
        <FlexBox flexDirection="column" flex={1}>
          <Field label="Document">
            <FilePicker />
          </Field>
        </FlexBox>
      </FlexBox>

      {formik.values.passwords.map((password, index) => {
        return (
          <>
            <Space size={24} />
            <Typography size="huge">Password {index > 0 ? index + 1 : ""}</Typography>

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
                <Field
                  label="Associated email"
                >
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
          <Typography size="huge">Password {formik.values.passwords.length + 1}</Typography>
          <AddButton
            onClick={() =>
              formik.setFieldValue('passwords', [
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
};

PassStoreForm.displayName = "PassStoreForm";

export default PassStoreForm;
