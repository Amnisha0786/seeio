"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { Row, Col, Dropdown, Empty } from 'antd'
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
import { COMPANY_USER_ACCESS_LEVEL, TDataRoom } from '@/models'
import { useCompanyRole, useBreadcrumbs, useAccessLevel } from '@/hooks'
import styles from '../../page.module.scss'
import CreateDataRoomModal from '../../create-data-room-modal'
import CompanySwitch from '../../company-switch'
import { openDownloadDialog } from '@/utils/file-reader';
import Toast from '@/components/toast';

interface Props { params: { companyId: string } }
const Page = ({ params: { companyId } }: Props) => {
  const [dataRooms, setDataRooms] = useState<TDataRoom[]>([])
  const [initing, setIniting] = useState(true)
  const createModalRef = useRef<any>()
  const router = useRouter()
  const role = useCompanyRole()
  const breadcrumbs = useBreadcrumbs()
  const userAccess = useAccessLevel()

  const fetchData = useCallback(async () => {
    setIniting(true)

    try {
      if (!companyId) return

      const result = await API.getDataRooms({ companyId })
      setDataRooms(result.datarooms || [])
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

  const onItemClick = (dataRoom: TDataRoom) => {
    breadcrumbs.add({
      title: dataRoom.name,
      link: `/data-rooms/${dataRoom.id}`
    })

    router.push(`/data-rooms/${dataRoom.id}`)
  }

  const onClickOption = async (e: any, dataRoomId: string) => {
    e.domEvent.stopPropagation();
    setIniting(true)
    try {
      const data = await API.getDataRoomsDownloadLink({
        companyId,
        dataRoomId,
      });
      if (data) {
        openDownloadDialog({ url: data.url, filename: 'dataroom' });
      }
    } catch (error: any) {
      Toast.error(error?.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  };

  return (
    <ScollablePage className={styles.page}>
      <Space size={32} />
      <Container>
        {role === "investor" && (
          <CompanySwitch />
        )}
        {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && role === "company" && (
          <FlexBox justifyContent="flex-end">
            <Button
              type="primary"
              onClick={() => createModalRef.current.open()}
            >
              Create Data Room
            </Button>
          </FlexBox>
        )}
        <Space size={24} />
        {initing ? (
          <Loading size="small" />
        ) : dataRooms.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Row gutter={[24, 24]}>
            {dataRooms.map((dataRoom) => (
              <Col span={6} key={dataRoom.id}>
                <Clickable
                  className={styles.roomBox}
                  onClick={() => onItemClick(dataRoom)}
                >
                  <FlexBox justifyContent='space-between' alignItems='center'>
                    <Typography size='huge'>{dataRoom.name}</Typography>
                    {userAccess?.accessLevel !== COMPANY_USER_ACCESS_LEVEL.BOARD_MEMBER && <Dropdown
                      menu={{
                        items: [
                          // {
                          //   label: 'Rename',
                          //   key: '0',
                          // },
                          // {
                          //   label: 'Delete',
                          //   key: '1',
                          // },
                          {
                            label: 'Download',
                            key: '2',
                            onClick: (e) => onClickOption(e, dataRoom.id),
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
                    {dataRoom.numFiles} files
                  </Typography>
                  <Space size={16} />
                  <FlexBox
                    className={styles.statusBox}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Typography size='small'>Public</Typography>
                  </FlexBox>
                </Clickable>
              </Col>
            ))}
          </Row>
        )}
        <CreateDataRoomModal ref={createModalRef} onSuccess={fetchData} />
      </Container>
      <Space size={50} />
    </ScollablePage>
  );
};

export default Page;
