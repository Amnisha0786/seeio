import React, { useState } from "react";
import { Select } from "antd";

import FlexBox from "@/components/flex-box";
import Button from "@/components/button";
import styles from "./page.module.scss";
import Space from "@/components/space";
import Typography from "@/components/typography";
import { TUsers } from "@/api";
import Loading from "@/components/loading"
import { useAccessLevel } from "@/hooks"

type TProps = {
  setStep?: (state: number) => void;
  handleSubmit: any;
  peoples?: TUsers[];
  inputData: any
  setInputData: any
  vdrLoading: boolean
  loading?: boolean
  edit?: boolean
  addUserModalRef?: any
};
const VIEWS = [
  {
    label: "View Ony",
    value: "view",
  },
  { label: "Edit", value: "edit" },
  { label: "No Access", value: "notAccess" },
];

const getPermission = (permission: string) => {
  if (permission === "edit") {
    return "edit";
  } else if (permission === "view") {
    return "view";
  } else {
    return "notAccess";
  }
};

const PersonCard = ({
  item,
  inputData,
  setInputData,
  adminId
}: {
  item: TUsers;
  setInputData: any;
  inputData: any;
  adminId?: string
}) => {
  const intialValue = inputData?.filter((user: any) => user?.id === item?.userId)
  const [permission, setPermissions] = useState<string>(getPermission(intialValue[0]?.permission));

  return (
    <FlexBox alignItems="center" justifyContent="space-between">
      <FlexBox>
        <Space horizontal size={12} />

        <FlexBox flexDirection="column">
          <Typography color="#00293F">
            {item?.firstName + " " + item?.lastName}
          </Typography>
          <Typography color="#005F73" size="small">
            {item.email}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox flexDirection="column">
        <Typography color="#00293F">
          {"Role"}
        </Typography>
        <Typography color="#005F73" size="small">
          {item.accessLevel?.toUpperCase()}
        </Typography>
      </FlexBox>

      <FlexBox alignItems="center">
        <FlexBox flexDirection="column">
          <Select
            disabled={item?.userId === adminId || item?.accessLevel?.toUpperCase() === "OWNER" || item?.accessLevel?.toUpperCase() === "ADMIN"}
            className={styles.selectInput}
            value={permission}
            onChange={(value) => {
              const checkExist = inputData?.filter(
                (user: any) => user?.id === item?.userId
              );
              setPermissions(value);
              if (checkExist?.length > 0) {
                setInputData([
                  ...inputData?.map((user: any, index: number) =>
                    user?.id === item?.userId
                      ? { ...inputData[index], permission: value }
                      : inputData[index]
                  ),
                ]);
              } else {
                setInputData((prev: any) => {
                  return [
                    ...prev,
                    ...[{ id: item?.userId, permission: value }],
                  ];
                });
              }
            }}
            size="large"
            placeholder="Select"
            options={VIEWS}
          />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
};

const AddDataRoomStep3 = ({
  setStep,
  handleSubmit,
  peoples,
  inputData,
  setInputData,
  vdrLoading,
  loading,
  edit = false,
  addUserModalRef
}: TProps) => {
  const userAccess = useAccessLevel()
  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <Space size={24} />
      {setStep && <> <FlexBox alignItems="center" gap={10}>
        <span className={styles.barActive}></span>
        <span className={styles.barActive}></span>
        <span className={styles.barActive}></span>
      </FlexBox>
      <Space size={24} />
      <FlexBox justifyContent="space-between" alignItems="center">
        <Typography size="huge" darkBlue={true}>
            Manage Members
        </Typography>
      </FlexBox> </>}

      <Space size={24} />
      <FlexBox flexDirection="column" gap={12}>
        {peoples?.length &&
          peoples.map((item: any) => (
            <PersonCard
              adminId={userAccess?.userId}
              inputData={inputData}
              setInputData={setInputData}
              item={item}
              key={item.id}
            />
          ))}
      </FlexBox>
      <Space size={24} />
      <FlexBox gap={5} justifyContent="flex-end">
        {edit && (
          <Button
            className={styles.inviteBtn}
            onClick={() => addUserModalRef.current.open()}
          >
            Invite User
          </Button>
        )}
        <Button loading={vdrLoading} className={styles.formButton} onClick={handleSubmit}>
          {`${edit ? "Edit" : "Add"} Members`}
        </Button>
      </FlexBox>
    </div>
  )
}

export default AddDataRoomStep3;
