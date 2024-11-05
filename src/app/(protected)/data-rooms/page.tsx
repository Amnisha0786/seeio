"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { Row, Col, Dropdown } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

import Typography from '@/components/typography'
import ScollablePage from '@/components/scollable-page'
import Container from '@/components/container'
import Space from '@/components/space'
import Clickable from '@/components/clickable'
import Button from '@/components/button'
import Loading from '@/components/loading'
import FlexBox from '@/components/flex-box'
import * as API from '@/api'
import { COMPANY_USER_ACCESS_LEVEL, TVdr } from '@/models'
import { useCompanyRole, useBreadcrumbs, useSelectedAccountCompany, useAccessLevel } from '@/hooks'
import styles from './page.module.scss'
import CreateDataRoomModal from './create-data-room-modal'
import { openDownloadDialog } from '@/utils/file-reader';
import Toast from '@/components/toast';
import Status from '@/components/status'
import ConfirmDelete from '@/shared/confirm-delete'
import { getVDRStatus } from '@/utils/misc'
import Icon from '@/components/icon'

const Page = () => {
  const [dataRooms, setDataRooms] = useState<TVdr[]>([])
  const [initing, setIniting] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteVdrId, setDeleteVdrId] = useState<string>("")
  const createModalRef = useRef<any>()
  const router = useRouter()
  const role = useCompanyRole()
  const breadcrumbs = useBreadcrumbs()
  const companyId = useSelectedAccountCompany()?.companyId
  const userAccess = useAccessLevel()

  const deleteModelRef: any = useRef();

  const fetchData = useCallback(async () => {
    setIniting(true)

    try {
      if (!companyId) return
      const result = await API.getVdrFolder({ companyId })
      setDataRooms(result || [])
    } finally {
      setIniting(false)
    }
  }, [companyId])

  useEffect(() => {
    fetchData()

    breadcrumbs.set([{
      title: "Data Rooms",
      link: "/data-rooms"
    }])
    // eslint-disable-next-line
  }, [companyId])

  const onItemClick = (dataRoom: TVdr) => {
    breadcrumbs.add({
      title: dataRoom.name,
      link: `/data-rooms/${dataRoom.id}`
    })

    router.push(`/data-rooms/${dataRoom.id}`)
  }

  const onDownload = async (e: any, vdrId: string) => {
    if (!companyId) { return }
    e.domEvent.stopPropagation();
    setDownloading(true)
    try {
      const data = await API.getVdrDownloadLink({
        companyId,
        vdrId,
      });
      setDownloading(false)
      if (data) {
        openDownloadDialog({ url: data.url, filename: 'dataroom' });
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
      setDownloading(false)
    } finally {
      setDownloading(false)
    }
  };

  const deleteVdr = async () => {
    if (!companyId) { return }
    setDeleting(true)
    try {
      await API.deleteVdr(
        companyId,
        deleteVdrId,
      );
      setDeleting(false)
      deleteModelRef?.current?.close();
      fetchData()
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
      setDeleting(false)
    } finally {
      setDeleting(false)
    }
  };

  const onDelete = (e: any, vdrId: string) => {
    e.domEvent.stopPropagation();
    setDeleteVdrId(vdrId)
    deleteModelRef?.current?.open();
  }

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        <Typography size='enormous' darkBlue>Virtual Data Rooms</Typography>
        <Space size={32} />
        <Space size={24} />
        {initing || downloading ? (
          <Loading size="small" />
        ) : (
          <>
            {<Row gutter={[24, 24]}>
              {dataRooms.map((dataRoom) => (
                <Col span={10} key={dataRoom.id}>
                  <Clickable
                    className={`${styles.roomBox} ${downloading ? styles?.pointerEvent : ""}`}
                    onClick={() => onItemClick(dataRoom)}
                  >
                    <FlexBox justifyContent='space-between' alignItems='center'>
                      <Typography size='huge'>{dataRoom.name}</Typography>
                      {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <Dropdown
                        menu={{
                          items: dataRoom?.editAccess?.users?.filter((user) => user === userAccess?.userId)?.length > 0 ? [
                            {
                              label: 'Download',
                              key: '2',
                              onClick: (e) => onDownload(e, dataRoom.id),
                            },
                            {
                              label: 'Delete',
                              key: '1',
                              onClick: (e) => onDelete(e, dataRoom.id),
                            },
                          ] : [
                            {
                              label: 'Download',
                              key: '2',
                              onClick: (e) => onDownload(e, dataRoom.id),
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
                      </Dropdown>}
                    </FlexBox>
                    <Space size={16} />
                    <Typography size='large' gray>

                    </Typography>
                    <Space size={24} />
                    <Typography color='#797E92'>{dataRoom?.description}</Typography>
                    <Space size={24} />

                    <FlexBox alignItems='center' justifyContent='space-between'>
                      <div></div>
                      <FlexBox
                        justifyContent='center'
                        alignItems='center'
                      >
                        <Status title={getVDRStatus(dataRoom?.status)?.title || ''} color={getVDRStatus(dataRoom?.status)?.color} />

                      </FlexBox>
                    </FlexBox>
                  </Clickable>
                </Col>
              ))}
              {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && role === "company" ? (
                <Col span={10}>
                  <FlexBox className={styles.addButton} justifyContent="center" alignItems='center'>
                    <Button
                      type="primary"
                      onClick={() => createModalRef.current.open()}
                    >
                      Add Data Room
                    </Button>
                  </FlexBox>
                </Col>
              ) : (dataRooms?.length < 1 && (
                <>
                  <Col span={24}>
                    <FlexBox flexDirection="column" className={styles?.noRecords} alignItems="center" justifyContent='center'>
                      <Space size={50} />
                      <Icon name="white-file" size={60} />
                      <Space size={16} />
                      <Typography color="#005F73" size="giant" bold>
                        No virtual data rooms found
                      </Typography>

                      <Space size={50} />
                    </FlexBox>
                  </Col>
                </>
              ))}
            </Row>}
          </>
        )}
        <CreateDataRoomModal ref={createModalRef} onSuccess={fetchData} />
      </Container>
      <Space size={50} />
      <ConfirmDelete
        ref={deleteModelRef}
        handleConfirm={deleteVdr}
        loading={deleting}
        message={"Are you sure you want to delete the Data Room?"}
      />
    </ScollablePage>
  );
};

export default Page;
