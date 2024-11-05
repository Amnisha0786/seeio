import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as API from "@/api";

import Typography from "@/components/typography";
import FlexBox from "@/components/flex-box";
import Space from "@/components/space";
import Modal from "@/components/modal";
import Loading from "@/components/loading";
import { TAction } from "@/models";
import styles from "./page.module.scss";

const ViewLogsModal = forwardRef(({ }, ref) => {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState<TAction | null>(null);
  const [actionLogs, setActionLogs] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (action: TAction) => {
        if (action) {
          setData(action);
        }
        setOpen(true);
      },
      close: () => setOpen(false),
    }),
    []
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await API.getActionLogs({
        companyId: data?.companyId,
        actionId: data?.id,
      });
      setActionLogs(result);
      setLoading(false);
    };
    fetchData();
  }, [data]);

  return (
    <Modal open={open} width={350} onCancel={handleCancel}>
      <Space size={10} />
      {!actionLogs || loading ? (
        <Loading size="small" />
      ) : (
        <>
          <FlexBox alignItems="center" flexDirection="column">
            <Typography size="giant">Action Logs</Typography>
          </FlexBox>
          <Space size={20} />
          <div className={styles.logModal}>
            {actionLogs.length ? (
              <FlexBox alignItems="center" flexDirection="column">
                <FlexBox flexDirection="column">
                  {actionLogs.map((item, index) => (
                    <div className={styles.logItem} key={index}>
                      <Typography size="large">{item}</Typography>
                    </div>
                  ))}
                </FlexBox>
              </FlexBox>
            ) : (
              <FlexBox alignItems="center" flexDirection="column">
                <FlexBox flexDirection="column">
                  <div className={styles.logItem}>
                    <Typography size="large">No records found</Typography>
                  </div>
                </FlexBox>
              </FlexBox>
            )}

          </div>
        </>
      )}
    </Modal>
  );
});

ViewLogsModal.displayName = "ViewLogsModal";

export default ViewLogsModal;
