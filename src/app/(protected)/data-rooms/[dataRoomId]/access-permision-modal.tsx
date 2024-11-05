import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import Modal from "@/components/modal";
import Typography from "@/components/typography";
import * as API from "@/api";
import styles from "../create-data-room-modal.module.scss";
import { useSelectedAccountCompany } from "@/hooks";
import AddDataRoomStep3 from "../addDataRoomForm/step-3";

type IProps = {
  onSuccess: () => void;
  dataRoomId: string,
  peoplesValue: {
    id: string,
    permission: string,
  }[],
  addUserModalRef?: any
}
const AddMemberModal = forwardRef(
  (
    { onSuccess, dataRoomId, peoplesValue, addUserModalRef }: IProps,
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const companyId = useSelectedAccountCompany()?.companyId;
    const [vdrLoading, setVdrLoading] = useState(false);
    const [peoples, setPeoples] = useState<API.TUsers[]>();
    const [inputData, setInputData] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setInputData(peoplesValue)
    }, [peoplesValue])

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          setOpen(true);
        },
        close: () => {
          setOpen(false);
        },
      }),
      []
    );

    const fetchPeopleData = async () => {
      if (!companyId) return;

      try {
        setLoading(true);

        const result = await API.getUsers(companyId, "active");
        if (result?.users) {
          setPeoples(result?.users);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchPeopleData();
    }, [companyId]);

    const addMembers = async () => {
      if (!companyId || !dataRoomId) {
        return;
      }
      try {
        setVdrLoading(true);
        await API.vdrAccess({
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
        setVdrLoading(false);
        setOpen(false);
        onSuccess();
      } catch (error) {
        setVdrLoading(false);
      }
    };

    return (
      <Modal
        open={open}
        width={780}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <div className={styles.modal}>
          <Typography size="huge">Manage Members</Typography>
          <AddDataRoomStep3
            edit={true}
            loading={loading}
            vdrLoading={vdrLoading}
            handleSubmit={addMembers}
            peoples={peoples}
            inputData={inputData}
            addUserModalRef={addUserModalRef}
            setInputData={setInputData}
          />
        </div>
      </Modal>
    );
  }
);
AddMemberModal.displayName = "AddMemberModal";

export default AddMemberModal;
