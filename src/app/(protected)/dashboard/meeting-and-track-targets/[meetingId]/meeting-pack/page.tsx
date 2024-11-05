"use client"

import { useRef, useMemo, useState, useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { EllipsisOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd'

import { TColumn } from '@/components/table'
import Space from '@/components/space'
import Button from '@/components/button'
import FlexBox from '@/components/flex-box'
import { MeetingDetailsContext } from '../context'
import TableWithHeaderControls from '@/shared/table/table';
import AddButton from '@/components/add-button'
import Breadcrumbs from '@/components/breadcrumbs'
import { useSelectedAccountCompany } from '@/hooks'
import * as API from '@/api'
import { TMeetingPack } from '@/models'
import Action1Modal from './action-1-modal'
import AddDocumentModal from './add-document-modal'
import Clickable from '@/components/clickable'
import styles from "./page.module.scss"
import ConfirmDelete from '@/shared/confirm-delete'
import Toast from '@/components/toast'

const Page = ({ params: { meetingId } }: { params: { meetingId: string } }) => {
  const [data, setData] = useState<TMeetingPack[]>([])
  const { meetingDetails } = useContext(MeetingDetailsContext)
  const [search, setSearch] = useState("")
  const [initing, setIniting] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState<string | undefined>();
  const action1ModalRef = useRef<any>()
  const addDocumentModalRef = useRef<any>()
  const router = useRouter()
  const companyId = useSelectedAccountCompany()?.companyId
  const deleteModelRef = useRef<any>();
  const [deleting, setDeleting] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<TMeetingPack>();


  const deleteAction = async () => {
    try {
      setDeleting(true);
      if (!companyId || !actionToDelete) return;
      await API.deleteMeetingPack({ companyId, meetingId: meetingId, documentId: actionToDelete?.id, docType: actionToDelete?.documentType });
      fetchData();
    } catch (err: any) {
      Toast.error(err.message || 'Something went wrong.');
    } finally {
      setDeleting(false);
      deleteModelRef?.current?.close();
    }
  };

  const fetchData = useCallback(async () => {
    if (!companyId || !meetingId) return

    setIniting(true)

    try {
      const result = await API.getMeetingPack({ companyId, meetingId })
      if (result) {
        setData(result.docs)
      }
    } finally {
      setIniting(false)
    }
  }, [companyId, meetingId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onClickDeleteOption = (action?: TMeetingPack) => {
    deleteModelRef.current.open();
    setActionToDelete(action);
  };

  const onRowClick = (record: TMeetingPack) => {
    router.push(`/dashboard/meeting-and-track-targets/${meetingId}/meeting-pack/document/${record.id}/${record.documentType}`)
  }

  const columns = useMemo<TColumn<TMeetingPack>[]>(() => ([{
    key: "documentType",
    title: "Document type",
    width: 350,
  }, {
    key: "documentDate",
    title: "Document Date",
    render: (record) => record?.documentDate ? moment(record?.documentDate).format("DD/MM/YYYY") : moment(record?.dateGenerated).format("DD/MM/YYYY")
  }, {
    key: "dateGenerated",
    title: "Date generated",
    render: (record) => record?.dateGenerated ? moment(record?.dateGenerated).format("DD/MM/YYYY") : "-"
  },
  {
    key: 'dropdown',
    width: 100,
    render: (record) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown
          menu={{
            items: [
              {
                label: 'Delete',
                key: '2',
                onClick: () => {

                  onClickDeleteOption(record)
                },
              },
            ],
          }}
          trigger={['click']}
        >
          <Clickable
            className={styles.optionButton}
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisOutlined />
          </Clickable>
        </Dropdown>
      </div>
    ),
  },
  ]), [])

  const onSuccess = () => {
    setIniting(true);
    setTimeout(() => {
      fetchData()
    }, 2000);
  }

  if (!meetingDetails) return null

  return (
    <>
      <Breadcrumbs
        items={[{
          title: "Meetings",
          link: "/dashboard/meeting-and-track-targets"
        }, {
          title: meetingDetails.name,
          // eslint-disable-next-line max-len
          link: `/dashboard/meeting-and-track-targets/${meetingId}/status/${meetingDetails?.status === "closed" ? "ended" : meetingDetails?.status === "open" ? "started" : meetingDetails.status}`
        }, {
          title: "Meeting Pack"
        }]}
      />
      <Space size={24} />
      <TableWithHeaderControls
        onRowClick={onRowClick}
        title="Meeting pack"
        data={data}
        initing={initing}
        search={search}
        setSearch={setSearch}
        columns={columns}
        selectedSortValue={selectedSortValue}
        setSelectedSortValue={setSelectedSortValue}
      />
      <Action1Modal ref={action1ModalRef} />
      <AddDocumentModal ref={addDocumentModalRef} meetingId={meetingId} onSuccess={onSuccess} />
      <Space size={24} />
      <FlexBox justifyContent="flex-end">
        <Button>
          Display selected
        </Button>
        <Space horizontal size={24} />
        <AddButton onClick={() => addDocumentModalRef.current.open()} />
      </FlexBox>
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteAction}
        loading={deleting}
        message={'Are you sure you want to delete the item?'}
      />
    </>
  )
}

export default Page
