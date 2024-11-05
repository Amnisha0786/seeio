import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Input, DatePicker, Select } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { isEqual, uniq } from "lodash";

import Modal from '@/components/modal';
import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Button from '@/components/button';
import Space from '@/components/space';
import Toast from '@/components/toast';
import Field from '@/components/field';
import PeopleSelect from '@/shared/people-select';
import * as API from '@/api';
import { TAction } from '@/models';
import { useAccessLevel, useSelectedAccountCompany } from '@/hooks';
import styles from './page.module.scss';
import { IOptions } from './[meetingId]/status/started/form-modals/shared-form-modal';
import useAmplitudeContext from '@/hooks/amplitude'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

type TForm = {
  agendaId?: string,
  agendaName?: string,
  topicId?: string,
  name: string;
  owner: string;
  dueDate: dayjs.Dayjs | string | null;
  description?: string;
  status?: string;
  boardMeetingDate?: string | null,
  boardMeetingName?: string,
  dateCreated?: string | null,
};

export const STATUS_OPTIONS = [{
  label: 'Not started',
  value: 'not-started'
}, {
  label: 'In progress',
  value: 'in-progress'
}, {
  label: 'Completed',
  value: 'completed'
}, {
  label: 'Abandoned',
  value: 'abandoned'
}
]

const initialValues = {
  name: '',
  owner: '',
  dueDate: new Date().toISOString(),
  description: '',
  status: 'not-started',
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Agenda Item is required."),
  owner: yup.string().required("Owner is required."),
  dueDate: yup.string().nullable().required("Due by Date is required."),
});

const getUpdatedKey = (oldData: any, newData: any) => {
  const data = uniq([...Object.keys(oldData), ...Object.keys(newData)]);

  const resultdata: any = {}
  for (const key of data) {
    if (!isEqual(oldData[key], newData[key])) {
      resultdata[key] = newData[key];
    }
  }
  return resultdata
}

