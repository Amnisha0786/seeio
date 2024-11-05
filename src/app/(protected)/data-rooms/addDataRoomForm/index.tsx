import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import AddDataRoomStep1 from "./step-1";
import AddDataRoomStep2 from "./step-2";
import AddDataRoomStep3 from "./step-3";
import * as API from "@/api";
import { useSelectedAccountCompany } from "@/hooks";
import Toast from "@/components/toast";

export const getArray = (obj: any) => {
  const array: any = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && Object.keys(obj)?.length > 0) {
      array.push({ ...obj[key] });
    }
  }
  return array.filter((item: any) => item !== undefined);
};

const DataRoomForm = ({
  closeModal,
  onSuccess,
  value,
  setValues,
  step,
  setStep,
  vdrId,
  formik,
}: {
  closeModal?: any;
  value: any;
  setValues: any;
  step: number;
  setStep: (state: number) => void;
  onSuccess: () => void;
  vdrId?: string
  formik?: any
}) => {
  const [structure, setStructure] = useState<any>();
  const [data, setData] = useState<any>();
  const companyId = useSelectedAccountCompany()?.companyId;
  const [loading, setLoading] = useState(false);
  const [vdrLoading, setVdrLoading] = useState(false);
  const [peoples, setPeoples] = useState<API.TUsers[]>();
  const [inputData, setInputData] = useState<any>([]);
  const [dataRoomId, setDataRoomId] = useState(vdrId || '')
  const handleChange = (key: string, data: any) => {
    setValues({
      ...value,
      [key]: data,
    });
  };


  const formik2 = useFormik<any>({
    validateOnMount: true,
    initialValues: {
      structure: {},
    },
    onSubmit: async (): Promise<any> => {
      setVdrLoading(true);
      try {
        const response = await API.createVdr({
          metadata: { name: value?.name, description: value?.description },
          structure: value?.structure || data,
          company_id: companyId,
        });
        if (response) {
          setDataRoomId(response?.createdId)
          Toast.success("Data room created successfully");
          setStep(3)
        }
        setVdrLoading(false);
      } catch {
        Toast.error("Something went wrong");
        setVdrLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setStructure(getArray(data));
  }, [data]);

  const fetchPeopleData = async () => {
    if (!companyId) return;

    try {
      setLoading(true);

      const result = await API.getUsers(companyId, "active");
      if (result?.users) {
        setPeoples(result?.users);
        setInputData(result?.users?.map((user) => ({
          id: user?.userId,
          permission: (user?.accessLevel.toUpperCase() === "OWNER" || user?.accessLevel.toUpperCase() === "ADMIN") ? "edit" : "notAccess"
        })))
      }
    } finally {
      setLoading(false);
    }
  };

  const addMembers = async () => {
    if (!companyId || !dataRoomId) {
      return
    }
    try {
      setVdrLoading(true);
      const res = await API.vdrAccess({
        companyId,
        vdrId: dataRoomId,
        payload: {
          editAccess: {
            users: inputData
              ?.filter((user: any) => user?.permission === "edit")
              ?.map((userData: any) => userData?.id),
            roles: ["ADMIN", "OWNER"],
          },
          viewAccess: {
            users: inputData
              ?.filter((user: any) => user?.permission === "view")
              ?.map((userData: any) => userData?.id),
            roles: ["ADMIN", "OWNER"],
          },
        },
      });
      if (res) {
        onSuccess();
        closeModal();
        setStep(1);
        setValues({});
        setVdrLoading(false);
      }

    } catch (error) {
      console.log(error);
      setVdrLoading(false);

    }
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.getDataRoomsStructure({ companyId });
      if (response) {
        setValues({
          ...value,
          structure: response,
        });
        setData(response);
        setLoading(false);
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!companyId) {
      return;
    }
    fetchData();
    fetchPeopleData();
  }, [companyId]);

  switch (step) {
  case 1:
    return (
      <AddDataRoomStep1
        formik={formik}
        handleChange={handleChange}
      />
    );
  case 2:
    return (
      <AddDataRoomStep2
        setStep={setStep}
        data={data}
        structure={structure}
        loading={loading}
        handleChange={handleChange}
        vdrLoading={vdrLoading}
        handleSubmit={formik2?.handleSubmit}
      />
    );

  case 3:
    return (
      <AddDataRoomStep3
        peoples={peoples || []}
        setStep={setStep}
        handleSubmit={addMembers}
        inputData={inputData}
        setInputData={setInputData}
        vdrLoading={vdrLoading}
      />
    );
  default:
    return <></>;
  }
};

export default DataRoomForm;
