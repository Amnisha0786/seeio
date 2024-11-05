import decamelizeKeys from 'decamelize-keys'

import { MainApi } from './endpoint'
import { TMeeting, TMeetingDetails, TMeetingPack, TMeetingPackDocument } from '@/models'
import { MEETING_AGENDA_STATUS } from '@/constants'

type TAddMeetingReq = {
  companyId: string
  location: string
  date: string
  isVirtual: boolean
}

type TUpdateMeetingReq = {
  companyId: string
  meetingId: string
  status?: 'planned' | 'open' | 'closed'
  agendaStatus?: MEETING_AGENDA_STATUS
}

type TGetMinutesDoc = {
  companyId: string
  meetingId: string
}

type TRefreshMeetingReq = {
  companyId: string
  meetingId: string
}

type TDeleteMeetingReq = {
  companyId: string
  meetingIds: string[]
}

type TUpdateCategoryReq = {
  companyId: string
  meetingId: string
  categoryId: string
  topicOrderIds?: string[]
}

type TUpdateTopicCategoryReq = {
  companyId: string
  meetingId: string
  topicId: string,
  moveAgenda: {
    fromId: string,
    toId: string
  }
}

type SaveTemplate = {
  companyId: string
  meetingId: string
  topicIds: string[],
  agendaId: string
}

type TUpdateTopicReq = {
  companyId: string
  meetingId: string
  categoryId: string
  topicId: string
  topicType: string
  updateAttributes: any
}

type TCreateTopicReq = {
  companyId: string
  meetingId: string
  categoryId: string
  name: string
  presenter: string
  notes: string
  documents: string[]
  timeAlloted?: number
}

type TDeleteTopicReq = {
  companyId: string
  meetingId: string
  categoryId: string
  topicId: string
}

type TGetTopics = {
  companyId: string
  meetingId: string
}

type TCreateOrUpdateTopicRes = {
  documents: {
    documentId: string
    fileName: string
    uploadUrl: string
  }[]
}

type TGetMeetingPackRes = {
  numDocs: number,
  docs: TMeetingPack[]
}

type TGetMeetingPackDocumentReq = {
  companyId: string
  meetingId: string
  documentId: string
  documentType: string
}

type TUploadTranscipt = {
  companyId: string;
  meetingId: string;
  file?: File | null;
};

export const getMeetings = ({ companyId }: { companyId: string }): Promise<{ meetings: TMeeting[], numMeetings: number }> => {
  return MainApi.get(`/company/${companyId}/meeting/list`)
}

export const getMeetingDetails = ({ companyId, meetingId }: { companyId: string, meetingId: string }): Promise<TMeetingDetails> => {
  return MainApi.get(`/company/${companyId}/meeting/${meetingId}`)
}

export const addMeeting = ({ companyId, ...payload }: TAddMeetingReq): Promise<any> => {
  return MainApi.post(`/company/${companyId}/meeting/`, decamelizeKeys(payload))
}

export const updateMeeting = ({ companyId, meetingId, ...payload }: TUpdateMeetingReq): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/meeting/${meetingId}`, decamelizeKeys(payload))
}

export const deleteMeeting = ({ companyId, ...payload }: TDeleteMeetingReq): Promise<any> => {
  return MainApi.delete(`/company/${companyId}/meeting/delete`, decamelizeKeys(payload))
}

export const updateCategory = ({ companyId, meetingId, ...payload }: TUpdateCategoryReq): Promise<any> => {
  return MainApi.patch(`/company/${companyId}/meeting/${meetingId}/agenda/category`, decamelizeKeys(payload))
}

export const updateTopicCategory = ({ companyId, meetingId, ...payload }: TUpdateTopicCategoryReq): Promise<TUpdateTopicCategoryReq> => {
  return MainApi.patch(`/company/${companyId}/meeting/${meetingId}/agenda/topic/move`, decamelizeKeys(payload, { deep: true }))
}

export const saveTemplate = ({ companyId, meetingId, ...payload }: SaveTemplate): Promise<{ message?: string }> => {
  return MainApi.post(`/company/${companyId}/meeting/${meetingId}/agenda/topic/template`, decamelizeKeys(payload, { deep: true }))
}

export const createTopic = ({ companyId, meetingId, ...payload }: TCreateTopicReq): Promise<TCreateOrUpdateTopicRes> => {
  return MainApi.post(`/company/${companyId}/meeting/${meetingId}/agenda/topic`, decamelizeKeys(payload))
}

export const updateTopic = ({ companyId, meetingId, ...payload }: TUpdateTopicReq): Promise<TCreateOrUpdateTopicRes> => {
  return MainApi.patch(`/company/${companyId}/meeting/${meetingId}/agenda/topic`, decamelizeKeys(payload, { deep: true }))
}

export const deleteTopic = ({ companyId, meetingId, ...payload }: TDeleteTopicReq): Promise<any> => {
  return MainApi.delete(`/company/${companyId}/meeting/${meetingId}/agenda/topic`, decamelizeKeys(payload))
}

export const getAllAgendaTopics = ({ companyId, meetingId }: TGetTopics): Promise<any> => {
  return MainApi.get(`/company/${companyId}/meeting/${meetingId}/agenda/topic/list`)
}

export const getMeetingPack = ({ companyId, meetingId }: { companyId: string, meetingId: string }): Promise<TGetMeetingPackRes> => {
  return MainApi.get(`/company/${companyId}/meeting/${meetingId}/meeting-pack`)
}

export const getMeetingPackDocument = ({
  companyId,
  meetingId,
  documentId,
  documentType,
}: TGetMeetingPackDocumentReq): Promise<TMeetingPackDocument> => {
  return MainApi.get(`/company/${companyId}/meeting/${meetingId}/meeting-pack/${documentId}`, decamelizeKeys({ documentType }))
}

export const getMinutesDocument = ({ companyId, meetingId }: TGetMinutesDoc): Promise<any> => {
  return MainApi.get(`/company/${companyId}/minutes/${meetingId}`)
}

export const previewMinute = ({
  companyId,
  meetingId,
}: TGetMinutesDoc): Promise<any> => {
  return MainApi.get(`/company/${companyId}/minutes/${meetingId}/preview`)
}

export const refreshMeeting = ({
  companyId,
  meetingId,
}: TRefreshMeetingReq) => {
  return MainApi.post(
    `/company/${companyId}/meeting/${meetingId}/agenda/refresh`,
    {}
  )
}

export const applyTemplate = ({
  companyId,
  meetingId,
}: TRefreshMeetingReq) => {
  return MainApi.post(
    `/company/${companyId}/meeting/${meetingId}/agenda/topic/template/apply`,
    {}
  )
}


export const deleteMeetingPack = ({
  companyId,
  meetingId,
  documentId,
  docType
}: {
  companyId: string;
  meetingId: string;
  documentId: string;
  docType: string;
}): Promise<{ message: string }> => {
  return MainApi.delete(`/company/${companyId}/meeting/${meetingId}/meeting-pack/${documentId}?document_type=${docType}`);
};

export const uploadTranscript = async ({
  companyId,
  meetingId,
  ...payload
}: TUploadTranscipt) => {
  if (!payload?.file) {
    return;
  }
  const formData = new FormData();
  formData.append('file', payload?.file);
  return await MainApi.post(
    `/company/${companyId}/meeting/${meetingId}/transcript`,
    formData,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => { },
    true
  );
};
