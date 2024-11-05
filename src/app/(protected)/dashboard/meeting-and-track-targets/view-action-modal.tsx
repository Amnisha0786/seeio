import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import dayjs from 'dayjs';
import Image from "next/image";

import Typography from '@/components/typography';
import FlexBox from '@/components/flex-box';
import Space from '@/components/space';
import Modal from '@/components/modal';
import Loading from '@/components/loading';
import { TAction } from '@/models';
import Status from '@/components/status';
import Clickable from '@/components/clickable'
import useAmplitudeContext from '@/hooks/amplitude'
import { useAccessLevel } from '@/hooks'
import { EVENT_NAME, PLATFORM } from '@/contexts/AmplitudeContext'

const ViewActionModal = forwardRef(({
  handleEdit,
}: {
  handleEdit: (record: TAction | null) => void;
},
ref
) => {
  const [open, setOpen] = useState(false);
  const userAccess = useAccessLevel()
  const [actionDetails, setActionDetails] = useState<TAction | null>(null);
  const { trackAmplitudeEvent } = useAmplitudeContext();
  const url = typeof window !== 'undefined' ? window.location.href : ""

  useEffect(() => {
    if (actionDetails) {
      trackAmplitudeEvent(EVENT_NAME.SCREEN_VIEWED, {
        page_or_modal_name: 'board_meeting_page',
        page_url: url,
        user_id: userAccess?.userId,
        viewed_at: new Date().valueOf(),
        platform: PLATFORM.WEB,
        detail_name: actionDetails?.name
      });
    }
  }, [actionDetails])

  const handleCancel = () => {
    setOpen(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (action: TAction) => {
        if (action) {
          setActionDetails(action);
        }
        setOpen(true);
      },
      close: () => setOpen(false),
    }),
    []
  );

  const onClickEdit = () => {
    handleEdit(actionDetails)
    setOpen(false)
  };

  const getStatusColor = (record: TAction) => {
    let status = {
      label: "Due",
      color: "green"
    }
    if (dayjs(record.dueDate) < dayjs(new Date())) {
      status = {
        label: "Overdue",
        color: "red"
      }
    } else if (dayjs(record.dueDate) < dayjs(new Date()).add(5, 'day')) {
      status = {
        label: "Pending",
        color: "yellow"
      }
    } else {
      status = {
        label: "Due",
        color: "green"
      }
    }
    return status;
  }
  return (
    <Modal open={open} width={600} onCancel={handleCancel}>
      <Space size={10} />
      {!actionDetails ? (
        <Loading size="small" />
      ) : (
        <>
          <FlexBox alignItems='center'>

            <Typography size="giant">Action Details</Typography>
            <Space horizontal size={10} />
            <Clickable onClick={onClickEdit}>
              <Image
                src="/icons/edit-icon.svg"
                alt="edit icon"
                width={24}
                height={24}
              />
            </Clickable>
          </FlexBox>
          <Space size={25} />
          <FlexBox flexDirection="column">
            <FlexBox >
              <FlexBox flexDirection="column" flex={1}>
                <FlexBox>
                  <Typography gray>Action Name</Typography>
                </FlexBox>
                <Space size={5} />
                <Typography size="large">{actionDetails?.name}</Typography>
              </FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <FlexBox>
                  <Typography gray>Due by Date</Typography>
                </FlexBox>
                <Space size={5} />
                <Typography size="large">
                  {actionDetails?.dueDate
                    ? dayjs(actionDetails?.dueDate).format("DD/M/YYYY")
                    : "-"}
                </Typography>
              </FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <FlexBox>
                  <Typography gray>Owner</Typography>
                </FlexBox>
                <Space size={5} />
                <Typography size="large">
                  {`${actionDetails?.owner?.firstName} ${actionDetails?.owner?.lastName}`}
                </Typography>
              </FlexBox>
            </FlexBox>
          </FlexBox>
          <Space size={10} />

          {actionDetails?.meeting && (

            <FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Typography gray>Board Meeting Date</Typography>
                <Space size={5} />

                <Typography size="large">
                  {actionDetails?.meeting ? dayjs(actionDetails?.meeting?.date).format('MMM DD YYYY h:mm a') : "-"}
                </Typography>
              </FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Typography gray>Board Meeting Name</Typography>
                <Space size={5} />
                <Typography size="large">{actionDetails?.meeting ? actionDetails?.meeting?.name : "-"}</Typography>


              </FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Typography gray>Created</Typography>
                <Space size={5} />
                <Typography size="large">
                  {actionDetails?.meeting ? dayjs(actionDetails?.meeting?.dateCreated).format('MMM DD YYYY h:mm a') : "-"}
                </Typography>


              </FlexBox>
            </FlexBox>
          )}

          <>
            <Space size={25} />

            <FlexBox>
              {actionDetails?.status && (

                <FlexBox flexDirection="column" flex={1}>
                  <Space size={5} />
                  <Status
                    title={getStatusColor(actionDetails).label}
                    color={getStatusColor(actionDetails).color}
                  />
                </FlexBox>
              )}
              <Space horizontal size={4} />
              <FlexBox flexDirection="column" flex={1}>
                <Typography gray>Agenda Item</Typography>
                <Space size={5} />
                <Typography size="large">{actionDetails?.agendaName ? actionDetails?.agendaName : "-"}</Typography>


              </FlexBox>
              <FlexBox flexDirection="column" flex={1}>
                <Typography gray>Start Date</Typography>
                <Space size={5} />
                <Typography size="large">{actionDetails?.startedAt ? dayjs(actionDetails?.startedAt).format('MMM DD YYYY h:mm a') : "-"}</Typography>
              </FlexBox>

            </FlexBox>
          </>
          <Space size={25} />
          <FlexBox flexDirection="column" justifyContent="space-between">
            <FlexBox flexDirection="column">
              <FlexBox>
                <Typography gray>Description</Typography>
              </FlexBox>
              <Space size={5} />
              <Typography size="large">{actionDetails?.description}</Typography>
            </FlexBox>
          </FlexBox>
          <Space size={25} />
        </>
      )}
    </Modal>
  );
});

ViewActionModal.displayName = 'ViewActionModal';

export default ViewActionModal;
