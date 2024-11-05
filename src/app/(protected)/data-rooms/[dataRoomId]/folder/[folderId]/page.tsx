"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

import ScollablePage from '@/components/scollable-page'
import Space from '@/components/space'
import * as API from '@/api'
import { TDataRoomFolder, TStorageObject } from '@/models'
import FolderView from '@/shared/folder-view/folder-view';
import { useBreadcrumbs, useCompanyRole, useSelectedAccountCompany } from '@/hooks'
import FlexBox from '@/components/flex-box'
import AddFolderModal from '../../add-folder-modal'
import AddDocumentModal from '../../add-document-modal'
import Container from '@/components/container'
import Button from '@/components/button'
import Toast from '@/components/toast'

interface Params {
  dataRoomId: string;
  folderId: string;
}

interface IProps {
  params: Params
}

const Page = ({ params: { dataRoomId, folderId } }: IProps) => {
  const [data, setData] = useState<TDataRoomFolder>({
    folderName: "",
    folderId: folderId,
    folderDescription: "",
    folder: []
  })

  const [initing, setIniting] = useState(true)
  const router = useRouter()
  const role = useCompanyRole()
  const addFolderModalRef = useRef<any>()
  const addDocumentModalRef = useRef<any>()
  const breadcrumbs = useBreadcrumbs()
  const companyId = useSelectedAccountCompany()?.companyId;

  const fetchData = useCallback(async () => {
    setIniting(true)

    try {
      const result = await API.getDataRoomFolder({ companyId: companyId!, dataRoomId, folderId })
      setData(result)
    } catch (err: any) {
      Toast.error(err.message || "Something went wrong.")
    } finally {
      setIniting(false)
    }
  }, [companyId, dataRoomId, folderId])

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line
  }, [])

  const onRowClick = (record: TStorageObject) => {
    if (record.type === "folder") {
      router.push(`/data-rooms/${dataRoomId}/folder/${record.id}`)

      breadcrumbs.add({
        title: `${record.name}`,
        link: `/data-rooms/${dataRoomId}/folder/${record.id}`
      })
    } else if (record.type === "document") {
      router.push(`/data-rooms/${dataRoomId}/document/${record.id}`)

      breadcrumbs.add({
        title: `${record.name}`,
        link: `/data-rooms/${dataRoomId}/document/${record.id}`
      })
    }
  }

  const onSuccess = () => {
    fetchData()
  }
  
  return (
    <ScollablePage>
      <Space size={32} />
      <Container>
        <FolderView
          data={data.folder}
          initing={initing}
          title={data.folderName}
          onRowClick={onRowClick}
        />
        <Space size={20} />
        {role === "company" && (
          <FlexBox justifyContent="flex-end">
            <Button
              onClick={() => addFolderModalRef.current.open()}
            >
              Add Folder
            </Button>
            <Space size={20} horizontal />
            <Button
              type="primary"
              onClick={() => addDocumentModalRef.current.open()}
            >
              Add Document
            </Button>
          </FlexBox>
        )}
        <AddFolderModal
          dataRoomId={dataRoomId}
          ref={addFolderModalRef}
          parentFolderId={folderId}
          onSuccess={onSuccess}
        />
        <AddDocumentModal
          dataRoomId={dataRoomId}
          ref={addDocumentModalRef}
          parent_folder_id={folderId}
          onSuccess={onSuccess}
        />
        <Space size={50} />
      </Container>
    </ScollablePage>
  )
}

export default Page