const AddActionModal = forwardRef(
  (
    {
      onSuccess,
      meetingId,
      isEdit,
      topicId,
      topicOptions,
      searchData
    }: {
      onSuccess?: (searchData?: string[]) => void;
      meetingId?: string;
      isEdit?: boolean;
      topicId?: string;
      topicOptions?: IOptions[];
      searchData?: string[];
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionToEdit, setActionToEdit] = useState('');
    const [companyNumber, setCompanyNumber] = useState('');
    const companyId = useSelectedAccountCompany()?.companyId;
    const [initialInputValues, setInitialInputValues] = useState<any>()
    const { trackAmplitudeEvent } = useAmplitudeContext();
    const userAccess = useAccessLevel()

    const formik = useFormik<TForm>({
      enableReinitialize: true,
      validateOnChange: false,
      initialValues: {
        ...initialValues, agendaName: topicId ? topicId : "",
        topicId: topicOptions ? topicOptions.find((item) => item.value === topicId)?.value : "",
        agendaId: topicOptions ? topicOptions.find((item) => item.value === topicId)?.agendaId : ""
      },
      validationSchema,
      onSubmit: async (values): Promise<void> => {
        if (values?.agendaName) {
          delete values?.agendaName
        }
        setLoading(true);
        try {
          if (!companyId) return;
          if (isEdit) {
            const updatedValues: any = getUpdatedKey(initialInputValues, values)
            await API.updateAction({
              companyId,
              actionId: actionToEdit,
              ...updatedValues,
            });
            Toast.success('Updated Successfully!');
            trackAmplitudeEvent(EVENT_NAME.AGENDA_ITEM_EDITED, {
              user_id: userAccess?.userId,
              actioned_at: new Date().valueOf(),
              platform: PLATFORM.WEB,
              detail_name: updatedValues?.name
            });
          } else {
            if (topicId || topicOptions) {
              await API.addAction({
                companyId,
                ...values,
                dueDate: values.dueDate?.toString() || '',
                meetingId,
              });
            } else {
              await API.addAction({
                companyId,
                ...values,
                dueDate: values.dueDate?.toString() || '',
                meetingId,
              });
            }
            formik.resetForm();
            Toast.success('Add Action Successfully');
          }
          if (onSuccess) {
            onSuccess(searchData);
          }
          setOpen(false);
        } catch (error) {
          Toast.error('Something went wrong');
        } finally {
          setLoading(false);
        }
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        open: (action: TAction) => {
          if (action && isEdit) {
            setActionToEdit(action.id);
            if (action?.companyId) {
              setCompanyNumber(action?.companyId)
            }
            const initialValues = {
              name: action?.name || '',
              agendaName: action?.topic?.topicName || '',
              agendaId: action?.agendaId || '',
              topicId: action?.topicId || '',
              description: action?.description || '',
              owner: action?.owner?.id || '',
              dueDate: dayjs(action?.dueDate) || '',
              status: action?.status || '',
              boardMeetingDate: action?.meeting?.date || '',
              boardMeetingName: action?.meeting?.name || '',
              dateCreated: action?.meeting?.dateCreated || '',
            }
            setInitialInputValues(initialValues),
            formik.setValues(initialValues);
          }
          setOpen(true);
        },
        close: () => setOpen(false),
      }),
      [formik]
    );
    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)}>
        <div className={styles.addActionModal}>
          <Typography size="huge">
            {`${isEdit ? "Edit" : "Add"}`} Action
          </Typography>
          <Space size={24} />
          <FlexBox flexDirection="column">
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Action Name"
                errorMessage={formik.errors.name}
              >
                <Input
                  name="name"
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  status={formik.errors.name && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />

          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Agenda Item" errorMessage={formik.errors.agendaName}>
                {topicOptions?.length ? (
                  <Select
                    disabled={isEdit}
                    size="large"
                    allowClear
                    placeholder="Select"
                    options={topicOptions}
                    onChange={(value) => {
                      formik.setFieldValue(
                        "agendaId",
                        topicOptions.find((item) => item.value === value)?.agendaId
                      )
                      formik.setFieldValue(
                        "topicId",
                        topicOptions.find((item) => item.value === value)?.value
                      )
                      formik.setFieldValue(
                        "agendaName",
                        topicOptions.find((item) => item.value === value)?.value
                      )
                    }
                    }
                    value={formik.values.agendaName}
                    status={formik.errors.agendaName && "error"}
                  />
                ) : (
                  <Input
                    name="Category Name"
                    size="large"
                    placeholder="Enter here"
                    disabled={isEdit}
                    onChange={formik.handleChange}
                    value={formik.values.agendaName}
                    status={formik.errors.agendaName && "error"}
                  />
                )}
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Owner" errorMessage={formik.errors.owner}>
                <PeopleSelect
                  size="large"
                  allowClear
                  placeholder="Select"
                  onChange={(value) => formik.setFieldValue("owner", value)}
                  value={formik.values.owner}
                  status={formik.errors.owner && "error"}
                  companyNumber={companyNumber}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox>
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Due by Date" errorMessage={formik.errors.dueDate}>
                <DatePicker
                  size="large"
                  placeholder="__/__/____"
                  format="DD/MM/YYYY"
                  onChange={(value) => formik.setFieldValue("dueDate", value?.toISOString())}
                  value={formik?.values?.dueDate ? dayjs(formik?.values?.dueDate) : null}
                  defaultValue={dayjs(formik?.values?.dueDate)}
                />
              </Field>
            </FlexBox>
            <Space horizontal size={24} />
            <FlexBox flexDirection="column" flex={1}>
              <Field label="Status" errorMessage={formik.errors.status}>
                <Select
                  size="large"
                  placeholder="Choose status"
                  allowClear
                  options={STATUS_OPTIONS}
                  onChange={(value) => formik.setFieldValue("status", value)}
                  value={formik.values.status}
                  status={formik.errors.status && "error"}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          {formik?.values?.boardMeetingName && (
            <>
              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Board Meeting Name"
                  errorMessage={formik.errors.status}
                >
                  <Input
                    disabled={true}
                    size="large"
                    value={formik?.values?.boardMeetingName}
                  />
                </Field>
              </FlexBox>

              <Space size={24} />
            </>
          )}

          <FlexBox>
            {formik?.values?.boardMeetingDate && (
              <FlexBox flexDirection="column" flex={1}>
                <Field
                  label="Board Meeting Date"
                  errorMessage={formik.errors.boardMeetingDate}
                >
                  <DatePicker
                    disabled={true}
                    format="DD/MM/YYYY"
                    size="large"
                    value={dayjs(formik.values.boardMeetingDate)}
                  />
                </Field>
              </FlexBox>
            )}

            <Space horizontal size={24} />

            {formik?.values?.dateCreated && (
              <FlexBox flexDirection="column" flex={1}>
                <Field label="Created Date" errorMessage={formik.errors.status}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disabled={true}
                    size="large"
                    value={dayjs(formik.values?.dateCreated)}
                  />
                </Field>
              </FlexBox>
            )}
          </FlexBox>

          <Space size={24} />

          <FlexBox flexDirection="column">
            <FlexBox flexDirection="column" flex={1}>
              <Field
                label="Action Description"
                errorMessage={formik.errors.description}
              >
                <TextArea
                  rows={4}
                  name={`description`}
                  size="large"
                  placeholder="Enter here"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Field>
            </FlexBox>
          </FlexBox>
          <Space size={24} />
          <FlexBox justifyContent="flex-end">
            <Button
              type="primary"
              loading={loading}
              onClick={() => formik.handleSubmit()}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </FlexBox>
        </div>
      </Modal>
    );
  }
);
AddActionModal.displayName = 'AddActionModal';

export default AddActionModal;
