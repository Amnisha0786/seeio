import decamelizeKeys from 'decamelize-keys'

import { MainApi, NoCamelcaseApi } from './endpoint'
import { TDataRoom, TDataRoomDocument, TStorageObject, TDataroomFolderItem, TAddToDataRoom, Access, TVdr } from '@/models'
import MockApi from '@/utils/mock-api'

type TCreateDataRoomPayload = {
  company_id: string
  company_name: string
  dataroom_name: string
  description: string
}

export type TGetDataRoomDetailsResponse = {
  items: TStorageObject[]
  name: string
  description: string
  id: string
}

type TDataRoomAddDocumentPayload = {
  companyId: string,
  dataroomId: string,
  parentFolderId: string
  name: string
  description: string
  fileName: string
  fileBinary: ArrayBuffer | undefined
  active?: boolean
  needsReview?: boolean
}

type TGetDataFolderDetailsResponse = {
  folderId: string,
  folderName: string,
  folderDescription: string,
  folder: TDataroomFolderItem[]
}

type TGetDataroomDocumentResponse = {
  id: string,
  name: string,
  description: string,
  dateCreated: string,
  createdBy: string,
  fileUrl: string
  fileType: string,
  fileSize: number
};

export type AccessObject = {
  editAccess: Access;
  viewAccess: Access;
};

type TSelectedvdr = {
  recordType?: string;
  record?: {
    categoryId: string;
    documentId: string;
    parentId?: string;
  };
  register?: {
    categoryId: string;
    documentId: string;
    parentId?: string;
  };
  vdrIds?: string[]
}

export const getDataRooms = ({ companyId }: { companyId: string }): Promise<{ num_datarooms: number, datarooms?: TDataRoom[] }> => {
  return MainApi.get(`/company/${companyId}/dataroom/list`)
}

export const getVdr = ({ companyId, vdrId }: { companyId: string, vdrId: string }): Promise<any> => {
  return MainApi.get(`/company/${companyId}/vdr/${vdrId}`)
}

export const getFilesVdr = ({ companyId, vdrId, parentId, recordType }: { companyId: string, vdrId: string, parentId: string, recordType?: string | null }): Promise<any> => {
  return MainApi.get(`/company/${companyId}/vdr/${vdrId}/${parentId}?record_type=${recordType}`)
}

export const getReportVdr = ({ companyId, vdrId, recordType }: { companyId?: string, vdrId: string, recordType: string }): Promise<any> => {
  return MainApi.get(`/company/${companyId}/vdr/${vdrId}/reports?record_type=${recordType}`)
}

export const updateVdrStatus = ({ companyId, vdrId, parentId, payload }: {
  companyId?: string, vdrId: string, parentId: string, payload: {
    status?: string,
    isVisible: boolean,
    recordType: string
  }
}): any => {
  return MainApi.patch(`/company/${companyId}/vdr/${vdrId}/${parentId}`, decamelizeKeys(payload))
}

export const getVdrFolder = ({ companyId }: { companyId: string }): Promise<TVdr[]> => {
  return MainApi.get(`/company/${companyId}/vdr`)
}

export const getDataRoomsDownloadLink = ({
  companyId,
  dataRoomId,
  folderId
}: { companyId: string | undefined, dataRoomId: string, folderId?: string }): Promise<any> => {
  let url = `/company/${companyId}/dataroom/${dataRoomId}/bulk`
  if (folderId) {
    url = url + `?folder_id=${folderId}`
  }
  return MainApi.get(url)
}

export const getVdrDownloadLink = ({
  companyId,
  vdrId,
}: { companyId: string | undefined, vdrId: string }): Promise<any> => {

  return MainApi.get(`/company/${companyId}/vdr/${vdrId}/download`)
}

export const vdrAccess = ({ companyId, vdrId, payload }: { companyId?: string, vdrId?: string, payload: AccessObject }): Promise<any> => {
  return MainApi.put(`/company/${companyId}/vdr/${vdrId}/access`, { ...decamelizeKeys(payload) })
}

export const getVdrAccess = ({ companyId, vdrId }: { companyId?: string, vdrId?: string }): Promise<any> => {
  return MainApi.get(`/company/${companyId}/vdr/${vdrId}/access`);
}

export const getSelectedVdr = ({
  companyId,
  payload,
}: {
  companyId?: string;
  payload: TSelectedvdr;
}): Promise<string[]> => {
  return MainApi.post(
    `/company/${companyId}/vdr/reference`,
    decamelizeKeys(payload, { deep: true })
  );
};

export const addToVdr = ({
  companyId,
  payload,
}: {
  companyId?: string;
  payload: TSelectedvdr;
}): Promise<any> => {
  return MainApi.put(
    `/company/${companyId}/vdr/reference`,
    decamelizeKeys(payload, { deep: true })
  );
};

export const createDataRoom = (payload: TCreateDataRoomPayload): Promise<TDataRoom> => {
  return MainApi.post(`/company/${payload.company_id}/dataroom`, decamelizeKeys(payload))
}

export const createVdr = (payload: any): Promise<any> => {
  return MainApi.post(`/company/${payload.company_id}/vdr`, decamelizeKeys(payload))
}

export const deleteVdr = (companyId: string, vdrId: string): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/vdr/${vdrId}`, {
    status: "DELETED"
  })
}

export const addDataRoom = (companyId: string | undefined, dataRoomId: string, payload: TAddToDataRoom): Promise<TDataRoom> => {
  return MainApi.post(`/company/${companyId}/dataroom/${dataRoomId}/import`, decamelizeKeys(payload))
}

export const getDataRoomDetails = ({ companyId, dataRoomId }: { companyId: string, dataRoomId: string }): Promise<TGetDataRoomDetailsResponse> => {
  return MainApi.get(`/company/${companyId}/dataroom/${dataRoomId}`)
}
export const getDataRoomFolder = ({
  companyId,
  dataRoomId,
  folderId
}: {
  companyId: string,
  dataRoomId: string,
  folderId: string
}): Promise<TGetDataFolderDetailsResponse> => {
  return MainApi.get(`/company/${companyId}/dataroom/${dataRoomId}/folder/${folderId}`)
}

export const getDataRoomDocument = (
  { companyId, dataroomId, documentId }: { companyId: string, dataroomId: string, documentId: string }
): Promise<TGetDataroomDocumentResponse> => {

  return MainApi.get(`/company/${companyId}/dataroom/${dataroomId}/document/${documentId}`)
}

export const addDataRoomDocument = async (payload: TDataRoomAddDocumentPayload): Promise<any> => {
  const response = await MainApi.post(
    `/company/${payload.companyId}/dataroom/${payload.dataroomId}/document`,
    decamelizeKeys({
      name: payload.name,
      parent_id: payload.parentFolderId,
      description: payload.description,
      file_name: payload.fileName
    })
  );
  const upload_url = response.uploadUrl;

  if (upload_url) {
    await fetch(upload_url, {
      method: 'PUT',
      body: payload.fileBinary
    });
  }

  return response;
}

export const updateDataRoomDocument = async (data: TDataRoomDocument): Promise<any> => {
  return MockApi({
    data: {
      message: "Document updated successfully.",
      document: data
    }
  })
}


export const getDataRoomsStructure = ({ companyId }: { companyId?: string }): Promise<any> => {
  return NoCamelcaseApi.get(`/company/${companyId}/vdr/structure`)
}
