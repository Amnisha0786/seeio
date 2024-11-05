export type TActionOwner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type TRecordDetails = {
  categoryId: string;
  docType: string;
  parentId: string;
  recordType: string;
  meetingId: string;
  id: string;
  name: string;
};

export type TAction = {
  id: string;
  agendaName?: string;
  agendaId?: string;
  topicId?: string;
  companyId?: string;
  dueDate: string;
  linkId: string;
  name: string;
  owner?: TActionOwner;
  description?: string;
  status?: string;
  recordDetail?: TRecordDetails;
  startedAt?: string;
  agenda?: {
    agendaType?: string;
    categoryId?: string;
    categoryName?: string;
    categoryType?: string;
    id: string;
    meetingId?: string;
    order?: number;
    recType: string;
  };
  topic?: {
    agendaType?: string;
    categoryId?: string;
    id?: string;
    recType?: string;
    records?: string;
    topicId?: string;
    topicName?: string;
    topicType?: string;
  };
  meeting?: {
    agendaStatus?: string;
    date?: string;
    dateCreated?: string;
    id?: string;
    isVirtual?: string;
    location?: string;
    name?: string;
    status?: string;
    type?: string;
  };
};
