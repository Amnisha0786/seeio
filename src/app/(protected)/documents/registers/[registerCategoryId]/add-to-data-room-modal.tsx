import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Select } from "antd";
import { useFormik } from "formik";
import * as yup from 'yup'

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import Space from "@/components/space";
import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import Loading from "@/components/loading";
import { TStorageObject, TVdr, VDR_RECORD_TYPE } from '@/models';
import { useSelectedAccountCompany } from "@/hooks"
import * as API from "@/api";
import Toast from "@/components/toast"

type TVdrs = { label?: string, value?: string }

const AddAddDataRoomModal = forwardRef(
  (
    {
      roomData,
      onAddingData
    }: {
      onSuccess: (value: { parentId: string, folder: string }) => void;
      roomData: TVdr[],
      getFolders: (dataId: string) => void,
      folderData: TStorageObject[],
      loadFolder: boolean,
      onAddingData: boolean
    },
    ref,
  ) => {

    const [open, setOpen] = useState(false);
    const [selectedVdr, setSelectedVdr] = useState<TVdrs[]>([])
    const [vdrOptions, setVdrOptions] = useState<TVdrs[]>([])
    const companyId = useSelectedAccountCompany()?.companyId
    const [loading, setLoading] = useState(false)
    const [intitng, setIniting] = useState(false)
    const [record, setRecord] = useState<{
      categoryId?: string,
      documentId?: string,
      recordType?: string,
      parentId?: string,
    }>({})

    useEffect(() => {
      if (roomData?.length > 0 && record?.recordType) {
        const options = roomData?.map((item) => ({
          value: item?.id,
          label: item?.name,
        }));
        setVdrOptions(options);
        setSelectedVdr(options)
        fetchVdr({ recordType: record?.recordType || "", categoryId: record?.categoryId || "", documentId: record?.documentId || '' })
      }
    }, [roomData, record]);


    const validationSchema = yup.object().shape({
      parentId: yup.array().required('Data room is required')
    })
    const formik = useFormik<any>({
      validateOnChange: true,
      validateOnMount: true,
      initialValues: {
        parentId: [],
        folder: ''
      },
      validationSchema,
      onSubmit: async (values: { parentId: string[], folder: string }) => {
        if (!companyId) {
          return
        }
        setIniting(true)
        try {
          const response = await API.addToVdr({
            companyId,
            payload: {
              [record?.recordType === VDR_RECORD_TYPE?.RECORD ? "record" : "register"]: {
                categoryId: record?.categoryId || "",
                documentId: record?.documentId || "",
                parentId: record?.parentId || "",
              },
              recordType: record?.recordType,
              vdrIds: values?.parentId
            }
          })
          if (response) {
            Toast.success("Document added to vdr succesfully")
            setOpen(false)
            setIniting(false)
          }
        } catch (error) {
          Toast.error("Something went wrong")
          setIniting(false)
        }
      },
    })

    const fetchVdr = useCallback(async ({
      categoryId,
      documentId,
      recordType,
    }: {
      categoryId: string;
      documentId: string;
      recordType: string;
    }) => {
      try {
        if (!companyId && roomData?.length < 1) {
          return;
        }
        setLoading(true);

        const response = await API.getSelectedVdr({
          companyId,
          payload: {
            [recordType === VDR_RECORD_TYPE?.RECORD ? "record" : "register"]: {
              categoryId,
              documentId,
            },
            recordType,
          },
        });
        const array: string[] = []
        if (response?.length > 0) {
          response?.forEach((item) => {
            array?.push(item)
            setVdrOptions((prev) => prev?.filter((vdr) => vdr?.value !== item));
          });
          if (array?.length > 0) {
            setSelectedVdr((prev) => prev?.filter((element) => array.includes(element.value || '')));
          }
        } else {
          setSelectedVdr([]);
        }
        setLoading(false);
      } catch (error) {
        Toast.error("Something went wrong");
        setLoading(false);
      }
    }, [roomData]);

    useImperativeHandle(
      ref,
      () => ({
        open: (data: any) => {
          const { categoryId, recordId, recordType, parentId } = data
          const record = {
            categoryId,
            documentId: recordId,
            recordType,
            parentId,
          }
          setRecord(record)
          setOpen(true);
          formik.resetForm()
        },
        close: () => setOpen(false),
      }),
      [companyId]
    );

    return (
      <Modal open={open} width={780} onCancel={() => setOpen(false)}>
        <Typography size="huge">Data rooms</Typography>

        <Space size={24} />

        <FlexBox flexDirection="column">
          <Space size={10} />
          {loading ? (
            <Loading size="small" />
          ) : (
            <>
              <FlexBox>
                <Select
                  filterOption={false}
                  mode="multiple"
                  style={{ width: "100%" }}
                  options={vdrOptions}
                  placeholder="Select items"
                  value={formik.values.parentId}
                  onChange={(value) => formik.setFieldValue("parentId", value)}
                />
              </FlexBox>
              <Space size={24} />
              {selectedVdr?.length > 0 && (
                <FlexBox alignItems="flex-start" flexDirection="column" gap={3}>
                  <Typography size="huge" bold darkBlue >Vdrs in which document is already present</Typography>
                  {selectedVdr?.map((item, index) => {
                    return (
                      <Typography size="large" darkBlue={true} key={index}>
                        {item?.label}
                      </Typography>
                    );
                  })}
                </FlexBox> 
              )}
            </>
          )}
        </FlexBox>

        <Space size={24} />

        {/* {loadFolder ?
          <Loading />
          : <FlexBox flexDirection="column">
            <Typography size="small"> Choose a folder</Typography>
            <Space size={10} />
            <FlexBox flexDirection="row">

              <Radio.Group
                value={formik.values.folder}
                onChange={(e) => formik.setFieldValue("folder", e.target.value)}
                name={'folder'}
              >
                {
                  folderData?.map((folder: any) => (
                    <>
                      <Space size={5} />
                      <Radio value={folder.id}>{folder?.name}</Radio>
                    </>
                  ))
                }
              </Radio.Group>
            </FlexBox>
          </FlexBox>} */}

        <Space size={24} />
        <FlexBox justifyContent="flex-end">
          <Button
            loading={onAddingData || intitng}
            type="primary"
            onClick={() => formik.handleSubmit()}
            disabled={!formik.isValid}
          >
            Save
          </Button>
        </FlexBox>
      </Modal>
    );
  }
);

AddAddDataRoomModal.displayName = "AddAddDataRoomModal";

export default AddAddDataRoomModal;
